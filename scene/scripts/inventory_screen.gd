extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
@onready var coins_label: Label = $Root/Summary/SummaryMargin/SummaryBody/CoinsLabel
@onready var bottles_label: Label = $Root/Summary/SummaryMargin/SummaryBody/BottlesLabel
@onready var glass_label: Label = $Root/Summary/SummaryMargin/SummaryBody/GlassLabel
@onready var total_harvest_label: Label = $Root/Summary/SummaryMargin/SummaryBody/TotalHarvestLabel

@onready var tomato_seed_label: Label = $Root/SeedsPanel/SeedsMargin/SeedsBody/TomatoSeedLabel
@onready var blueberry_seed_label: Label = $Root/SeedsPanel/SeedsMargin/SeedsBody/BlueberrySeedLabel
@onready var lavender_seed_label: Label = $Root/SeedsPanel/SeedsMargin/SeedsBody/LavenderSeedLabel
@onready var sunflower_seed_label: Label = $Root/SeedsPanel/SeedsMargin/SeedsBody/SunflowerSeedLabel

@onready var tomato_harvest_label: Label = $Root/CropsPanel/CropsMargin/CropsBody/TomatoHarvestLabel
@onready var blueberry_harvest_label: Label = $Root/CropsPanel/CropsMargin/CropsBody/BlueberryHarvestLabel
@onready var lavender_harvest_label: Label = $Root/CropsPanel/CropsMargin/CropsBody/LavenderHarvestLabel
@onready var sunflower_harvest_label: Label = $Root/CropsPanel/CropsMargin/CropsBody/SunflowerHarvestLabel

func _ready() -> void:
	_apply_ui_theme()
	_refresh_ui()


func _apply_ui_theme() -> void:
	UIFwk.apply_screen_theme(self, $Root, $Root/Title)
	UIFwk.style_accent_gold(coins_label)
	UIFwk.style_accent_blue(glass_label)
	UIFwk.style_accent_green(total_harvest_label)


func _refresh_ui() -> void:
	coins_label.text = "Coins: %d" % GameState.coins
	bottles_label.text = "Bottled Honey: %d" % GameState.bottled_honey_inventory
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
