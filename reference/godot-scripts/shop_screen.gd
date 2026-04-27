extends Control

@onready var list: VBoxContainer = $VBox/Scroll/List

func _ready() -> void:
	GameState.inventory_changed.connect(_refresh)
	GameState.level_up.connect(func(_l): _refresh())
	GameState.report_tutorial_action("open-shop")
	_refresh()

func _refresh() -> void:
	for child in list.get_children():
		child.queue_free()
	
	for crop_id in GameState.SEED_PRICES:
		var cfg: Dictionary = GameState.CROP_CONFIGS.get(crop_id, {})
		var req_lvl: int = cfg.get("required_level", 1)
		var price: int = GameState.SEED_PRICES[crop_id]
		
		var row := HBoxContainer.new()
		var lbl := Label.new()
		var btn := Button.new()
		
		if GameState.level < req_lvl:
			lbl.text = "🔒 Unlock at Level %d" % req_lvl
			btn.text = "Locked"
			btn.disabled = true
		else:
			lbl.text = "%s %s seed — %d🪙  (have: %d)" % [
				cfg.get("emoji", "🌱"), crop_id.capitalize(), price,
				GameState.seeds.get(crop_id, 0)
			]
			btn.text = "Buy"
			btn.disabled = GameState.coins < price
			btn.pressed.connect(func(): GameState.buy_seed(crop_id))
		
		lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(lbl)
		row.add_child(btn)
		list.add_child(row)
