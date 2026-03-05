extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var level_label: Label = $Root/Overview/OverviewMargin/OverviewBody/LevelLabel
@onready var xp_label: Label = $Root/Overview/OverviewMargin/OverviewBody/XPLabel
@onready var progress_bar: ProgressBar = $Root/Overview/OverviewMargin/OverviewBody/XPProgressBar
@onready var harvests_label: Label = $Root/Stats/StatsMargin/StatsBody/HarvestsLabel
@onready var unique_harvests_label: Label = $Root/Stats/StatsMargin/StatsBody/UniqueHarvestsLabel
@onready var pollination_label: Label = $Root/Stats/StatsMargin/StatsBody/PollinationLabel
@onready var sales_label: Label = $Root/Stats/StatsMargin/StatsBody/SalesLabel
@onready var classifications_label: Label = $Root/Stats/StatsMargin/StatsBody/ClassificationsLabel
@onready var status_label: Label = $Root/Actions/ActionsMargin/ActionsBody/StatusLabel

@onready var pollination_button: Button = $Root/Actions/ActionsMargin/ActionsBody/ActionButtons/AwardPollinationButton
@onready var classification_button: Button = $Root/Actions/ActionsMargin/ActionsBody/ActionButtons/AwardClassificationButton

func _ready() -> void:
	_apply_ui_theme()
	pollination_button.pressed.connect(_on_award_pollination)
	classification_button.pressed.connect(_on_award_classification)
	_refresh_ui()


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_warm_title($Root/Title, 26)
	# Section panels
	UIFwk.style_warm_panel($Root/Overview)
	UIFwk.style_warm_panel($Root/Stats)
	UIFwk.style_warm_panel($Root/Actions)
	# Labels
	UIFwk.style_warm_section($Root/Overview/OverviewMargin/OverviewBody/LevelLabel)
	UIFwk.style_warm_text(xp_label)
	UIFwk.style_warm_text(harvests_label)
	UIFwk.style_warm_text(unique_harvests_label)
	UIFwk.style_warm_text(pollination_label)
	UIFwk.style_warm_text(sales_label)
	UIFwk.style_warm_text(classifications_label)
	UIFwk.style_warm_muted(status_label)
	# Buttons
	UIFwk.style_button(pollination_button, Color("0f766e"))
	UIFwk.style_button(classification_button, Color("1d4ed8"))


func _on_award_pollination() -> void:
	var event: Dictionary = GameState.award_pollination_xp()
	GameState.save_state()
	status_label.text = "Awarded +%d pollination XP" % int(event.get("gained", 0))
	_refresh_ui()


func _on_award_classification() -> void:
	var event: Dictionary = GameState.award_classification_xp()
	GameState.save_state()
	status_label.text = "Awarded +%d classification XP" % int(event.get("gained", 0))
	_refresh_ui()


func _refresh_ui() -> void:
	var info: Dictionary = GameState.get_progress_info()
	level_label.text = "Level: %d" % int(info.get("level", 1))
	xp_label.text = "XP: %d / %d (Total: %d)" % [
		int(info.get("xp_in_level", 0)),
		int(info.get("xp_needed", 1)),
		int(info.get("total_xp", 0)),
	]
	progress_bar.value = float(info.get("progress", 0.0)) * 100.0

	harvests_label.text = "Harvests: %d" % GameState.harvests_count
	unique_harvests_label.text = "Unique Harvests: %d" % GameState.unique_harvests.size()
	pollination_label.text = "Pollination Events: %d" % GameState.pollination_events
	sales_label.text = "Sales Completed: %d" % GameState.sales_completed
	classifications_label.text = "Classifications: %d" % GameState.classifications_completed
