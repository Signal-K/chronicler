extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var coins_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/CoinsLabel
@onready var bottles_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/BottlesLabel
@onready var glass_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/GlassLabel
@onready var water_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/WaterLabel
@onready var plot_pages_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/PlotPagesLabel
@onready var total_harvest_label: Label = $ScrollRoot/Root/Summary/SummaryMargin/SummaryBody/TotalHarvestLabel

@onready var tomato_seed_label: Label = $ScrollRoot/Root/SeedsPanel/SeedsMargin/SeedsBody/TomatoSeedLabel
@onready var blueberry_seed_label: Label = $ScrollRoot/Root/SeedsPanel/SeedsMargin/SeedsBody/BlueberrySeedLabel
@onready var lavender_seed_label: Label = $ScrollRoot/Root/SeedsPanel/SeedsMargin/SeedsBody/LavenderSeedLabel
@onready var sunflower_seed_label: Label = $ScrollRoot/Root/SeedsPanel/SeedsMargin/SeedsBody/SunflowerSeedLabel

@onready var tomato_harvest_label: Label = $ScrollRoot/Root/CropsPanel/CropsMargin/CropsBody/TomatoHarvestLabel
@onready var blueberry_harvest_label: Label = $ScrollRoot/Root/CropsPanel/CropsMargin/CropsBody/BlueberryHarvestLabel
@onready var lavender_harvest_label: Label = $ScrollRoot/Root/CropsPanel/CropsMargin/CropsBody/LavenderHarvestLabel
@onready var sunflower_harvest_label: Label = $ScrollRoot/Root/CropsPanel/CropsMargin/CropsBody/SunflowerHarvestLabel

func _ready() -> void:
	_apply_ui_theme()
	_refresh_ui()
	GameState.resources_changed.connect(_refresh_ui)


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_warm_title($ScrollRoot/Root/Title, 26)
	UIFwk.style_warm_panel($ScrollRoot/Root/Summary)
	UIFwk.style_warm_panel($ScrollRoot/Root/SeedsPanel)
	UIFwk.style_warm_panel($ScrollRoot/Root/CropsPanel)
	# Summary labels
	UIFwk.style_amber_text(coins_label)
	UIFwk.style_warm_text(bottles_label)
	UIFwk.style_warm_text(glass_label)
	UIFwk.style_warm_section(total_harvest_label)
	UIFwk.style_accent_blue(water_label)
	UIFwk.style_amber_muted(plot_pages_label)
	# Seeds section header
	UIFwk.style_warm_section($ScrollRoot/Root/SeedsPanel/SeedsMargin/SeedsBody/SeedsTitle)
	# Crops section header
	UIFwk.style_warm_section($ScrollRoot/Root/CropsPanel/CropsMargin/CropsBody/CropsTitle)


func _refresh_ui() -> void:
	coins_label.text = "Coins: %d" % GameState.coins
	water_label.text = "Water: %d / %d" % [GameState.water, GameState.max_water]
	plot_pages_label.text = "Farm Pages: %d (%d plots)" % [GameState.plot_pages, GameState.get_plot_count()]
	var honey_inv: Dictionary = GameState.honey_type_inventory
	var honey_parts: Array = []
	var honey_cfg_map: Dictionary = GameState.HONEY_TYPE_CONFIG
	for htype in ["wildflower", "light", "amber", "specialty"]:
		var count := int(honey_inv.get(htype, 0))
		if count > 0:
			var cfg: Dictionary = honey_cfg_map.get(htype, {})
			var emoji: String = str(cfg.get("emoji", "🍯"))
			honey_parts.append("%s×%d" % [emoji, count])
	if honey_parts.is_empty():
		bottles_label.text = "Bottled Honey: none"
	else:
		bottles_label.text = "Bottled Honey: " + ", ".join(honey_parts)
	glass_label.text = "Glass Bottles: %d" % GameState.glass_bottles

	var tomato_h := int(GameState.harvested.get("tomato", 0))
	var blueberry_h := int(GameState.harvested.get("blueberry", 0))
	var lavender_h := int(GameState.harvested.get("lavender", 0))
	var sunflower_h := int(GameState.harvested.get("sunflower", 0))
	var total_h := tomato_h + blueberry_h + lavender_h + sunflower_h
	total_harvest_label.text = "Total Harvested Crops: %d" % total_h

	tomato_seed_label.text = "Tomato Seeds: %d" % GameState.get_seed_count("tomato")
	blueberry_seed_label.text = "Blueberry Seeds: %d" % GameState.get_seed_count("blueberry")
	lavender_seed_label.text = "Lavender Seeds: %d" % GameState.get_seed_count("lavender")
	sunflower_seed_label.text = "Sunflower Seeds: %d" % GameState.get_seed_count("sunflower")

	tomato_harvest_label.text = "Tomatoes Harvested: %d" % tomato_h
	blueberry_harvest_label.text = "Blueberries Harvested: %d" % blueberry_h
	lavender_harvest_label.text = "Lavender Harvested: %d" % lavender_h
	sunflower_harvest_label.text = "Sunflowers Harvested: %d" % sunflower_h


func _on_refresh_tick() -> void:
	_refresh_ui()
