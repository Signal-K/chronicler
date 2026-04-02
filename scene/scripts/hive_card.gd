extends PanelContainer

const UIFwk = preload("res://scripts/ui_framework.gd")

@onready var hive_icon_label: Label = $CardMargin/CardRow/HiveIconLabel
@onready var hive_name: Label = $CardMargin/CardRow/InfoColumn/HiveName
@onready var bee_count_label: Label = $CardMargin/CardRow/InfoColumn/StatsRow/BeeCountLabel
@onready var honey_label: Label = $CardMargin/CardRow/InfoColumn/StatsRow/HoneyLabel
@onready var production_label: Label = $CardMargin/CardRow/InfoColumn/StatsRow/ProductionLabel
@onready var bottle_button: Button = $CardMargin/CardRow/InfoColumn/BottleButton
@onready var bee_progress_bar: ProgressBar = $CardMargin/CardRow/InfoColumn/BeeProgressRow/BeeProgressBar

var hive_id := ""

func _ready() -> void:
	UIFwk.style_amber_panel(self)
	hive_icon_label.add_theme_font_size_override("font_size", 44)
	UIFwk.style_amber_text(hive_name)
	hive_name.add_theme_font_size_override("font_size", 16)
	UIFwk.style_amber_muted(bee_count_label)
	UIFwk.style_amber_muted(honey_label)
	honey_label.add_theme_font_size_override("font_size", 13)
	UIFwk.style_amber_muted(production_label)
	production_label.add_theme_font_size_override("font_size", 12)
	# Style bee progress bar amber
	var bar_fill := StyleBoxFlat.new()
	bar_fill.bg_color = UIFwk.AMBER_BORDER
	bar_fill.corner_radius_top_left = 4
	bar_fill.corner_radius_top_right = 4
	bar_fill.corner_radius_bottom_right = 4
	bar_fill.corner_radius_bottom_left = 4
	bee_progress_bar.add_theme_stylebox_override("fill", bar_fill)
	var bar_bg := StyleBoxFlat.new()
	bar_bg.bg_color = Color("78350f")
	bar_bg.corner_radius_top_left = 4
	bar_bg.corner_radius_top_right = 4
	bar_bg.corner_radius_bottom_right = 4
	bar_bg.corner_radius_bottom_left = 4
	bee_progress_bar.add_theme_stylebox_override("background", bar_bg)
	bee_progress_bar.max_value = GameState.MAX_BEES_PER_HIVE


func configure(data: Dictionary) -> void:
	hive_id = str(data.get("id", "hive"))
	hive_name.text = str(data.get("name", "Hive"))
	var bee_count := int(data.get("bee_count", 0))
	bee_count_label.text = "🐝 %d / %d bees" % [bee_count, GameState.MAX_BEES_PER_HIVE]
	bee_progress_bar.value = bee_count
	var honey := int(data.get("honey_bottles", 0))
	honey_label.text = "🍯 %d/15" % honey
	bottle_button.disabled = honey <= 0
	bottle_button.text = "Collect Honey" if honey > 0 else "No Honey Ready"
	if honey > 0:
		UIFwk.style_amber_button(bottle_button)
	else:
		UIFwk.style_disabled_button(bottle_button)

	if bee_count > 0 and honey <= 0:
		production_label.text = "🟢 Producing"
		production_label.add_theme_color_override("font_color", Color("166534"))
	elif honey >= 15:
		production_label.text = "🟡 Full"
		production_label.add_theme_color_override("font_color", Color("92400e"))
	elif bee_count == 0:
		production_label.text = "🔴 No bees"
		production_label.add_theme_color_override("font_color", Color("9f1239"))
	else:
		production_label.text = "🟢 Active"
		production_label.add_theme_color_override("font_color", Color("166534"))
