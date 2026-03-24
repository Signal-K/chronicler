extends Button

signal plot_pressed(index: int)

const CROP_SPRITES := {
	"":          null,
	"tomato":    "res://assets/sprites/crops/tomato_full.png",
	"blueberry": "res://assets/sprites/crops/blueberry_full.png",
	"lavender":  "res://assets/sprites/crops/lavender_full.png",
	"sunflower": "res://assets/sprites/crops/sunflower_full.png",
	"pumpkin":   "res://assets/sprites/crops/pumpkin_full.png",
	"potato":    "res://assets/sprites/crops/potato_full.png",
}
const STAGE_SPRITES := [
	"res://assets/sprites/crops/wheat_seed.png",
	"res://assets/sprites/crops/wheat_sprout.png",
	"res://assets/sprites/crops/wheat_mid.png",
	"res://assets/sprites/crops/wheat_full.png",
]

var plot_index: int = 0

@onready var sprite: TextureRect = $Sprite
@onready var label: Label = $Label

func _ready() -> void:
	pressed.connect(func(): plot_pressed.emit(plot_index))
	GameState.plot_changed.connect(_on_plot_changed)
	_refresh()

func _on_plot_changed(index: int) -> void:
	if index == plot_index:
		_refresh()

func _refresh() -> void:
	if plot_index >= GameState.plots.size(): return
	var p: Dictionary = GameState.plots[plot_index]
	match p["state"]:
		"empty":
			sprite.texture = null
			label.text = "[ ]"
		"tilled":
			sprite.texture = null
			label.text = "[~]"
		"planted", "growing":
			var stage_idx := clampi(p["growth_stage"], 0, STAGE_SPRITES.size() - 1)
			sprite.texture = load(STAGE_SPRITES[stage_idx])
			label.text = ""
		"harvestable":
			var crop_path: String = CROP_SPRITES.get(p["crop_id"], "")
			if crop_path and ResourceLoader.exists(crop_path):
				sprite.texture = load(crop_path)
			label.text = "✓"
