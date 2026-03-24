extends VBoxContainer

@onready var list: VBoxContainer = $List
@onready var refresh_btn: Button = $RefreshBtn

func _ready() -> void:
	GameState.orders_changed.connect(_rebuild)
	GameState.inventory_changed.connect(_rebuild)
	refresh_btn.pressed.connect(func(): GameState.refresh_orders_if_needed())
	GameState.refresh_orders_if_needed()
	_rebuild()

func _rebuild() -> void:
	for child in list.get_children():
		child.queue_free()

	if GameState.orders.is_empty():
		var lbl := Label.new()
		lbl.text = "No orders today yet."
		list.add_child(lbl)
		return

	for order in GameState.orders:
		var row := _make_order_row(order)
		list.add_child(row)

func _make_order_row(order: Dictionary) -> HBoxContainer:
	var row := HBoxContainer.new()

	var info := Label.new()
	var cfg: Dictionary = GameState.HONEY_TYPE_CONFIG.get(order["honey_type"], {})
	var reduced := GameState.fulfilled_counts.get(order["honey_type"], 0) >= GameState.QUOTA_PER_TYPE
	var coins_text := "%d🪙" % (order["coins"] / 2 if reduced else order["coins"])
	if reduced: coins_text += " (½)"
	info.text = "%s %s — %s x%d  %s" % [
		order["character_emoji"], order["character_name"],
		cfg.get("name", order["honey_type"]), order["quantity"],
		coins_text
	]
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(info)

	var btn := Button.new()
	if order["fulfilled"]:
		btn.text = "✓ Done"
		btn.disabled = true
	else:
		var have := GameState.count_bottled_honey(order["honey_type"])
		btn.text = "Fulfill (have %d)" % have
		btn.disabled = have < order["quantity"]
		btn.pressed.connect(func(): _on_fulfill(order["id"]))
	row.add_child(btn)
	return row

func _on_fulfill(order_id: String) -> void:
	var result := GameState.fulfill_order(order_id)
	if result["success"]:
		# toast handled by hives_screen or game_screen
		pass
