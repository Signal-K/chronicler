## Unit tests for GameState core mechanics.
## Run: godot --headless -s tests/unit_test.gd --path /path/to/scene
## Runs inside the full project so autoloads (GameState, SaveManager) are available.
extends Node

var _pass := 0
var _fail := 0

func _ready() -> void:
	var gs: Node = get_node("/root/GameState")

	# Reset to a clean state before testing
	gs.reset_game()

	_test_plots(gs)
	_test_harvest(gs)
	_test_honey_production(gs)
	_test_bottling(gs)
	_test_orders(gs)
	_test_xp_levelling(gs)
	_test_expansion(gs)
	_test_shop(gs)
	_test_water(gs)
	_test_classification(gs)
	_test_pollination_hatching(gs)

	print("\n%d passed, %d failed" % [_pass, _fail])
	get_tree().quit(1 if _fail > 0 else 0)

func _ok(label: String, cond: bool) -> void:
	if cond:
		print("PASS: " + label)
		_pass += 1
	else:
		printerr("FAIL: " + label)
		_fail += 1

# ── Plot mechanics ────────────────────────────────────────────────────────────

func _test_plots(gs: Node) -> void:
	_ok("plots initialised", gs.plots.size() == gs.INITIAL_ROWS * gs.PLOTS_PER_ROW)
	_ok("plots start empty", gs.plots[0]["state"] == "empty")

	var tilled: bool = gs.till_plot(0)
	_ok("till_plot returns true", tilled)
	_ok("plot state is tilled", gs.plots[0]["state"] == "tilled")
	_ok("till_plot on non-empty returns false", not gs.till_plot(0))

	gs.seeds["tomato"] = 1
	var planted: bool = gs.plant_plot(0, "tomato")
	_ok("plant_plot returns true", planted)
	_ok("plot state is planted", gs.plots[0]["state"] == "planted")
	_ok("seed consumed", gs.seeds["tomato"] == 0)
	_ok("plant_plot with no seeds returns false", not gs.plant_plot(1, "tomato"))

	gs.till_plot(1)
	gs.seeds["sunflower"] = 1
	gs.plant_plot(1, "sunflower")
	var shovelled: bool = gs.shovel_plot(1)
	_ok("shovel_plot returns true", shovelled)
	_ok("plot reset to empty after shovel", gs.plots[1]["state"] == "empty")
	_ok("seed returned after shovel", gs.seeds.get("sunflower", 0) >= 1)
	_ok("shovel_plot on empty returns false", not gs.shovel_plot(1))

	var empty_result: Dictionary = gs.harvest_plot(0)
	_ok("harvest_plot on non-harvestable returns empty", empty_result.is_empty())
	gs.plots[0]["state"] = "harvestable"
	var result: Dictionary = gs.harvest_plot(0)
	_ok("harvest_plot returns crop data", result.has("crop_id"))
	_ok("plot reset after harvest", gs.plots[0]["state"] == "empty")

# ── Harvest sources ───────────────────────────────────────────────────────────

func _test_harvest(gs: Node) -> void:
	gs.hives[0]["harvest_sources"] = {}
	gs.plots[2] = { "state": "harvestable", "growth_stage": 3, "crop_id": "blueberry", "planted_at": 0.0 }
	gs.harvest_plot(2)
	_ok("harvest_sources updated on hive", gs.hives[0]["harvest_sources"].has("blueberry"))
	_ok("total_harvests incremented", gs.total_harvests >= 1)

# ── Honey production ──────────────────────────────────────────────────────────

func _test_honey_production(gs: Node) -> void:
	gs.hives[0]["bee_count"] = 20
	gs.hives[0]["level"] = 1
	gs.hives[0]["honey_accumulated"] = 0.0
	var before: float = gs.hives[0]["honey_accumulated"]
	gs._do_honey_tick()
	_ok("honey accumulates per tick", gs.hives[0]["honey_accumulated"] > before)

	gs.hives[0]["bee_count"] = 0
	gs.hives[0]["honey_accumulated"] = 0.0
	gs._do_honey_tick()
	_ok("no honey without bees", gs.hives[0]["honey_accumulated"] == 0.0)

# ── Bottling ──────────────────────────────────────────────────────────────────

func _test_bottling(gs: Node) -> void:
	gs.hives[0]["bee_count"] = 20
	gs.hives[0]["honey_accumulated"] = 3.0
	gs.glass_bottles = 10
	var bottled: int = gs.bottle_honey(gs.hives[0]["id"])
	_ok("bottle_honey returns bottle count", bottled == 3)
	_ok("honey deducted from hive", gs.hives[0]["honey_accumulated"] < 1.0)
	_ok("glass bottles consumed", gs.glass_bottles == 7)
	_ok("bottled_honey inventory updated", gs.bottled_honey.size() > 0)

	gs.glass_bottles = 0
	gs.hives[0]["honey_accumulated"] = 5.0
	_ok("bottle_honey with no bottles returns 0", gs.bottle_honey(gs.hives[0]["id"]) == 0)

# ── Orders ────────────────────────────────────────────────────────────────────

func _test_orders(gs: Node) -> void:
	gs.orders = []
	gs.orders_date = ""
	gs.refresh_orders_if_needed()
	_ok("orders generated", gs.orders.size() == gs.ORDERS_PER_DAY)
	var size_before: int = gs.orders.size()
	gs.refresh_orders_if_needed()
	_ok("refresh_orders_if_needed is idempotent", gs.orders.size() == size_before)

	var order: Dictionary = gs.orders[0]
	var honey_type: String = order["honey_type"]
	var qty: int = order["quantity"]
	gs.bottled_honey = [{ "id": "test", "type": honey_type, "color": "#DAA520", "amount": qty + 5 }]
	var res: Dictionary = gs.fulfill_order(order["id"])
	_ok("fulfill_order succeeds", res["success"])
	_ok("coins awarded", res["coins"] > 0)
	_ok("order marked fulfilled", order["fulfilled"])
	var res_dup: Dictionary = gs.fulfill_order(order["id"])
	_ok("fulfill_order again returns failure", not res_dup["success"])

	var order2: Dictionary = gs.orders[1]
	gs.bottled_honey = []
	var res2: Dictionary = gs.fulfill_order(order2["id"])
	_ok("fulfill_order fails without honey", not res2["success"])

# ── XP & levelling ────────────────────────────────────────────────────────────

func _test_xp_levelling(gs: Node) -> void:
	gs.xp = 0; gs.level = 1
	gs.add_xp(50)
	_ok("xp increases", gs.xp == 50)
	_ok("level stays 1 below threshold", gs.level == 1)

	var xp_needed: int = gs.xp_for_level(2)
	gs.xp = 0; gs.level = 1
	gs.add_xp(xp_needed)
	_ok("level up at threshold", gs.level == 2)

	gs.xp = 0; gs.level = 1
	var prog: float = gs.xp_progress()
	_ok("xp_progress is 0 at start", prog == 0.0)

	gs.coins = 50
	_ok("spend_coins succeeds when sufficient", gs.spend_coins(30))
	_ok("coins deducted", gs.coins == 20)
	_ok("spend_coins fails when insufficient", not gs.spend_coins(100))
	gs.add_coins(10)
	_ok("add_coins works", gs.coins == 30)

# ── Garden expansion ──────────────────────────────────────────────────────────

func _test_expansion(gs: Node) -> void:
	gs.unlocked_rows = gs.INITIAL_ROWS
	gs.plots = []
	gs._init_plots()
	var initial_plots: int = gs.plots.size()

	gs.coins = 0
	_ok("purchase_expansion fails without coins", not gs.purchase_expansion())

	var cost: int = gs.expansion_cost(gs.unlocked_rows + 1)
	gs.coins = cost
	_ok("purchase_expansion succeeds", gs.purchase_expansion())
	_ok("unlocked_rows incremented", gs.unlocked_rows == gs.INITIAL_ROWS + 1)
	_ok("plots added", gs.plots.size() == initial_plots + gs.PLOTS_PER_ROW)

	gs.unlocked_rows = gs.INITIAL_ROWS + gs.EXPANSION_COSTS.size()
	gs.coins = 9999
	_ok("expansion_cost returns -1 past max", gs.expansion_cost(gs.unlocked_rows + 1) == -1)
	_ok("purchase_expansion fails past max", not gs.purchase_expansion())

# ── Shop ──────────────────────────────────────────────────────────────────────

func _test_shop(gs: Node) -> void:
	gs.coins = 100
	var before_seeds: int = gs.seeds.get("tomato", 0)
	_ok("buy_seed succeeds", gs.buy_seed("tomato", 2))
	_ok("seeds added", gs.seeds["tomato"] == before_seeds + 2)
	_ok("coins deducted for seeds", gs.coins == 100 - gs.SEED_PRICES["tomato"] * 2)

	gs.coins = 0
	_ok("buy_seed fails without coins", not gs.buy_seed("lavender", 1))

	gs.coins = gs.HIVE_COST
	var hive_count: int = gs.hives.size()
	_ok("build_hive succeeds", gs.build_hive())
	_ok("hive added", gs.hives.size() == hive_count + 1)
	gs.coins = 0
	_ok("build_hive fails without coins", not gs.build_hive())

# ── Water system ──────────────────────────────────────────────────────────────

func _test_water(gs: Node) -> void:
	gs.current_water = gs.MAX_WATER
	_ok("use_water succeeds when full", gs.use_water())
	_ok("water decremented", gs.current_water == gs.MAX_WATER - gs.WATER_USAGE_PER_ACTION)

	gs.current_water = 0.0
	_ok("use_water fails when empty", not gs.use_water())

# ── Classification ────────────────────────────────────────────────────────────

func _test_classification(gs: Node) -> void:
	gs.classification_date = ""
	gs.daily_classification_count = 0
	gs.classification_history = []

	_ok("can_make_classification initially true", gs.can_make_classification())
	var xp_before: int = gs.xp
	var ok: bool = gs.record_classification("bumble_bee", "Internal")
	_ok("record_classification returns true", ok)
	_ok("xp awarded for classification", gs.xp > xp_before)
	_ok("classification recorded in history", gs.classification_history.size() == 1)

	gs.daily_classification_count = 999
	_ok("can_make_classification false when limit reached", not gs.can_make_classification())
	_ok("record_classification returns false at limit", not gs.record_classification("bumble_bee"))

# ── Pollination & bee hatching ────────────────────────────────────────────────

func _test_pollination_hatching(gs: Node) -> void:
	gs.pollination_score = 0.0
	gs.pollination_milestones = []
	gs.hives[0]["bee_count"] = 0
	gs.hives[0]["level"] = 1

	gs._increment_pollination(10.1)
	_ok("pollination score increases", gs.pollination_score > 10.0)
	_ok("milestone recorded", gs.pollination_milestones.size() >= 1)
	_ok("bee hatched on milestone", gs.hives[0]["bee_count"] >= 1)

	var lvl_data: Dictionary = gs.HIVE_LEVELS[1]
	gs.hives[0]["bee_count"] = lvl_data["max_capacity"]
	gs.add_bees(10, gs.hives[0]["id"])
	_ok("bee count capped at max_capacity", gs.hives[0]["bee_count"] == lvl_data["max_capacity"])
