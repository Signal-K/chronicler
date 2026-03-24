extends Control

@onready var level_label: Label = $VBox/LevelLabel
@onready var xp_label: Label = $VBox/XPLabel
@onready var xp_bar: ProgressBar = $VBox/XPBar

func _ready() -> void:
	GameState.level_up.connect(func(_l): _refresh())
	GameState.inventory_changed.connect(_refresh)
	var almanac_btn = get_node_or_null("VBox/AlmanacBtn")
	if almanac_btn:
		almanac_btn.pressed.connect(_on_almanac_pressed)
	_refresh()

func _on_almanac_pressed() -> void:
	GameState.navigate_requested.emit("almanac")

func _refresh() -> void:
	level_label.text = "Level %d" % GameState.level
	var next := GameState.xp_for_level(GameState.level + 1)
	var cur := GameState.xp_for_level(GameState.level)
	xp_label.text = "XP: %d / %d" % [GameState.xp - cur, next - cur]
	xp_bar.value = GameState.xp_progress() * 100.0
