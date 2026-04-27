extends Button

signal plot_pressed(index: int)

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

# Flat-colour styleboxes — look sharp at any size, no tiling artefacts
var _style_empty: StyleBoxFlat
var _style_tilled: StyleBoxFlat
var _style_crop: StyleBoxFlat
var _style_hover: StyleBoxFlat
var _style_pressed: StyleBoxFlat
var _style_focus := StyleBoxEmpty.new()

var plot_index: int = 0

@onready var sprite: TextureRect = $Sprite
@onready var label: Label = $Label

func _ready() -> void:
	_build_styles()
	pressed.connect(func(): plot_pressed.emit(plot_index))
	GameState.plot_changed.connect(_on_plot_changed)
	_refresh()

func _build_styles() -> void:
	_style_empty = _flat(Color(0.20, 0.50, 0.12), Color(0.15, 0.38, 0.08), 10)
	_style_tilled = _flat(Color(0.46, 0.29, 0.11), Color(0.34, 0.20, 0.07), 10)
	_style_crop   = _flat(Color(0.34, 0.20, 0.07), Color(0.25, 0.14, 0.04), 10)
	_style_hover   = _flat(Color(0.30, 0.60, 0.20), Color(0.20, 0.45, 0.12), 10)
	_style_pressed = _flat(Color(0.16, 0.40, 0.08), Color(0.12, 0.30, 0.05), 10)
	add_theme_stylebox_override("focus", _style_focus)

func _flat(top: Color, bottom: Color, radius: int) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = top
	s.corner_radius_top_left    = radius
	s.corner_radius_top_right   = radius
	s.corner_radius_bottom_right = radius
	s.corner_radius_bottom_left = radius
	s.border_width_top    = 2
	s.border_width_bottom = 2
	s.border_width_left   = 2
	s.border_width_right  = 2
	s.border_color = bottom
	return s

func _on_plot_changed(index: int) -> void:
	if index == plot_index:
		_refresh()

func _load_tex(path: String) -> Texture2D:
	return load(path) if ResourceLoader.exists(path) else null

func _refresh() -> void:
	if plot_index >= GameState.plots.size(): return
	var p: Dictionary = GameState.plots[plot_index]
	match p["state"]:
		"empty":
			sprite.texture = null
			label.text = ""
			add_theme_stylebox_override("normal",  _style_empty)
			add_theme_stylebox_override("hover",   _style_hover)
			add_theme_stylebox_override("pressed", _style_pressed)
		"tilled":
			sprite.texture = null
			label.text = ""
			add_theme_stylebox_override("normal",  _style_tilled)
			add_theme_stylebox_override("hover",   _style_hover)
			add_theme_stylebox_override("pressed", _style_pressed)
		"planted", "growing":
			var stages: Array = STAGE_SPRITES.get(p["crop_id"], WHEAT_STAGES)
			var stage_idx := clampi(p["growth_stage"], 0, stages.size() - 1)
			sprite.texture = _load_tex(stages[stage_idx])
			label.text = ""
			add_theme_stylebox_override("normal",  _style_crop)
			add_theme_stylebox_override("hover",   _style_hover)
			add_theme_stylebox_override("pressed", _style_pressed)
		"harvestable":
			var crop_path: String = FULL_SPRITES.get(p["crop_id"], "")
			sprite.texture = _load_tex(crop_path) if crop_path else null
			label.text = "✓"
			add_theme_stylebox_override("normal",  _style_crop)
			add_theme_stylebox_override("hover",   _style_hover)
			add_theme_stylebox_override("pressed", _style_pressed)
