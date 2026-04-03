extends Control

@onready var level_label: Label = $VBox/LevelLabel
@onready var xp_bar: ProgressBar = $VBox/XPBar
@onready var xp_label: Label = $VBox/XPLabel

func _ready() -> void:
	GameState.level_up.connect(_on_level_up)
	_refresh()

func _refresh() -> void:
	level_label.text = "Level %d" % GameState.level
	var progress := GameState.xp_progress()
	xp_bar.value = progress * 100.0
	
	var current_xp = GameState.xp
	var next_threshold = GameState.xp_for_level(GameState.level + 1)
	xp_label.text = "XP: %d / %d" % [current_xp, next_threshold]

func _on_level_up(_new_level: int) -> void:
	_refresh()

func _on_almanac_pressed() -> void:
	GameState.navigate_requested.emit("almanac")
