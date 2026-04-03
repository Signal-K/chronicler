extends Control

@onready var list: VBoxContainer = $VBox/Scroll/List
@onready var coins_label: Label = $VBox/Footer/CoinsLabel

func _ready() -> void:
	GameState.inventory_changed.connect(_refresh)
	GameState.report_tutorial_action("open-shop")
	_refresh()

func _refresh() -> void:
	coins_label.text = "🪙 %d" % GameState.coins
	for child in list.get_children():
		child.queue_free()
	for crop_id in GameState.SEED_PRICES:
		var cfg: Dictionary = GameState.CROP_CONFIGS.get(crop_id, {})
		var price: int = GameState.SEED_PRICES[crop_id]
		var row := HBoxContainer.new()
		var lbl := Label.new()
		lbl.text = "%s %s seed — %d🪙  (have: %d)" % [
			cfg.get("emoji", "🌱"), crop_id.capitalize(), price,
			GameState.seeds.get(crop_id, 0)
		]
		lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var btn := Button.new()
		btn.text = "Buy"
		btn.disabled = GameState.coins < price
		btn.pressed.connect(func(): GameState.buy_seed(crop_id))
		row.add_child(lbl)
		row.add_child(btn)
		list.add_child(row)
