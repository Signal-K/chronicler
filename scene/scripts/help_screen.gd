extends Control

const HELP_SECTIONS := [
	{
		"id": "basics",
		"title": "Getting Started",
		"icon": "🌱",
		"content": [
			{
				"question": "How do I plant crops?",
				"answer": "First, tap the Till button (🚜) and tap an empty plot to prepare the soil. Then tap Plant (🌱), select a seed type, and tap the tilled plot to plant. Don't forget to water your plants!"
			},
			{
				"question": "How do I water my plants?",
				"answer": "Tap the Water button (💧) in the toolbar, then tap any planted plot that needs water. Your water supply is shown at the top of the screen and refills over time."
			},
			{
				"question": "When can I harvest?",
				"answer": "Crops go through growth stages. When a plant is fully grown (you'll see the mature plant image), tap the Harvest button (🌾) and tap the ready crop to collect it."
			},
			{
				"question": "What do I do with harvested crops?",
				"answer": "Harvested crops go to your inventory. You can sell them at the shop for coins, or they contribute to your hive's honey production. Different crops produce different types of honey!"
			}
		]
	},
	{
		"id": "navigation",
		"title": "Navigation & Controls",
		"icon": "🧭",
		"content": [
			{
				"question": "How do I navigate between screens?",
				"answer": "Use the arrow buttons at the bottom of the screen. Left (◀️) goes to Hives, right arrows navigate farm pages. The center label shows your current location."
			},
			{
				"question": "What do the header icons mean?",
				"answer": "☀️/🌙 Weather (tap for Settings) | ⭐ Level (tap for XP details) | 💧 Water supply | 🪙 Coins (tap for Shop)"
			},
			{
				"question": "How do I access my inventory?",
				"answer": "Your inventory can be accessed through the bottom panel system. Seeds, crops, tools, and honey bottles are organized in tabs."
			},
			{
				"question": "What's the toolbar?",
				"answer": "The toolbar at the bottom shows your farming tools: Till, Plant, Water, and Harvest. Tap a tool to select it, then tap the plot you want to use it on."
			}
		]
	},
	{
		"id": "bees",
		"title": "Bees & Hives",
		"icon": "🐝",
		"content": [
			{
				"question": "How do I get bees?",
				"answer": "Bees are attracted by your pollination score. Every time you harvest crops, you earn pollination points. When you reach the threshold, new bees will hatch and join your hives!"
			},
			{
				"question": "What is the Pollination Factor?",
				"answer": "The pollination factor represents how attractive your garden is to bees. Higher pollination means more bees will join your hives. Check your score on the Hives screen."
			},
			{
				"question": "How do I build more hives?",
				"answer": "On the Hives screen, you'll see an option to build new hives if you have enough coins. Each hive can hold up to 10 bees and produces honey independently."
			},
			{
				"question": "What do bees do?",
				"answer": "Bees collect nectar from your harvested crops and produce honey. More bees = faster honey production. They also allow you to make more daily bee classifications."
			},
			{
				"question": "What is bee classification?",
				"answer": "Tap hovering bees on your farm to classify them! This mini-game earns you XP and counts toward achievements. Your daily classification limit increases with each hive you own."
			}
		]
	}
	# ... more sections can be added following the same pattern
]

@onready var section_list: VBoxContainer = $Scroll/SectionList
var expanded_section: String = ""

func _ready() -> void:
	_rebuild_help()

func _rebuild_help() -> void:
	for child in section_list.get_children():
		child.queue_free()
	
	for section in HELP_SECTIONS:
		var section_btn := Button.new()
		section_btn.text = "%s %s" % [section["icon"], section["title"]]
		section_btn.alignment = HorizontalAlignment.HORIZONTAL_ALIGNMENT_LEFT
		section_btn.pressed.connect(func(): _toggle_section(section["id"]))
		section_list.add_child(section_btn)
		
		if expanded_section == section["id"]:
			var content_panel := VBoxContainer.new()
			content_panel.add_theme_constant_override("separation", 10)
			for item in section["content"]:
				var q_lbl := Label.new()
				q_lbl.text = "Q: " + item["question"]
				q_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
				q_lbl.modulate = Color(1.0, 0.9, 0.6)
				
				var a_lbl := Label.new()
				a_lbl.text = "A: " + item["answer"]
				a_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
				a_lbl.modulate = Color(0.9, 0.9, 0.9)
				
				content_panel.add_child(q_lbl)
				content_panel.add_child(a_lbl)
				content_panel.add_child(HSeparator.new())
			section_list.add_child(content_panel)

func _toggle_section(section_id: String) -> void:
	if expanded_section == section_id:
		expanded_section = ""
	else:
		expanded_section = section_id
	_rebuild_help()

func _on_back_pressed() -> void:
	GameState.navigate_requested.emit("garden") # Default back to garden or previous
