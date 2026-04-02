extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var coins_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/CoinsLabel
@onready var water_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/WaterLabel
@onready var seeds_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/SeedsLabel
@onready var glass_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/GlassLabel
@onready var tutorial_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/TutorialLabel
@onready var hive_tutorial_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/HiveTutorialLabel
@onready var status_label: Label = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/StatusLabel

@onready var add_coins_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ButtonsRow1/AddCoinsButton
@onready var refill_water_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ButtonsRow1/RefillWaterButton
@onready var add_seeds_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ButtonsRow2/AddSeedsButton
@onready var add_glass_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ButtonsRow2/AddGlassButton
@onready var reset_farm_tutorial_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ButtonsRow3/ResetFarmTutorialButton
@onready var reset_hive_tutorial_button: Button = $ScrollRoot/Root/Actions/ActionsMargin/ActionsBody/ButtonsRow3/ResetHiveTutorialButton

@onready var growth_rate_label: Label = $ScrollRoot/Root/Growth/GrowthMargin/GrowthBody/GrowthRateLabel
@onready var growth_slider: HSlider = $ScrollRoot/Root/Growth/GrowthMargin/GrowthBody/GrowthSlider

func _ready() -> void:
	_apply_ui_theme()
	add_coins_button.pressed.connect(_on_add_coins)
	refill_water_button.pressed.connect(_on_refill_water)
	add_seeds_button.pressed.connect(_on_add_seeds)
	add_glass_button.pressed.connect(_on_add_glass)
	reset_farm_tutorial_button.pressed.connect(_on_reset_farm_tutorial)
	reset_hive_tutorial_button.pressed.connect(_on_reset_hive_tutorial)
	growth_slider.value = GameState.growth_speed_multiplier
	growth_slider.value_changed.connect(_on_growth_slider_changed)
	GameState.resources_changed.connect(_refresh_ui)
	_refresh_ui()


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_warm_title($ScrollRoot/Root/Title, 26)
	UIFwk.style_warm_panel($ScrollRoot/Root/Summary)
	UIFwk.style_warm_panel($ScrollRoot/Root/Actions)
	UIFwk.style_amber_muted(status_label)
	UIFwk.style_amber_button(add_coins_button)
	UIFwk.style_amber_button(refill_water_button)
	UIFwk.style_amber_button(add_seeds_button)
	UIFwk.style_amber_button(add_glass_button)
	UIFwk.style_amber_button(reset_farm_tutorial_button)
	UIFwk.style_amber_button(reset_hive_tutorial_button)
	# Growth section
	UIFwk.style_warm_panel($ScrollRoot/Root/Growth)
	UIFwk.style_warm_section($ScrollRoot/Root/Growth/GrowthMargin/GrowthBody/GrowthTitle)
	UIFwk.style_amber_muted($ScrollRoot/Root/Growth/GrowthMargin/GrowthBody/GrowthDescLabel)
	UIFwk.style_warm_text(growth_rate_label)


func _on_add_coins() -> void:
	GameState.add_coins(100)
	GameState.save_state()
	status_label.text = "Added 100 coins."
	_refresh_ui()


func _on_refill_water() -> void:
	GameState.refill_water(GameState.max_water)
	GameState.save_state()
	status_label.text = "Water refilled."
	_refresh_ui()


func _on_add_seeds() -> void:
	GameState.add_seed("tomato", 5)
	GameState.add_seed("blueberry", 5)
	GameState.add_seed("lavender", 5)
	GameState.add_seed("sunflower", 5)
	GameState.save_state()
	status_label.text = "Added 5 seeds for each crop."
	_refresh_ui()


func _on_add_glass() -> void:
	GameState.add_glass_bottle(5)
	GameState.save_state()
	status_label.text = "Added 5 glass bottles."
	_refresh_ui()


func _on_reset_farm_tutorial() -> void:
	GameState.tutorial_completed = false
	GameState.set_tutorial_step(0)
	GameState.save_state()
	status_label.text = "Farm tutorial reset."
	_refresh_ui()


func _on_reset_hive_tutorial() -> void:
	GameState.hive_tutorial_completed = false
	GameState.set_hive_tutorial_step(0)
	GameState.save_state()
	status_label.text = "Hive tutorial reset."
	_refresh_ui()


func _on_growth_slider_changed(value: float) -> void:
	GameState.growth_speed_multiplier = value
	GameState.save_state()
	_refresh_growth_label()


func _refresh_growth_label() -> void:
	var v := GameState.growth_speed_multiplier
	var label := "Slow (%.2f×)" % v
	if v < 0.9:
		label = "Slow (%.2f×)" % v
	elif v < 1.1:
		label = "Normal (%.2f×)" % v
	elif v < 2.5:
		label = "Fast (%.2f×)" % v
	else:
		label = "Very Fast (%.2f×)" % v
	growth_rate_label.text = "Speed: " + label
	growth_slider.value = v


func _refresh_ui() -> void:
	coins_label.text = "Coins: %d" % GameState.coins
	water_label.text = "Water: %d/%d" % [GameState.water, GameState.max_water]
	seeds_label.text = "Seeds(T/B/L/S): %d / %d / %d / %d" % [
		GameState.get_seed_count("tomato"),
		GameState.get_seed_count("blueberry"),
		GameState.get_seed_count("lavender"),
		GameState.get_seed_count("sunflower"),
	]
	glass_label.text = "Glass Bottles: %d" % GameState.glass_bottles
	tutorial_label.text = "Farm Tutorial: %s (step %d)" % [
		"done" if GameState.tutorial_completed else "active",
		GameState.tutorial_step_index,
	]
	hive_tutorial_label.text = "Hive Tutorial: %s (step %d)" % [
		"done" if GameState.hive_tutorial_completed else "active",
		GameState.hive_tutorial_step_index,
	]
	_refresh_growth_label()
