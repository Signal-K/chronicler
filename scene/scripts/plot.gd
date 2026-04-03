extends Button

signal plot_pressed(index: int)

# Stage sprites: [seed, sprout, mid, full] — per crop where available, wheat fallback
const STAGE_SPRITES := {
	"tomato":    [
		"res://assets/Sprites/Crops/Tomato/1 - Tomato Seed.png",
		"res://assets/Sprites/Crops/Tomato/2 - Tomato Sprout.png",
		"res://assets/Sprites/Crops/Tomato/3 - Tomato Mid.png",
		"res://assets/Sprites/Crops/Tomato/4 - Tomato Full.png",
	],
	"pumpkin":   [
		"res://assets/Sprites/Crops/Pumpkin/1 - Pumpkin Seed.png",
		"res://assets/Sprites/Crops/Pumpkin/2 - Pumpkin Sprout.png",
		"res://assets/Sprites/Crops/Pumpkin/3 - Pumpkin Mid.png",
		"res://assets/Sprites/Crops/Pumpkin/4 - Pumpkin Full.png",
	],
	"potato":    [
		"res://assets/Sprites/Crops/Potato/1 - Potato Seed.png",
		"res://assets/Sprites/Crops/Potato/2 - Potato Sprout.png",
		"res://assets/Sprites/Crops/Potato/3 - Potato Mid.png",
		"res://assets/Sprites/Crops/Potato/4 - Potato Full.png",
	],
}
# Crops without stage sets use wheat stages + their own full image
const WHEAT_STAGES := [
	"res://assets/Sprites/Crops/Wheat/1---Wheat-Seed.png",
	"res://assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png",
	"res://assets/Sprites/Crops/Wheat/3---Wheat-Mid.png",
	"res://assets/Sprites/Crops/Wheat/4---Wheat-Full.png",
]
const FULL_SPRITES := {
	"tomato":    "res://assets/Sprites/Crops/Tomato/4 - Tomato Full.png",
	"blueberry": "res://assets/Sprites/Crops/Blueberry.png",
	"lavender":  "res://assets/Sprites/Crops/Lavender.png",
	"sunflower": "res://assets/Sprites/Crops/Sunflower.png",
	"pumpkin":   "res://assets/Sprites/Crops/Pumpkin/4 - Pumpkin Full.png",
	"potato":    "res://assets/Sprites/Crops/Potato/4 - Potato Full.png",
}

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
			var stages: Array = STAGE_SPRITES.get(p["crop_id"], WHEAT_STAGES)
			var stage_idx := clampi(p["growth_stage"], 0, stages.size() - 1)
			var path: String = stages[stage_idx]
			sprite.texture = load(path) if ResourceLoader.exists(path) else null
			label.text = ""
		"harvestable":
			var crop_path: String = FULL_SPRITES.get(p["crop_id"], "")
			sprite.texture = load(crop_path) if crop_path and ResourceLoader.exists(crop_path) else null
			label.text = "✓"
