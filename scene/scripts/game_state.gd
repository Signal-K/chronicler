extends Node

# ── Signals ──────────────────────────────────────────────────────────────────
signal plot_changed(index: int)
signal inventory_changed
signal hives_changed
signal honey_produced(hive_id: String)
signal bee_hatched(hive_id: String)
signal level_up(new_level: int)
signal time_changed(time_of_day: String)
signal orders_changed
signal garden_expanded(new_rows: int)
signal water_changed
signal weather_changed(is_raining: bool)
signal navigate_requested(screen_key: String)

# ── Crop config ───────────────────────────────────────────────────────────────
const CROP_CONFIGS := {
	"tomato":    { "name": "Tomato",    "emoji": "🍅", "nectar": 25, "bee_attraction": 40,  "harvest_min": 1, "harvest_max": 1, "seed_min": 1, "seed_max": 3 },
	"blueberry": { "name": "Blueberry", "emoji": "🫐", "nectar": 85, "bee_attraction": 90,  "harvest_min": 1, "harvest_max": 3, "seed_min": 0, "seed_max": 2 },
	"lavender":  { "name": "Lavender",  "emoji": "🌸", "nectar": 95, "bee_attraction": 100, "harvest_min": 1, "harvest_max": 1, "seed_min": 1, "seed_max": 2 },
	"sunflower": { "name": "Sunflower", "emoji": "🌻", "nectar": 90, "bee_attraction": 95,  "harvest_min": 1, "harvest_max": 1, "seed_min": 2, "seed_max": 3 },
	"pumpkin":   { "name": "Pumpkin",   "emoji": "🎃", "nectar": 60, "bee_attraction": 70,  "harvest_min": 1, "harvest_max": 2, "seed_min": 1, "seed_max": 3 },
	"potato":    { "name": "Potato",    "emoji": "🥔", "nectar": 20, "bee_attraction": 30,  "harvest_min": 2, "harvest_max": 4, "seed_min": 1, "seed_max": 2 },
}

const HIVE_LEVELS := {
	1: { "max_capacity": 20, "honey_per_full": 15 },
	2: { "max_capacity": 30, "honey_per_full": 22 },
	3: { "max_capacity": 40, "honey_per_full": 30 },
}

const HIVE_COST := 100
const PLOTS_PER_ROW := 3
const INITIAL_ROWS := 2
const EXPANSION_COSTS := [50, 150, 400]  # cost to unlock rows 3, 4, 5

# ── Player state ──────────────────────────────────────────────────────────────
var xp: int = 0
var level: int = 1
var coins: int = 100
var unlocked_rows: int = INITIAL_ROWS

# ── Water System ──────────────────────────────────────────────────────────────
const MAX_WATER := 100.0
const HOURLY_REFILL_RATE := 100.0
const RAIN_REFILL_RATE := 10.0 # water per minute when raining
const WATER_USAGE_PER_ACTION := 1.0

var current_water: float = MAX_WATER
var last_updated_water: float = 0.0
var last_hourly_refill_water: float = 0.0

# ── Weather Manager ───────────────────────────────────────────────────────────
var is_raining: bool = false
var weather_timer: float = 0.0
const WEATHER_CHECK_INTERVAL := 300.0 # Check weather every 5 minutes

# ── Inventory ─────────────────────────────────────────────────────────────────
var seeds: Dictionary = { "tomato": 5, "sunflower": 5, "blueberry": 5, "lavender": 5 }
var harvested: Dictionary = { "tomato": 0, "sunflower": 0, "blueberry": 0, "lavender": 0 }
var bottled_honey: Array = []  # Array of { id, type, color, amount }
var glass_bottles: int = 10

# ── Tutorial ──────────────────────────────────────────────────────────────────
var has_completed_tutorial: bool = false
var tutorial_shown: bool = false
var tutorial_actions: Dictionary = {}

# ── Plots ─────────────────────────────────────────────────────────────────────
# Each plot: { state: String, growth_stage: int, crop_id: String, planted_at: float }
# state: "empty" | "tilled" | "planted" | "growing" | "harvestable"
var plots: Array = []

# ── Hives ─────────────────────────────────────────────────────────────────────
# Each hive: { id: String, bee_count: int, level: int, honey_accumulated: float, harvest_sources: Dict }
var hives: Array = []

# ── Pollination ───────────────────────────────────────────────────────────────
var pollination_score: float = 0.0
var total_harvests: int = 0
var pollination_milestones: Array = []  # multiples of 10 already triggered

# ── Classification Tracking ───────────────────────────────────────────────────
var classification_date: String = ""
var daily_classification_count: int = 0
var classification_history: Array = [] # Array of { id, type, timestamp, date }

# ── Orders ────────────────────────────────────────────────────────────────────
const ORDERS_PER_DAY := 3
const QUOTA_PER_TYPE := 2
const REDUCTION_PERCENT := 50

const HONEY_TYPE_CONFIG := {
	"light":      { "name": "Light Honey",      "emoji": "🍯", "base_price": 15, "base_xp": 10 },
	"amber":      { "name": "Amber Honey",      "emoji": "🍯", "base_price": 20, "base_xp": 15 },
	"dark":       { "name": "Dark Honey",       "emoji": "🍯", "base_price": 25, "base_xp": 20 },
	"specialty":  { "name": "Specialty Honey",  "emoji": "✨", "base_price": 35, "base_xp": 30 },
	"wildflower": { "name": "Wildflower Blend", "emoji": "🌸", "base_price": 18, "base_xp": 12 },
}

const ORDER_CHARACTERS := [
	{ "name": "Farmer Joe",    "emoji": "👨‍🌾", "messages": ["Howdy! My wife loves honey in her tea.", "Need some honey for my baked goods!"] },
	{ "name": "Chef Rosa",     "emoji": "👩‍🍳", "messages": ["I need honey for my special recipe!", "My restaurant needs the finest honey!"] },
	{ "name": "Baker Tim",     "emoji": "🧑‍🍳", "messages": ["Honey buns need more honey!", "Running low on sweetener for my pastries!"] },
	{ "name": "Grandma Bee",   "emoji": "👵",   "messages": ["Dearie, I need honey for my grandchildren!", "My old recipe calls for this exact honey!"] },
	{ "name": "Market Molly",  "emoji": "🧑‍💼", "messages": ["The market stall needs restocking!", "Customers keep asking for local honey!"] },
	{ "name": "Tea Master Li", "emoji": "🧘",   "messages": ["The perfect honey for my tea ceremony!", "Balance requires the right sweetness."] },
]

# Each order: { id, character_name, character_emoji, message, honey_type, quantity, coins, xp, fulfilled }
var orders: Array = []
var orders_date: String = ""  # YYYY-MM-DD of last generation
var fulfilled_counts: Dictionary = { "light": 0, "amber": 0, "dark": 0, "specialty": 0, "wildflower": 0 }

# ── Time ──────────────────────────────────────────────────────────────────────
var time_of_day: String = "day"
var is_daytime: bool = true
var force_daytime: bool = false

# ── Settings ──────────────────────────────────────────────────────────────────
var fast_growth: bool = false
var growth_duration: float = 30.0  # seconds per stage (normal)
var fast_growth_duration: float = 5.0

# ── Timers ────────────────────────────────────────────────────────────────────
var _time_timer: Timer
var _honey_timer: Timer
var _force_honey_timer: Timer
var _growth_timer: Timer

func _ready() -> void:
	SaveManager.load_game(self)
	_init_plots()
	_init_hives()
	_setup_timers()
	_update_time()
	_init_water()

func _init_water() -> void:
	var now := Time.get_unix_time_from_system()
	if last_updated_water == 0.0:
		last_updated_water = now
	if last_hourly_refill_water == 0.0:
		last_hourly_refill_water = now
	update_water()

func _init_plots() -> void:
	var total = unlocked_rows * PLOTS_PER_ROW
	while plots.size() < total:
		plots.append(_empty_plot())

func _init_hives() -> void:
	if hives.is_empty():
		hives.append({ "id": "default-hive", "bee_count": 0, "level": 1,
			"honey_accumulated": 0.0, "harvest_sources": {} })

func _empty_plot() -> Dictionary:
	return { "state": "empty", "growth_stage": 0, "crop_id": "", "planted_at": 0.0 }

func _setup_timers() -> void:
	_time_timer = Timer.new()
	_time_timer.wait_time = 60.0
	_time_timer.timeout.connect(_update_time)
	add_child(_time_timer)
	_time_timer.start()

	_honey_timer = Timer.new()
	_honey_timer.wait_time = 60.0
	_honey_timer.timeout.connect(_tick_honey)
	add_child(_honey_timer)
	_honey_timer.start()

	_force_honey_timer = Timer.new()
	_force_honey_timer.wait_time = 5.0
	_force_honey_timer.timeout.connect(_tick_honey_force)
	add_child(_force_honey_timer)
	_force_honey_timer.start()

	_growth_timer = Timer.new()
	_growth_timer.wait_time = 1.0
	_growth_timer.timeout.connect(_tick_growth)
	add_child(_growth_timer)
	_growth_timer.start()

# ── Time ──────────────────────────────────────────────────────────────────────
func _update_time() -> void:
	if force_daytime:
		is_daytime = true
		_set_time_of_day("day")
		return
	var hour := Time.get_datetime_dict_from_system()["hour"] as int
	is_daytime = hour >= 6 and hour < 20
	_set_time_of_day(_get_time_of_day(hour))

func _get_time_of_day(hour: int) -> String:
	if hour >= 5 and hour < 7:  return "dawn"
	if hour >= 7 and hour < 18: return "day"
	if hour >= 18 and hour < 20: return "dusk"
	return "night"
func _set_time_of_day(tod: String) -> void:
	if tod != time_of_day:
		time_of_day = tod
		time_changed.emit(time_of_day)

# ── Water & Weather ───────────────────────────────────────────────────────────
func update_water() -> void:
	var now := Time.get_unix_time_from_system()
	var time_since_hourly := now - last_hourly_refill_water

	if time_since_hourly >= 3600.0:
		current_water = MAX_WATER
		last_hourly_refill_water = now
	elif is_raining:
		var elapsed := now - last_updated_water
		var minutes_elapsed := elapsed / 60.0
		var refill := RAIN_REFILL_RATE * minutes_elapsed
		current_water = min(MAX_WATER, current_water + refill)

	last_updated_water = now
	water_changed.emit()
	SaveManager.save_game(self)

func use_water() -> bool:
	if current_water < WATER_USAGE_PER_ACTION:
		return false

	current_water -= WATER_USAGE_PER_ACTION
	last_updated_water = Time.get_unix_time_from_system()
	water_changed.emit()
	report_tutorial_action("water-plant")
	SaveManager.save_game(self)
	return true

func _tick_weather(delta: float) -> void:
	weather_timer += delta
	if weather_timer >= WEATHER_CHECK_INTERVAL:
		weather_timer = 0.0
		# 20% chance of rain if it was sunny, 50% chance to stop if it was raining
		var chance := 0.2 if not is_raining else 0.5
		var should_rain := randf() < chance
		if is_raining:
			# If it was raining, chance is for it to STOP
			if randf() < 0.5:
				is_raining = false
				weather_changed.emit(is_raining)
		else:
			# If it was sunny, 20% chance to start raining
			if randf() < 0.2:
				is_raining = true
				weather_changed.emit(is_raining)

func _in_production_window() -> bool:
...
	if force_daytime: return true
	var hour := Time.get_datetime_dict_from_system()["hour"] as int
	return (hour >= 8 and hour < 16) or hour >= 20 or hour < 4

# ── Honey production ──────────────────────────────────────────────────────────
func _tick_honey() -> void:
	# Normal 60s tick — only runs outside force mode
	if force_daytime: return
	if not _in_production_window(): return
	_do_honey_tick()

func _tick_honey_force() -> void:
	# 5s tick — only runs in force mode
	if not force_daytime: return
	_do_honey_tick()

func _do_honey_tick() -> void:
	for hive in hives:
		if hive["bee_count"] <= 0: continue
		var lvl_data: Dictionary = HIVE_LEVELS.get(hive.get("level", 1), HIVE_LEVELS[1])
		var rate: float = float(hive["bee_count"]) / float(lvl_data["max_capacity"])
		hive["honey_accumulated"] += rate
		if hive["honey_accumulated"] >= 1.0:
			honey_produced.emit(hive["id"])
	hives_changed.emit()
	SaveManager.save_game(self)

func bottle_honey(hive_id: String) -> int:
	for hive in hives:
		if hive["id"] != hive_id: continue
		var bottles := int(hive["honey_accumulated"])
		if bottles <= 0 or glass_bottles <= 0: return 0
		bottles = min(bottles, glass_bottles)
		hive["honey_accumulated"] -= bottles
		glass_bottles -= bottles
		var entry := { "id": str(Time.get_unix_time_from_system()), "type": "wildflower",
			"color": "#DAA520", "amount": bottles }
		bottled_honey.append(entry)
		inventory_changed.emit()
		hives_changed.emit()
		report_tutorial_action("bottle-honey")
		SaveManager.save_game(self)
		return bottles
	return 0

# ── Crop growth ───────────────────────────────────────────────────────────────
func _tick_growth() -> void:
	var now := Time.get_unix_time_from_system()
	_tick_weather(1.0)
	# Update water every 10 seconds if it's raining
	if is_raining and (now - last_updated_water) >= 10.0:
		update_water()
	
	var dur := fast_growth_duration if fast_growth else growth_duration
	var changed := false
	for i in plots.size():
		var p: Dictionary = plots[i]
		if p["state"] != "planted" and p["state"] != "growing": continue
		if p["growth_stage"] >= 3: continue
		var elapsed: float = now - p["planted_at"]
		var target_stage := int(elapsed / dur) + 1
		target_stage = min(target_stage, 3)
		if target_stage > p["growth_stage"]:
			p["growth_stage"] = target_stage
			if target_stage == 3:
				p["state"] = "harvestable"
			else:
				p["state"] = "growing"
			plot_changed.emit(i)
			changed = true
	if changed:
		SaveManager.save_game(self)

# ── Classification ────────────────────────────────────────────────────────────
func can_make_classification() -> bool:
	var today := _today_string()
	if classification_date != today:
		classification_date = today
		daily_classification_count = 0

	var max_daily := min(hives.size(), 2)
	return daily_classification_count < max_daily

func record_classification(crop_type: String) -> bool:
	if not can_make_classification():
		return false

	daily_classification_count += 1
	var now := Time.get_unix_time_from_system()
	var entry := {
		"id": "classification_" + str(now),
		"type": crop_type,
		"timestamp": now,
		"date": _today_string()
	}
	classification_history.append(entry)
	if classification_history.size() > 1000:
		classification_history.remove_at(0)

	SaveManager.save_game(self)
	return true

# ── Tutorial ──────────────────────────────────────────────────────────────────
func mark_tutorial_shown() -> void:
	tutorial_shown = true
	SaveManager.save_game(self)

func mark_tutorial_completed() -> void:
	has_completed_tutorial = true
	tutorial_shown = true
	SaveManager.save_game(self)

func report_tutorial_action(action: String) -> void:
	tutorial_actions[action] = true
	# No need to save immediately for every action unless critical
	# SaveManager.save_game(self)

func reset_tutorial() -> void:
	has_completed_tutorial = false
	tutorial_shown = false
	tutorial_actions = {}
	SaveManager.save_game(self)

# ── Plot actions ──────────────────────────────────────────────────────────────
func till_plot(index: int) -> bool:
	var p: Dictionary = plots[index]
	if p["state"] != "empty": return false
	p["state"] = "tilled"
	plot_changed.emit(index)
	report_tutorial_action("till-plot")
	SaveManager.save_game(self)
	return true

func plant_plot(index: int, crop_id: String) -> bool:
	var p: Dictionary = plots[index]
	if p["state"] != "tilled": return false
	if seeds.get(crop_id, 0) <= 0: return false
	seeds[crop_id] -= 1
	p["state"] = "planted"
	p["growth_stage"] = 0
	p["crop_id"] = crop_id
	p["planted_at"] = Time.get_unix_time_from_system()
	plot_changed.emit(index)
	inventory_changed.emit()
	report_tutorial_action("plant-seed")
	SaveManager.save_game(self)
	return true

func harvest_plot(index: int) -> Dictionary:
	var p: Dictionary = plots[index]
	if p["state"] != "harvestable": return {}
	var cfg: Dictionary = CROP_CONFIGS.get(p["crop_id"], {})
	if cfg.is_empty(): return {}
	var crop_count := randi_range(cfg["harvest_min"], cfg["harvest_max"])
	var seed_count := randi_range(cfg.get("seed_min", 0), cfg.get("seed_max", 0))
	harvested[p["crop_id"]] = harvested.get(p["crop_id"], 0) + crop_count
	seeds[p["crop_id"]] = seeds.get(p["crop_id"], 0) + seed_count
	total_harvests += 1
	_add_harvest_to_hive(p["crop_id"], crop_count)
	_increment_pollination(cfg.get("nectar", 50) / 100.0)
	add_xp(10)
	var result := { "crop_id": p["crop_id"], "crop_count": crop_count, "seed_count": seed_count,
		"emoji": cfg.get("emoji", "🌿") }
	plots[index] = _empty_plot()
	plot_changed.emit(index)
	inventory_changed.emit()
	report_tutorial_action("harvest-crop")
	SaveManager.save_game(self)
	return result

func shovel_plot(index: int) -> bool:
	var p: Dictionary = plots[index]
	if p["state"] == "empty": return false
	if not p["crop_id"].is_empty():
		seeds[p["crop_id"]] = seeds.get(p["crop_id"], 0) + 1
		inventory_changed.emit()
	plots[index] = _empty_plot()
	plot_changed.emit(index)
	SaveManager.save_game(self)
	return true

# ── Hive actions ──────────────────────────────────────────────────────────────
func add_bees(count: int, hive_id: String = "") -> void:
	for hive in hives:
		if hive_id.is_empty() or hive["id"] == hive_id:
			var lvl_data: Dictionary = HIVE_LEVELS.get(hive.get("level", 1), HIVE_LEVELS[1])
			hive["bee_count"] = min(hive["bee_count"] + count, lvl_data["max_capacity"])
			hives_changed.emit()
			SaveManager.save_game(self)
			return

func build_hive() -> bool:
	if coins < HIVE_COST: return false
	coins -= HIVE_COST
	hives.append({ "id": "hive-" + str(Time.get_unix_time_from_system()),
		"bee_count": 0, "level": 1, "honey_accumulated": 0.0, "harvest_sources": {} })
	hives_changed.emit()
	inventory_changed.emit()
	SaveManager.save_game(self)
	return true

func _add_harvest_to_hive(crop_id: String, amount: int) -> void:
	if hives.is_empty(): return
	var hive: Dictionary = hives[0]
	var sources: Dictionary = hive["harvest_sources"]
	sources[crop_id] = sources.get(crop_id, 0) + amount

# ── Pollination & bee hatching ────────────────────────────────────────────────
func _increment_pollination(amount: float) -> void:
	var prev := pollination_score
	pollination_score += amount
	var prev_milestone := int(prev / 10.0)
	var new_milestone := int(pollination_score / 10.0)
	for m in range(prev_milestone + 1, new_milestone + 1):
		if m not in pollination_milestones:
			pollination_milestones.append(m)
			_hatch_bee()

func _hatch_bee() -> void:
	for hive in hives:
		var lvl_data: Dictionary = HIVE_LEVELS.get(hive.get("level", 1), HIVE_LEVELS[1])
		if hive["bee_count"] < lvl_data["max_capacity"]:
			hive["bee_count"] += 1
			bee_hatched.emit(hive["id"])
			hives_changed.emit()
			SaveManager.save_game(self)
			return

# ── XP & levelling ────────────────────────────────────────────────────────────
func add_xp(amount: int) -> void:
	xp += amount
	var new_level := _level_from_xp(xp)
	if new_level > level:
		level = new_level
		level_up.emit(level)
	SaveManager.save_game(self)

func add_coins(amount: int) -> void:
	coins += amount
	inventory_changed.emit()
	SaveManager.save_game(self)

func spend_coins(amount: int) -> bool:
	if coins < amount: return false
	coins -= amount
	inventory_changed.emit()
	SaveManager.save_game(self)
	return true

func xp_for_level(lvl: int) -> int:
	if lvl <= 1: return 0
	var base := 100; var mult := 75; var total := 0
	for i in range(2, lvl + 1):
		total += base + (i - 2) * mult
	return total

func _level_from_xp(total_xp: int) -> int:
	var lvl := 1
	while xp_for_level(lvl + 1) <= total_xp:
		lvl += 1
	return lvl

func xp_progress() -> float:
	var current_threshold := xp_for_level(level)
	var next_threshold := xp_for_level(level + 1)
	if next_threshold == current_threshold: return 1.0
	return float(xp - current_threshold) / float(next_threshold - current_threshold)

# ── Garden expansion ──────────────────────────────────────────────────────────
func expansion_cost(row: int) -> int:
	var idx := row - INITIAL_ROWS - 1
	if idx < 0 or idx >= EXPANSION_COSTS.size(): return -1
	return EXPANSION_COSTS[idx]

func purchase_expansion() -> bool:
	var cost := expansion_cost(unlocked_rows + 1)
	if cost < 0 or not spend_coins(cost): return false
	unlocked_rows += 1
	for _i in PLOTS_PER_ROW:
		plots.append(_empty_plot())
	garden_expanded.emit(unlocked_rows)
	SaveManager.save_game(self)
	return true

# ── Shop ──────────────────────────────────────────────────────────────────────
const SEED_PRICES := { "tomato": 10, "sunflower": 15, "blueberry": 20, "lavender": 25, "pumpkin": 18, "potato": 12 }

func buy_seed(crop_id: String, qty: int = 1) -> bool:
	var price: int = SEED_PRICES.get(crop_id, 0) * qty
	if not spend_coins(price): return false
	seeds[crop_id] = seeds.get(crop_id, 0) + qty
	inventory_changed.emit()
	return true

# ── Settings ──────────────────────────────────────────────────────────────────
func set_force_daytime(enabled: bool) -> void:
	force_daytime = enabled
	_update_time()
	SaveManager.save_game(self)

func set_fast_growth(enabled: bool) -> void:
	fast_growth = enabled
	SaveManager.save_game(self)

# ── Honey orders ──────────────────────────────────────────────────────────────
func refresh_orders_if_needed() -> void:
	var today := _today_string()
	if orders_date == today and orders.size() > 0:
		return
	orders_date = today
	fulfilled_counts = { "light": 0, "amber": 0, "dark": 0, "specialty": 0, "wildflower": 0 }
	orders = []
	# First order biased toward a type the player likely has
	var likely := _likely_honey_type()
	orders.append(_generate_order(likely))
	for _i in range(1, ORDERS_PER_DAY):
		orders.append(_generate_order())
	orders_changed.emit()
	SaveManager.save_game(self)

func _likely_honey_type() -> String:
	# Prefer types matching bottled honey in inventory
	for entry in bottled_honey:
		if entry["type"] in HONEY_TYPE_CONFIG:
			return entry["type"]
	return "wildflower"

func _generate_order(forced_type: String = "") -> Dictionary:
	var char_data: Dictionary = ORDER_CHARACTERS[randi() % ORDER_CHARACTERS.size()]
	var msg: String = char_data["messages"][randi() % char_data["messages"].size()]
	var honey_type: String = forced_type if forced_type != "" else HONEY_TYPE_CONFIG.keys()[randi() % HONEY_TYPE_CONFIG.size()]
	var qty := randi_range(1, 5)
	var cfg: Dictionary = HONEY_TYPE_CONFIG[honey_type]
	return {
		"id": str(Time.get_unix_time_from_system()) + str(randi()),
		"character_name": char_data["name"],
		"character_emoji": char_data["emoji"],
		"message": msg,
		"honey_type": honey_type,
		"quantity": qty,
		"coins": cfg["base_price"] * qty,
		"xp": cfg["base_xp"] * qty,
		"fulfilled": false,
	}

func fulfill_order(order_id: String) -> Dictionary:
	for order in orders:
		if order["id"] != order_id: continue
		if order["fulfilled"]:
			return { "success": false, "message": "Already fulfilled" }
		# Check inventory: find matching bottled honey
		var honey_type: String = order["honey_type"]
		var needed: int = order["quantity"]
		var available := count_bottled_honey(honey_type)
		if available < needed:
			return { "success": false, "message": "Not enough %s honey (have %d, need %d)" % [honey_type, available, needed] }
		_deduct_bottled_honey(honey_type, needed)
		var was_reduced := fulfilled_counts.get(honey_type, 0) >= QUOTA_PER_TYPE
		var coins_earned: int = order["coins"] / 2 if was_reduced else order["coins"]
		var xp_earned: int = order["xp"]
		add_coins(coins_earned)
		add_xp(xp_earned)
		order["fulfilled"] = true
		fulfilled_counts[honey_type] = fulfilled_counts.get(honey_type, 0) + 1
		orders_changed.emit()
		report_tutorial_action("fulfill-order")
		SaveManager.save_game(self)
		return { "success": true, "coins": coins_earned, "xp": xp_earned, "reduced": was_reduced }
	return { "success": false, "message": "Order not found" }

func count_bottled_honey(honey_type: String) -> int:
	var total := 0
	for entry in bottled_honey:
		if entry["type"] == honey_type:
			total += entry["amount"]
	return total

func _deduct_bottled_honey(honey_type: String, amount: int) -> void:
	var remaining := amount
	var i := bottled_honey.size() - 1
	while i >= 0 and remaining > 0:
		var entry: Dictionary = bottled_honey[i]
		if entry["type"] == honey_type:
			if entry["amount"] <= remaining:
				remaining -= entry["amount"]
				bottled_honey.remove_at(i)
			else:
				entry["amount"] -= remaining
				remaining = 0
		i -= 1
	inventory_changed.emit()

func _today_string() -> String:
	var d := Time.get_datetime_dict_from_system()
	return "%04d-%02d-%02d" % [d["year"], d["month"], d["day"]]

func reset_game() -> void:
	xp = 0; level = 1; coins = 100; unlocked_rows = INITIAL_ROWS
	seeds = { "tomato": 5, "sunflower": 5, "blueberry": 5, "lavender": 5 }
	harvested = { "tomato": 0, "sunflower": 0, "blueberry": 0, "lavender": 0 }
	bottled_honey = []; glass_bottles = 10
	plots = []; hives = []
	pollination_score = 0.0; pollination_milestones = []
	orders = []; orders_date = ""
	fulfilled_counts = { "light": 0, "amber": 0, "dark": 0, "specialty": 0, "wildflower": 0 }
	_init_plots(); _init_hives()
	SaveManager.save_game(self)
