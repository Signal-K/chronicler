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
	if not SCREENS.has(screen_key):
		push_error("Screen key not found: " + screen_key)
		return

	var old_screen = _current_screen
	var scene_path: String = SCREENS[screen_key]
	var scene := load(scene_path) as PackedScene
	
	_current_screen = scene.instantiate()
	if _current_screen is Control:
		_current_screen.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	
	# Transition: Slide in from the right and fade in
	_current_screen.modulate.a = 0.0
	_current_screen.position.x = 50.0 # Start slightly to the right
	screen_container.add_child(_current_screen)
	
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUART).set_ease(Tween.EASE_OUT)
	tween.tween_property(_current_screen, "modulate:a", 1.0, 0.4)
	tween.tween_property(_current_screen, "position:x", 0.0, 0.4)
	
	if old_screen:
		# Transition: Slide out to the left and fade out
		tween.tween_property(old_screen, "modulate:a", 0.0, 0.3)
		tween.tween_property(old_screen, "position:x", -50.0, 0.3)
		tween.set_parallel(false) # Wait for finish
		tween.tween_callback(old_screen.queue_free)

func _on_tab_garden() -> void:   _navigate("garden")
func _on_tab_hives() -> void:    _navigate("hives")
func _on_tab_shop() -> void:     _navigate("shop")
func _on_tab_inventory() -> void: _navigate("inventory")
func _on_tab_progress() -> void: _navigate("progress")
func _on_tab_discover() -> void: _navigate("discover")
func _on_tab_expand() -> void:   _navigate("expand")
func _on_tab_planets() -> void:  _navigate("planets")
func _on_tab_settings() -> void: _navigate("settings")
