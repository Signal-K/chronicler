extends Control

const UIFwk = preload("res://scripts/ui_framework.gd")
const MAX_HONEY := 15

var hives: Array[Dictionary] = []
var hive_tutorial_steps: Array[Dictionary] = []
var bottle_buttons: Array[Button] = []
var _active_tab: String = "hives"

@onready var header_panel: PanelContainer = $Root/HeaderPanel
@onready var total_honey_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/InventoryRow/TotalHoneyLabel
@onready var glass_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/InventoryRow/GlassLabel
@onready var coins_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/InventoryRow/CoinsLabel
@onready var level_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/LevelLabel
@onready var bottled_inventory_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/BottledInventoryLabel
@onready var status_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/StatusLabel
@onready var subtitle_label: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/SubtitleLabel

@onready var hives_tab_button: Button = $Root/TabBar/HivesTabButton
@onready var orders_tab_button: Button = $Root/TabBar/OrdersTabButton

@onready var hive_list: VBoxContainer = $Root/ContentArea/ContentBox/HiveList
@onready var orders_panel: VBoxContainer = $Root/ContentArea/ContentBox/OrdersPanel

@onready var hive_cards: Array[PanelContainer] = [
	$Root/ContentArea/ContentBox/HiveList/HiveCard1,
	$Root/ContentArea/ContentBox/HiveList/HiveCard2,
	$Root/ContentArea/ContentBox/HiveList/HiveCard3,
]

@onready var orders_date_label: Label = $Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrdersDateLabel

@onready var order_detail_labels: Array[Label] = [
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/OrderRow1Inner/Order1DetailLabel,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/OrderRow2Inner/Order2DetailLabel,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/OrderRow3Inner/Order3DetailLabel,
]
@onready var order_reward_labels: Array[Label] = [
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/OrderRow1Inner/Order1RewardLabel,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/OrderRow2Inner/Order2RewardLabel,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/OrderRow3Inner/Order3RewardLabel,
]
@onready var order_status_labels: Array[Label] = [
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/OrderRow1Inner/Order1StatusLabel,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/OrderRow2Inner/Order2StatusLabel,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/OrderRow3Inner/Order3StatusLabel,
]
@onready var order_buttons: Array[Button] = [
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1/OrderRow1Inner/Order1Button,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2/OrderRow2Inner/Order2Button,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3/OrderRow3Inner/Order3Button,
]
@onready var order_rows: Array[PanelContainer] = [
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow1,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow2,
	$Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrderRow3,
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
		var button: Button = hive_cards[i].get_node("CardMargin/CardRow/InfoColumn/BottleButton")
		bottle_buttons.append(button)
		button.pressed.connect(_on_bottle_pressed.bind(i))
	for i in range(order_buttons.size()):
		order_buttons[i].pressed.connect(_on_fulfill_order_pressed.bind(i))

	hives_tab_button.pressed.connect(func(): _switch_tab("hives"))
	orders_tab_button.pressed.connect(func(): _switch_tab("orders"))

	skip_tutorial_button.pressed.connect(_on_skip_tutorial)
	next_tutorial_button.pressed.connect(_on_next_tutorial)
	_switch_tab("hives")
	_refresh_ui()
	if not GameState.hive_tutorial_completed:
		_setup_hive_tutorial()
	GameState.resources_changed.connect(_refresh_ui)
	GameState.bee_hatched.connect(_on_bee_hatched_in_hive)


func _apply_ui_theme() -> void:
	UIFwk.apply_warm_screen_theme(self)
	UIFwk.style_amber_panel(header_panel)

	var title_node: Label = $Root/HeaderPanel/HeaderMargin/HeaderContent/TitleRow/Title
	UIFwk.style_amber_text(title_node)
	title_node.add_theme_font_size_override("font_size", 26)

	UIFwk.style_amber_muted(subtitle_label)
	UIFwk.style_amber_text(total_honey_label)
	UIFwk.style_amber_text(glass_label)
	UIFwk.style_amber_text(coins_label)
	UIFwk.style_amber_muted(status_label)

	_style_tab_buttons()

	UIFwk.style_warm_section($Root/ContentArea/ContentBox/OrdersPanel/OrdersMargin/OrdersBody/OrdersTitle)
	UIFwk.style_amber_muted(orders_date_label)
	for label in order_reward_labels:
		label.add_theme_color_override("font_color", UIFwk.AMBER_TEXT)
		label.add_theme_font_size_override("font_size", 15)
	for row in order_rows:
		UIFwk.style_warm_panel(row)
	for s_label in order_status_labels:
		UIFwk.style_amber_muted(s_label)
	for d_label in order_detail_labels:
		UIFwk.style_warm_text(d_label)
	for button in order_buttons:
		UIFwk.style_button(button, Color("0f766e"))

	UIFwk.style_amber_panel($TutorialOverlay/TutorialCard)
	UIFwk.style_button(skip_tutorial_button, Color("7c2d12"))
	UIFwk.style_button(next_tutorial_button, Color("0f766e"))


func _style_tab_buttons() -> void:
	var active_style := StyleBoxFlat.new()
	active_style.bg_color = UIFwk.AMBER_BORDER
	active_style.border_color = UIFwk.AMBER_TEXT
	active_style.border_width_bottom = 3

	var inactive_style := StyleBoxFlat.new()
	inactive_style.bg_color = UIFwk.AMBER_HEADER_BG
	inactive_style.border_color = UIFwk.AMBER_BORDER
	inactive_style.border_width_bottom = 1

	if _active_tab == "hives":
		hives_tab_button.add_theme_stylebox_override("normal", active_style)
		hives_tab_button.add_theme_stylebox_override("hover", active_style)
		hives_tab_button.add_theme_color_override("font_color", UIFwk.AMBER_TEXT)
		orders_tab_button.add_theme_stylebox_override("normal", inactive_style)
		orders_tab_button.add_theme_stylebox_override("hover", inactive_style)
		orders_tab_button.add_theme_color_override("font_color", UIFwk.AMBER_MUTED)
	else:
		orders_tab_button.add_theme_stylebox_override("normal", active_style)
		orders_tab_button.add_theme_stylebox_override("hover", active_style)
		orders_tab_button.add_theme_color_override("font_color", UIFwk.AMBER_TEXT)
		hives_tab_button.add_theme_stylebox_override("normal", inactive_style)
		hives_tab_button.add_theme_stylebox_override("hover", inactive_style)
		hives_tab_button.add_theme_color_override("font_color", UIFwk.AMBER_MUTED)


func _switch_tab(tab: String) -> void:
	_active_tab = tab
	hive_list.visible = tab == "hives"
	orders_panel.visible = tab == "orders"
	var open_count := 0
	for order in GameState.snapshot_honey_orders():
		if not bool(order.get("fulfilled", false)):
			open_count += 1
	orders_tab_button.text = "📋 Orders (%d)" % open_count
	_style_tab_buttons()


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
	var honey_type := GameState.get_dominant_honey_type()
	GameState.add_typed_honey(honey_type, 1)
	GameState.add_coins(3)
	var honey_cfg: Dictionary = GameState.HONEY_TYPE_CONFIG.get(honey_type, {})
	var emoji: String = str(honey_cfg.get("emoji", "🍯"))
	var type_name: String = str(honey_cfg.get("name", "Honey"))
	var quality := _compute_bottle_quality(hives[index])
	status_label.text = "%s Bottled 1 %s (Quality %d/100) from %s." % [emoji, type_name, quality, str(hive["name"])]
	_on_hive_tutorial_action("bottle-honey")
	_refresh_ui()
	_persist_state()


func _refresh_ui() -> void:
	var total := 0
	for i in range(hives.size()):
		hive_cards[i].configure(hives[i])
		total += int(hives[i]["honey_bottles"])

	# Build typed honey summary string
	var honey_parts: Array[String] = []
	for honey_type in GameState.honey_type_inventory:
		var count := int(GameState.honey_type_inventory[honey_type])
		if count <= 0:
			continue
		var cfg: Dictionary = GameState.HONEY_TYPE_CONFIG.get(honey_type, {})
		honey_parts.append("%s×%d" % [str(cfg.get("emoji", "🍯")), count])
	if honey_parts.is_empty():
		total_honey_label.text = "🍯 0 bottles"
	else:
		total_honey_label.text = " ".join(honey_parts)
	glass_label.text = "🫙 %d glass" % GameState.glass_bottles
	coins_label.text = "🪙 %d" % GameState.coins
	if status_label.text.is_empty() and total == 0:
		status_label.text = "No bottled honey available."
	_refresh_orders_ui()
	_switch_tab(_active_tab)


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

		var honey_type: String = str(order.get("honey_type", "wildflower"))
		var honey_cfg: Dictionary = GameState.HONEY_TYPE_CONFIG.get(honey_type, {})
		var honey_emoji: String = str(honey_cfg.get("emoji", "🍯"))
		var honey_name: String = str(honey_cfg.get("name", "Honey"))
		var char_emoji: String = str(order.get("character_emoji", "👤"))
		order_detail_labels[i].text = "%s %s: %d × %s %s" % [
			char_emoji, str(order.get("character_name", "Order %d" % (i+1))),
			required, honey_emoji, honey_name
		]
		order_reward_labels[i].text = "+%dc" % reward
		var available := GameState.get_honey_count(honey_type)
		order_status_labels[i].text = "✓ Done" if fulfilled else ("Have %d" % available)
		order_buttons[i].disabled = fulfilled or not can_fulfill
		if not fulfilled and can_fulfill:
			UIFwk.style_button(order_buttons[i], Color("0f766e"))
		else:
			UIFwk.style_button(order_buttons[i], Color("9CA3AF"))


func _on_fulfill_order_pressed(index: int) -> void:
	var orders := GameState.snapshot_honey_orders()
	if index < 0 or index >= orders.size():
		return
	var result: Dictionary = GameState.fulfill_honey_order(str(orders[index].get("id", "")))
	_refresh_ui()
	var char_msg: String = str(orders[index].get("character_message", ""))
	var base_msg: String = str(result.get("message", "Order action complete."))
	status_label.text = base_msg + (" — \"%s\"" % char_msg if char_msg != "" else "")
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
			"hint": "Tap Collect Honey on a hive card.",
			"type": "require_action",
			"action": "bottle-honey",
		},
		{
			"title": "2. Ship an Order",
			"message": "Fulfill an open order to convert bottled honey into coins and XP.",
			"hint": "Switch to the Orders tab and use Fulfill.",
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
		hive_list.visible = _active_tab == "hives"
		orders_panel.visible = _active_tab == "orders"
		for button in bottle_buttons:
			button.disabled = false
		for i in range(order_rows.size()):
			order_rows[i].visible = true
		return

	status_label.text = "Next: %s" % str(step.get("message", "Follow the tutorial step."))
	var action_id := str(step.get("action", ""))
	var focus_order_index := _first_open_order_index()

	if action_id == "bottle-honey":
		_switch_tab("hives")
		for button in bottle_buttons:
			button.disabled = false
		for button in order_buttons:
			button.disabled = true
		return

	if action_id == "fulfill-order":
		_switch_tab("orders")
		for button in bottle_buttons:
			button.disabled = true
		for i in range(order_rows.size()):
			order_rows[i].visible = i == focus_order_index
		return

	_switch_tab("hives")
	for button in bottle_buttons:
		button.disabled = false


func _first_open_order_index() -> int:
	var orders := GameState.snapshot_honey_orders()
	for i in range(orders.size()):
		if not bool(orders[i].get("fulfilled", false)):
			return i
	return 0


func _compute_bottle_quality(hive: Dictionary) -> int:
	# 0–50 pts from bee count
	var bee_count := int(hive.get("bee_count", 0))
	var bee_score := int(clamp(float(bee_count) / float(GameState.MAX_BEES_PER_HIVE) * 50.0, 0.0, 50.0))
	# 0–20 pts for production hours (8-16 or 20-4)
	var hour: int = Time.get_time_dict_from_system().get("hour", 12)
	var in_hours := (hour >= 8 and hour <= 16) or hour >= 20 or hour <= 4
	var hour_score := 20 if in_hours else 0
	# 0–30 pts for crop diversity (10 per unique crop type harvested)
	var harvested := GameState.harvested
	var diversity := 0
	for crop in harvested:
		if int(harvested.get(crop, 0)) > 0:
			diversity += 1
	var diversity_score := min(30, diversity * 10)
	return bee_score + hour_score + diversity_score


func _on_bee_hatched_in_hive(hive_name: String) -> void:
	# Reload hive data from GameState so bee count updates immediately.
	hives = GameState.snapshot_hives()
	_refresh_ui()
	status_label.text = "🐝 A bee hatched in %s!" % hive_name
	GameState.save_state()
