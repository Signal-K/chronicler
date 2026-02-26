extends PanelContainer

@onready var hive_name: Label = $CardMargin/CardBody/HeaderRow/HiveName
@onready var bee_count_label: Label = $CardMargin/CardBody/StatsRow/BeeCountLabel
@onready var honey_label: Label = $CardMargin/CardBody/StatsRow/HoneyLabel
@onready var bottle_button: Button = $CardMargin/CardBody/BottleButton

var hive_id := ""

func configure(data: Dictionary) -> void:
	hive_id = str(data.get("id", "hive"))
	hive_name.text = str(data.get("name", "Hive"))
	bee_count_label.text = "Bees: %d" % int(data.get("bee_count", 0))
	honey_label.text = "Honey: %d" % int(data.get("honey_bottles", 0))
	bottle_button.disabled = int(data.get("honey_bottles", 0)) <= 0
