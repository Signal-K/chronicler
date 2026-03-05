extends PanelContainer

const UIFwk = preload("res://scripts/ui_framework.gd")

@onready var hive_icon_label: Label = $CardMargin/CardRow/HiveIconLabel
@onready var hive_name: Label = $CardMargin/CardRow/InfoColumn/HiveName
@onready var bee_count_label: Label = $CardMargin/CardRow/InfoColumn/StatsRow/BeeCountLabel
@onready var honey_label: Label = $CardMargin/CardRow/InfoColumn/StatsRow/HoneyLabel
@onready var production_label: Label = $CardMargin/CardRow/InfoColumn/StatsRow/ProductionLabel
@onready var bottle_button: Button = $CardMargin/CardRow/InfoColumn/BottleButton

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


func configure(data: Dictionary) -> void:
	hive_id = str(data.get("id", "hive"))
	hive_name.text = str(data.get("name", "Hive"))
	bee_count_label.text = "🐝 %d bees" % int(data.get("bee_count", 0))
	var honey := int(data.get("honey_bottles", 0))
	honey_label.text = "🍯 %d/15" % honey
	bottle_button.disabled = honey <= 0
	bottle_button.text = "Collect Honey" if honey > 0 else "No Honey Ready"
	if honey > 0:
		UIFwk.style_amber_button(bottle_button)
	else:
		UIFwk.style_disabled_button(bottle_button)

	# Production status based on hour
	var hour: int = Time.get_time_dict_from_system().get("hour", 12)
	if (hour >= 8 and hour <= 16) or hour >= 20 or hour <= 4:
		production_label.text = "🟢 Active"
		production_label.add_theme_color_override("font_color", Color("166534"))
	else:
		production_label.text = "🔴 Dormant"
		production_label.add_theme_color_override("font_color", Color("9f1239"))
