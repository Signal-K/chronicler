extends PanelContainer

var hive_data: Dictionary = {}

@onready var name_label: Label = $VBox/NameLabel
@onready var bees_label: Label = $VBox/BeesLabel
@onready var honey_label: Label = $VBox/HoneyLabel
@onready var bottle_btn: Button = $VBox/BottleBtn

func _ready() -> void:
	bottle_btn.pressed.connect(_on_bottle_pressed)
	GameState.hives_changed.connect(_refresh)
	_refresh()

func _refresh() -> void:
	for h in GameState.hives:
		if h["id"] == hive_data.get("id", ""):
			hive_data = h
			break
	name_label.text = "🏠 Hive"
	bees_label.text = "🐝 Bees: %d" % hive_data.get("bee_count", 0)
	var honey: float = hive_data.get("honey_accumulated", 0.0)
	honey_label.text = "🍯 Honey: %.1f" % honey
	bottle_btn.disabled = honey < 1.0 or GameState.glass_bottles <= 0

func _on_bottle_pressed() -> void:
	var bottled := GameState.bottle_honey(hive_data["id"])
	if bottled > 0:
		_refresh()
