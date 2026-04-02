extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")

@onready var sections: VBoxContainer = $Root/ScrollRoot/ContentBox/ContentMargin/Sections

const HELP_SECTIONS: Array = [
	{
		"title": "🌾 The Farm Loop",
		"entries": [
			["Till", "Select the Till tool and tap an empty plot to prepare the soil."],
			["Plant", "Select the Plant tool, choose a crop, then tap a tilled plot. Uses 1 seed."],
			["Water", "Select the Water tool and tap a plot when it shows 💧 Water. Uses 1 water."],
			["Harvest", "Select Harvest and tap a plot showing ✨ Harvest. Earns coins, seeds, and XP."],
			["Tip", "Lavender and Sunflower harvests award Pollination XP, which hatches new bees!"],
		],
	},
	{
		"title": "🍯 Honey Types",
		"entries": [
			["Light Honey 🍯",     "Produced when Tomato is your most-harvested crop. Base price: 15 coins."],
			["Amber Honey 🍯",     "Produced from Blueberry or Sunflower crops. Base price: 20 coins."],
			["Specialty Honey ✨", "Produced from Lavender crops. Highest value! Base price: 35 coins."],
			["Wildflower Blend 🌸","Default when no crop dominates. Base price: 18 coins."],
			["Quality",            "Bottle quality (0–100) is based on bee count, production hours, and crop diversity."],
		],
	},
	{
		"title": "🐝 Hives & Honey",
		"entries": [
			["Production",       "Hives produce honey continuously as long as bees are present (cap: 15 bottles)."],
			["Bottling",         "Use a glass bottle to collect honey from a hive. Earn 3 coins per bottle."],
			["Bee hatching",     "Every 3 Pollination events, a new bee hatches in a random hive (cap: 12 bees)."],
			["Orders",           "Fulfill daily orders for specific honey types to earn coins and XP."],
			["Daily quota",      "After fulfilling 2 orders of the same honey type in a day, rewards halve."],
		],
	},
	{
		"title": "⭐ Experience & Levels",
		"entries": [
			["Harvesting",    "+1 XP per harvest. +11 XP for first-ever harvest of a new crop type."],
			["Pollination",   "+10 XP per pollination event (harvest lavender or sunflower)."],
			["Honey orders",  "XP scales with honey type's base XP and bottles shipped."],
			["Planet discovery", "+10 XP per planet classified."],
			["Plot upgrades", "Unlocked at levels 2, 5, and 10 for 50 / 150 / 300 coins. +6 plots each."],
		],
	},
	{
		"title": "🗺️ Biome Maps",
		"entries": [
			["Home Farm",     "Default — 1.0× growth speed."],
			["Desert Oasis",  "Unlock: 100 coins — 0.9× growth (slower)."],
			["Misty Swamp",   "Unlock: 100 coins — 1.1× growth."],
			["Ocean Platform","Unlock: 100 coins — 1.0× growth."],
			["Deep Forest",   "Unlock: 100 coins — 1.2× growth (fastest)."],
			["Tip",           "Growth speed also affects how quickly water regenerates."],
		],
	},
	{
		"title": "🪐 Planets",
		"entries": [
			["Discovery",     "Press 'Discover New Planet' to classify an anomaly and add it to your catalog."],
			["Planet types",  "Desert World, Forest World, Ocean World, Ice World, Volcanic World."],
			["Life badge 🌱", "Planets with conditions suitable for life show a green badge."],
			["XP",            "+10 XP per discovery."],
		],
	},
	{
		"title": "⚙️ Tips & Shortcuts",
		"entries": [
			["Water regen",   "Water refills automatically. Speed scales with your growth speed setting."],
			["Speed slider",  "Adjust growth speed in Settings (0.25× to 4.0×). Higher = faster regen too."],
			["Debug",         "Settings has buttons to add coins, water, seeds, and bottles for testing."],
			["Reset tutorial","Both farm and hive tutorials can be reset individually in Settings."],
		],
	},
]


func _ready() -> void:
	_apply_ui_theme()
	_build_sections()


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_header_panel($Root/HeaderPanel)
	UIFwk.style_warm_title($Root/HeaderPanel/HeaderMargin/Title, 22)


func _build_sections() -> void:
	for section_data in HELP_SECTIONS:
		var section_panel := PanelContainer.new()
		UIFwk.style_warm_panel(section_panel)
		sections.add_child(section_panel)

		var section_margin := MarginContainer.new()
		section_margin.add_theme_constant_override("margin_left", 14)
		section_margin.add_theme_constant_override("margin_top", 12)
		section_margin.add_theme_constant_override("margin_right", 14)
		section_margin.add_theme_constant_override("margin_bottom", 12)
		section_panel.add_child(section_margin)

		var section_body := VBoxContainer.new()
		section_body.add_theme_constant_override("separation", 6)
		section_margin.add_child(section_body)

		var title_label := Label.new()
		title_label.text = str(section_data.get("title", ""))
		UIFwk.style_warm_section(title_label)
		section_body.add_child(title_label)

		var separator := HSeparator.new()
		var sep_style := StyleBoxFlat.new()
		sep_style.bg_color = UIFwk.WARM_PANEL_BORDER
		separator.add_theme_stylebox_override("separator", sep_style)
		section_body.add_child(separator)

		for entry in section_data.get("entries", []):
			var row := HBoxContainer.new()
			row.add_theme_constant_override("separation", 8)
			section_body.add_child(row)

			var key_label := Label.new()
			key_label.text = str(entry[0])
			key_label.custom_minimum_size = Vector2(130, 0)
			UIFwk.style_amber_text(key_label)
			key_label.add_theme_font_size_override("font_size", 12)
			row.add_child(key_label)

			var val_label := Label.new()
			val_label.text = str(entry[1])
			val_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			val_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
			UIFwk.style_amber_muted(val_label)
			val_label.add_theme_font_size_override("font_size", 12)
			row.add_child(val_label)
