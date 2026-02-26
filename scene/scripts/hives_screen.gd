extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
const MAX_HONEY := 15

var hives: Array[Dictionary] = [
	{"id": "hive-1", "name": "Starter Hive", "bee_count": 5, "honey_bottles": 3},
	{"id": "hive-2", "name": "Clover Hive", "bee_count": 2, "honey_bottles": 1},
	{"id": "hive-3", "name": "Lavender Hive", "bee_count": 0, "honey_bottles": 0},
]
var hive_tutorial_steps: Array[Dictionary] = []
var bottle_buttons: Array[Button] = []

@onready var hive_summary_panel: PanelContainer = $Root/HiveSummary
@onready var orders_panel: PanelContainer = $Root/OrdersPanel
@onready var hive_list: VBoxContainer = $Root/HiveList
@onready var total_honey_label: Label = $Root/HiveSummary/SummaryMargin/SummaryBody/TotalHoneyLabel
@onready var bottled_inventory_label: Label = $Root/HiveSummary/SummaryMargin/SummaryBody/BottledInventoryLabel
@onready var glass_label: Label = $Root/HiveSummary/SummaryMargin/SummaryBody/GlassLabel
@onready var coins_label: Label = $Root/HiveSummary/SummaryMargin/SummaryBody/CoinsLabel
@onready var level_label: Label = $Root/HiveSummary/SummaryMargin/SummaryBody/LevelLabel
@onready var status_label: Label = $Root/HiveSummary/SummaryMargin/SummaryBody/StatusLabel
@onready var orders_date_label: Label = $Root/OrdersPanel/OrdersMargin/OrdersBody/OrdersDateLabel

@onready var hive_cards: Array[PanelContainer] = [
	$Root/HiveList/HiveCard1,
	$Root/HiveList/HiveCard2,
	$Root/HiveList/HiveCard3,
]
@onready var order_detail_labels: Array[Label] = [
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/Order1DetailLabel,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/Order2DetailLabel,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/Order3DetailLabel,
]
@onready var order_reward_labels: Array[Label] = [
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/Order1RewardLabel,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/Order2RewardLabel,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/Order3RewardLabel,
]
@onready var order_status_labels: Array[Label] = [
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/Order1StatusLabel,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/Order2StatusLabel,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/Order3StatusLabel,
]
@onready var order_buttons: Array[Button] = [
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/Order1Button,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/Order2Button,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/Order3Button,
]
@onready var order_rows: Array[HBoxContainer] = [
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2,
	$Root/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3,
]
@onready var tutorial_overlay: Control = $TutorialOverlay
@onready var tutorial_title_label: Label = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialTitleLabel
@onready var tutorial_message_label: Label = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialMessageLabel
@onready var tutorial_hint_label: Label = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialHintLabel
@onready var skip_tutorial_button: Button = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialButtons/SkipTutorialButton
@onready var next_tutorial_button: Button = $TutorialOverlay/TutorialCard/TutorialMargin/TutorialBody/TutorialButtons/NextTutorialButton

func _ready() -> void:
	_apply_ui_theme()
	hives = GameState.snapshot_hives()
	GameState.ensure_daily_orders()

	bottle_buttons.clear()
	for i in range(hive_cards.size()):
		var button: Button = hive_cards[i].get_node("CardMargin/CardBody/BottleButton")
		bottle_buttons.append(button)
		button.pressed.connect(_on_bottle_pressed.bind(i))
	for i in range(order_buttons.size()):
		order_buttons[i].pressed.connect(_on_fulfill_order_pressed.bind(i))
	skip_tutorial_button.pressed.connect(_on_skip_tutorial)
	next_tutorial_button.pressed.connect(_on_next_tutorial)
	_refresh_ui()
	_setup_hive_tutorial()


func _apply_ui_theme() -> void:
	UIFwk.apply_screen_theme(self, $Root, $Root/Title)
	UIFwk.style_muted_text(status_label)
	UIFwk.style_accent_blue(orders_date_label)
	UIFwk.style_accent_gold(total_honey_label)
	UIFwk.style_accent_gold(coins_label)
	UIFwk.style_accent_green(level_label)
	for label in order_reward_labels:
		UIFwk.style_accent_gold(label)
	for button in order_buttons:
		UIFwk.style_button(button, Color("0f766e"))


func _on_honey_tick() -> void:
	var did_change := false
	for i in range(hives.size()):
		var hive := hives[i]
		if int(hive["bee_count"]) <= 0:
			continue
		if int(hive["honey_bottles"]) >= MAX_HONEY:
			continue
		hive["honey_bottles"] = int(hive["honey_bottles"]) + 1
		hives[i] = hive
		did_change = true
	_refresh_ui()
	if did_change:
		_persist_state()


func _on_bottle_pressed(index: int) -> void:
	var hive := hives[index]
	if int(hive["honey_bottles"]) <= 0:
		status_label.text = "%s has no honey ready." % str(hive["name"])
		return

	if not GameState.consume_glass_bottle(1):
		status_label.text = "No glass bottles available."
		_refresh_ui()
		return

	hive["honey_bottles"] = int(hive["honey_bottles"]) - 1
	hives[index] = hive
	GameState.add_bottled_honey(1)
	GameState.add_coins(3)
	status_label.text = "Bottled 1 honey from %s." % str(hive["name"])
	_on_hive_tutorial_action("bottle-honey")
	_refresh_ui()
	_persist_state()


func _refresh_ui() -> void:
	var total := 0
	for i in range(hives.size()):
		hive_cards[i].configure(hives[i])
		total += int(hives[i]["honey_bottles"])

	total_honey_label.text = "Total Honey Bottles: %d" % total
	bottled_inventory_label.text = "Bottled Inventory: %d" % GameState.bottled_honey_inventory
	glass_label.text = "Glass Bottles: %d" % GameState.glass_bottles
	coins_label.text = "Coins: %d" % GameState.coins
	level_label.text = "Level: %d" % int(GameState.get_progress_info().get("level", 1))
	if total == 0 and status_label.text.is_empty():
		status_label.text = "No bottled honey available."
	_refresh_orders_ui()


func _refresh_orders_ui() -> void:
	var orders := GameState.snapshot_honey_orders()
	orders_date_label.text = "Date: %s" % GameState.orders_generated_on

	for i in range(order_detail_labels.size()):
		if i >= orders.size():
			order_detail_labels[i].text = "Order %d: - " % (i + 1)
			order_reward_labels[i].text = "+0c"
			order_status_labels[i].text = "-"
			order_buttons[i].disabled = true
			continue

		var order := orders[i]
		var required := int(order.get("required_bottles", 0))
		var reward := int(order.get("reward_coins", 0))
		var fulfilled := bool(order.get("fulfilled", false))
		var can_fulfill := GameState.bottled_honey_inventory >= required

		order_detail_labels[i].text = "%s: Ship %d bottled honey" % [str(order.get("title", "Order")), required]
		order_reward_labels[i].text = "+%dc" % reward
		order_status_labels[i].text = "Done" if fulfilled else "Open"
		order_buttons[i].disabled = fulfilled or not can_fulfill


func _on_fulfill_order_pressed(index: int) -> void:
	var orders := GameState.snapshot_honey_orders()
	if index < 0 or index >= orders.size():
		return
	var result: Dictionary = GameState.fulfill_honey_order(str(orders[index].get("id", "")))
	_refresh_ui()
	status_label.text = str(result.get("message", "Order action complete."))
	if bool(result.get("ok", false)):
		_on_hive_tutorial_action("fulfill-order")
	GameState.save_state()


func _persist_state() -> void:
	GameState.set_hives(hives)
	GameState.save_state()


func _setup_hive_tutorial() -> void:
	_ensure_tutorial_order_ready()
	hive_tutorial_steps = [
		{
			"title": "Hive Quick Start",
			"message": "Hives keep producing honey over time.",
			"hint": "Press Next to begin.",
			"type": "info",
		},
		{
			"title": "1. Bottle Honey",
			"message": "Bottle one honey from any hive with stock.",
			"hint": "Tap Bottle Honey on a hive card.",
			"type": "require_action",
			"action": "bottle-honey",
		},
		{
			"title": "2. Ship an Order",
			"message": "Fulfill an open order to convert bottled honey into coins and XP.",
			"hint": "Use the Fulfill button in Orders.",
			"type": "require_action",
			"action": "fulfill-order",
		},
		{
			"title": "Hive Tutorial Complete",
			"message": "You now know the full farm-to-hive loop.",
			"hint": "Press Next to finish.",
			"type": "complete",
		},
	]
	_refresh_hive_tutorial_ui()


func _current_hive_tutorial_step() -> Dictionary:
	if GameState.hive_tutorial_step_index < 0 or GameState.hive_tutorial_step_index >= hive_tutorial_steps.size():
		return {}
	return hive_tutorial_steps[GameState.hive_tutorial_step_index]


func _refresh_hive_tutorial_ui() -> void:
	if GameState.hive_tutorial_completed:
		tutorial_overlay.visible = false
		_apply_hive_tutorial_simplified_layout(false, {})
		return
	if hive_tutorial_steps.is_empty():
		tutorial_overlay.visible = false
		_apply_hive_tutorial_simplified_layout(false, {})
		return
	if GameState.hive_tutorial_step_index >= hive_tutorial_steps.size():
		GameState.complete_hive_tutorial()
		GameState.save_state()
		tutorial_overlay.visible = false
		_apply_hive_tutorial_simplified_layout(false, {})
		return

	var step := _current_hive_tutorial_step()
	_apply_hive_tutorial_simplified_layout(true, step)
	tutorial_overlay.visible = true
	var step_number := GameState.hive_tutorial_step_index + 1
	tutorial_title_label.text = "Hive Tutorial %d/%d: %s" % [step_number, hive_tutorial_steps.size(), str(step.get("title", "Hive Tutorial"))]
	tutorial_message_label.text = str(step.get("message", ""))
	tutorial_hint_label.text = str(step.get("hint", ""))
	var step_type := str(step.get("type", "info"))
	next_tutorial_button.disabled = step_type == "require_action"


func _advance_hive_tutorial_step() -> void:
	GameState.set_hive_tutorial_step(GameState.hive_tutorial_step_index + 1)
	if GameState.hive_tutorial_step_index >= hive_tutorial_steps.size():
		GameState.complete_hive_tutorial()
	GameState.save_state()
	_refresh_hive_tutorial_ui()


func _on_next_tutorial() -> void:
	if GameState.hive_tutorial_completed:
		return
	var step := _current_hive_tutorial_step()
	if str(step.get("type", "info")) == "require_action":
		return
	_advance_hive_tutorial_step()


func _on_skip_tutorial() -> void:
	GameState.complete_hive_tutorial()
	GameState.save_state()
	_refresh_hive_tutorial_ui()


func _on_hive_tutorial_action(action_id: String) -> void:
	if GameState.hive_tutorial_completed:
		return
	var step := _current_hive_tutorial_step()
	if str(step.get("type", "")) != "require_action":
		return
	if str(step.get("action", "")) == action_id:
		_advance_hive_tutorial_step()


func _ensure_tutorial_order_ready() -> void:
	if GameState.hive_tutorial_completed:
		return
	var orders := GameState.snapshot_honey_orders()
	if orders.is_empty():
		return
	var target_index := -1
	for i in range(orders.size()):
		if not bool(orders[i].get("fulfilled", false)):
			target_index = i
			break
	if target_index < 0:
		return
	var order := orders[target_index]
	if int(order.get("required_bottles", 0)) <= 1:
		return
	order["title"] = "Starter Order"
	order["required_bottles"] = 1
	order["reward_coins"] = max(10, int(order.get("reward_coins", 0)))
	orders[target_index] = order
	GameState.set_honey_orders(orders)
	GameState.save_state()


func _apply_hive_tutorial_simplified_layout(is_active: bool, step: Dictionary) -> void:
	if not is_active:
		hive_summary_panel.visible = true
		hive_list.visible = true
		orders_panel.visible = true
		total_honey_label.visible = true
		coins_label.visible = true
		level_label.visible = true
		orders_date_label.visible = true
		for row in order_rows:
			row.visible = true
		for button in bottle_buttons:
			button.disabled = false
		return

	total_honey_label.visible = false
	coins_label.visible = false
	level_label.visible = false
	orders_date_label.visible = false
	status_label.text = "Next: %s" % str(step.get("message", "Follow the tutorial step."))
	var action_id := str(step.get("action", ""))
	var focus_order_index := _first_open_order_index()

	if action_id == "bottle-honey":
		hive_summary_panel.visible = true
		hive_list.visible = true
		orders_panel.visible = false
		for button in bottle_buttons:
			button.disabled = false
		for button in order_buttons:
			button.disabled = true
		return

	if action_id == "fulfill-order":
		hive_summary_panel.visible = true
		hive_list.visible = false
		orders_panel.visible = true
		for button in bottle_buttons:
			button.disabled = true
		for i in range(order_rows.size()):
			order_rows[i].visible = i == focus_order_index
		return

	hive_summary_panel.visible = true
	hive_list.visible = true
	orders_panel.visible = false
	for button in bottle_buttons:
		button.disabled = false
	for i in range(order_rows.size()):
		order_rows[i].visible = true


func _first_open_order_index() -> int:
	var orders := GameState.snapshot_honey_orders()
	for i in range(orders.size()):
		if not bool(orders[i].get("fulfilled", false)):
			return i
	return 0
