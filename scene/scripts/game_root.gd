extends Control

const SCREENS := {
	"garden":    "res://scenes/main.tscn",
	"hives":     "res://scenes/hives.tscn",
	"shop":      "res://scenes/shop.tscn",
	"inventory": "res://scenes/inventory.tscn",
	"progress":  "res://scenes/progress.tscn",
	"expand":    "res://scenes/expand.tscn",
	"planets":   "res://scenes/planets.tscn",
	"settings":  "res://scenes/settings.tscn",
	"almanac":   "res://scenes/almanac.tscn",
	"discover":  "res://scenes/discover.tscn",
	"classification": "res://scenes/classification.tscn",
	"help":      "res://scenes/help.tscn",
}

var _current_screen: Node = null

@onready var screen_container: Control = $VBox/ScreenContainer
@onready var tab_bar: HBoxContainer = $VBox/TabBar

func _ready() -> void:
	GameState.navigate_requested.connect(_navigate)
	_navigate("garden")

func _navigate(screen_key: String) -> void:
	if _current_screen:
		_current_screen.queue_free()
	var scene := load(SCREENS[screen_key]) as PackedScene
	_current_screen = scene.instantiate()
	if _current_screen is Control:
		_current_screen.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	screen_container.add_child(_current_screen)

func _on_tab_garden() -> void:   _navigate("garden")
func _on_tab_hives() -> void:    _navigate("hives")
func _on_tab_shop() -> void:     _navigate("shop")
func _on_tab_inventory() -> void: _navigate("inventory")
func _on_tab_progress() -> void: _navigate("progress")
func _on_tab_discover() -> void: _navigate("discover")
func _on_tab_expand() -> void:   _navigate("expand")
func _on_tab_planets() -> void:  _navigate("planets")
func _on_tab_settings() -> void: _navigate("settings")
