extends Node

const SAVE_PATH := "user://bee_garden_save.json"
const PLOTS_PER_PAGE := 6
const MAX_PLOT_PAGES := 4
const PLOT_COUNT := 6  # Legacy alias; use get_plot_count() for dynamic value.

const PLOT_PAGE_UPGRADES: Array = [
	{"page": 2, "required_level": 2, "cost": 50},
	{"page": 3, "required_level": 5, "cost": 150},
	{"page": 4, "required_level": 10, "cost": 300},
]

var plot_pages := 1
var growth_speed_multiplier := 1.0  # Global override; saved per session.
const CURRENT_TUTORIAL_VERSION := 4
const CURRENT_SAVE_VERSION := 2  # Increment when save schema changes.

var save_version := CURRENT_SAVE_VERSION

var farm_plots: Array[Dictionary] = []
var farm_selected_crop := "tomato"
var hives: Array[Dictionary] = []
var coins := 100
var water := 100
var max_water := 100
var seeds: Dictionary = {}
var harvested: Dictionary = {}
var bottled_honey_inventory := 0
var glass_bottles := 10
var honey_orders: Array[Dictionary] = []
var orders_generated_on := ""
var total_xp := 0
var harvests_count := 0
var unique_harvests: Dictionary = {}
var pollination_events := 0
var sales_completed := 0
var classifications_completed := 0
var tutorial_completed := false
var tutorial_step_index := 0
var hive_tutorial_completed := false
var hive_tutorial_step_index := 0
var tutorial_version := CURRENT_TUTORIAL_VERSION
var unlocked_maps: Array[String] = ["default"]
var active_map := "default"
var discovered_planets: Array[Dictionary] = []
var next_planet_id := 1


func _ready() -> void:
	_reset_defaults()
	load_state()


func _reset_defaults() -> void:
	farm_selected_crop = "tomato"
	farm_plots = _default_farm_plots()
	hives = _default_hives()
	coins = 100
	water = 100
	max_water = 100
	seeds = _default_seed_counts()
	harvested = _default_harvested_counts()
	bottled_honey_inventory = 0
	glass_bottles = 10
	honey_orders = []
	orders_generated_on = ""
	total_xp = 0
	harvests_count = 0
	unique_harvests = {}
	pollination_events = 0
	sales_completed = 0
	classifications_completed = 0
	tutorial_completed = false
	tutorial_step_index = 0
	hive_tutorial_completed = false
	hive_tutorial_step_index = 0
	tutorial_version = CURRENT_TUTORIAL_VERSION
	save_version = CURRENT_SAVE_VERSION
	plot_pages = 1
	growth_speed_multiplier = 1.0
	unlocked_maps = ["default"]
	active_map = "default"
	discovered_planets = []
	next_planet_id = 1


func _default_farm_plots() -> Array[Dictionary]:
	var defaults: Array[Dictionary] = []
	for _i in range(PLOT_COUNT):
		defaults.append({
			"state": "empty",
			"growth_stage": 0,
			"crop_type": "",
			"needs_water": false,
			"last_action_at": 0.0,
		})
	return defaults


func _default_hives() -> Array[Dictionary]:
	return [
		{"id": "hive-1", "name": "Starter Hive", "bee_count": 5, "honey_bottles": 3},
		{"id": "hive-2", "name": "Clover Hive", "bee_count": 2, "honey_bottles": 1},
		{"id": "hive-3", "name": "Lavender Hive", "bee_count": 0, "honey_bottles": 0},
	]


func _default_seed_counts() -> Dictionary:
	return {
		"tomato": 5,
		"blueberry": 5,
		"lavender": 5,
		"sunflower": 5,
	}


func _default_harvested_counts() -> Dictionary:
	return {
		"tomato": 0,
		"blueberry": 0,
		"lavender": 0,
		"sunflower": 0,
	}


func _today_key() -> String:
	var today := Time.get_date_dict_from_system()
	return "%04d-%02d-%02d" % [int(today["year"]), int(today["month"]), int(today["day"])]


func _build_daily_orders(date_key: String) -> Array[Dictionary]:
	var rng := RandomNumberGenerator.new()
	rng.seed = int(hash(date_key))
	var orders: Array[Dictionary] = []
	for i in range(3):
		var required := rng.randi_range(1, 4)
		var reward := required * 9 + rng.randi_range(0, 3)
		orders.append({
			"id": "order-%d-%s" % [i + 1, date_key],
			"title": "Daily Order %d" % (i + 1),
			"required_bottles": required,
			"reward_coins": reward,
			"fulfilled": false,
		})
	return orders


func load_state() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return

	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return

	var raw := file.get_as_text()
	if raw.is_empty():
		return

	var parsed = JSON.parse_string(raw)
	if typeof(parsed) != TYPE_DICTIONARY:
		return

	var data: Dictionary = parsed
	var loaded_tutorial_version := int(data.get("tutorial_version", 0))

	if data.has("farm_selected_crop"):
		farm_selected_crop = str(data["farm_selected_crop"])

	if data.has("farm_plots") and data["farm_plots"] is Array:
		var parsed_plots: Array[Dictionary] = []
		for item in data["farm_plots"]:
			if item is Dictionary:
				parsed_plots.append((item as Dictionary).duplicate(true))
		farm_plots = parsed_plots

	if data.has("hives") and data["hives"] is Array:
		var parsed_hives: Array[Dictionary] = []
		for item in data["hives"]:
			if item is Dictionary:
				parsed_hives.append((item as Dictionary).duplicate(true))
		hives = parsed_hives

	if data.has("coins"):
		coins = int(data["coins"])
	if data.has("water"):
		water = int(data["water"])
	if data.has("max_water"):
		max_water = int(data["max_water"])
	if data.has("seeds") and data["seeds"] is Dictionary:
		seeds = (data["seeds"] as Dictionary).duplicate(true)
	if data.has("harvested") and data["harvested"] is Dictionary:
		harvested = (data["harvested"] as Dictionary).duplicate(true)
	if data.has("bottled_honey_inventory"):
		bottled_honey_inventory = int(data["bottled_honey_inventory"])
	if data.has("glass_bottles"):
		glass_bottles = int(data["glass_bottles"])
	if data.has("honey_orders") and data["honey_orders"] is Array:
		var parsed_orders: Array[Dictionary] = []
		for item in data["honey_orders"]:
			if item is Dictionary:
				parsed_orders.append((item as Dictionary).duplicate(true))
		honey_orders = parsed_orders
	if data.has("orders_generated_on"):
		orders_generated_on = str(data["orders_generated_on"])
	if data.has("total_xp"):
		total_xp = int(data["total_xp"])
	if data.has("harvests_count"):
		harvests_count = int(data["harvests_count"])
	if data.has("unique_harvests") and data["unique_harvests"] is Dictionary:
		unique_harvests = (data["unique_harvests"] as Dictionary).duplicate(true)
	if data.has("pollination_events"):
		pollination_events = int(data["pollination_events"])
	if data.has("sales_completed"):
		sales_completed = int(data["sales_completed"])
	if data.has("classifications_completed"):
		classifications_completed = int(data["classifications_completed"])
	if data.has("tutorial_completed"):
		tutorial_completed = bool(data["tutorial_completed"])
	if data.has("tutorial_step_index"):
		tutorial_step_index = int(data["tutorial_step_index"])
	if data.has("hive_tutorial_completed"):
		hive_tutorial_completed = bool(data["hive_tutorial_completed"])
	if data.has("hive_tutorial_step_index"):
		hive_tutorial_step_index = int(data["hive_tutorial_step_index"])
	tutorial_version = loaded_tutorial_version
	if data.has("save_version"):
		save_version = int(data["save_version"])
	if data.has("growth_speed_multiplier"):
		growth_speed_multiplier = clamp(float(data["growth_speed_multiplier"]), 0.25, 4.0)
	if data.has("plot_pages"):
		plot_pages = max(1, min(int(data["plot_pages"]), MAX_PLOT_PAGES))
	if data.has("unlocked_maps") and data["unlocked_maps"] is Array:
		var parsed_maps: Array[String] = []
		for item in data["unlocked_maps"]:
			parsed_maps.append(str(item))
		unlocked_maps = parsed_maps
	if data.has("active_map"):
		active_map = str(data["active_map"])
	if data.has("discovered_planets") and data["discovered_planets"] is Array:
		var parsed_planets: Array[Dictionary] = []
		for item in data["discovered_planets"]:
			if item is Dictionary:
				parsed_planets.append((item as Dictionary).duplicate(true))
		discovered_planets = parsed_planets
	if data.has("next_planet_id"):
		next_planet_id = int(data["next_planet_id"])

	_ensure_farm_plots()
	_ensure_hives()
	_ensure_resource_state()
	_migrate_tutorial_flow_if_needed()


func save_state() -> void:
	_ensure_farm_plots()
	_ensure_hives()

	var payload := {
		"farm_selected_crop": farm_selected_crop,
		"farm_plots": farm_plots,
		"hives": hives,
		"coins": coins,
		"water": water,
		"max_water": max_water,
		"seeds": seeds,
		"harvested": harvested,
		"bottled_honey_inventory": bottled_honey_inventory,
		"glass_bottles": glass_bottles,
		"honey_orders": honey_orders,
		"orders_generated_on": orders_generated_on,
		"total_xp": total_xp,
		"harvests_count": harvests_count,
		"unique_harvests": unique_harvests,
		"pollination_events": pollination_events,
		"sales_completed": sales_completed,
		"classifications_completed": classifications_completed,
		"tutorial_completed": tutorial_completed,
		"tutorial_step_index": tutorial_step_index,
		"hive_tutorial_completed": hive_tutorial_completed,
		"hive_tutorial_step_index": hive_tutorial_step_index,
		"tutorial_version": tutorial_version,
		"save_version": save_version,
		"growth_speed_multiplier": growth_speed_multiplier,
		"plot_pages": plot_pages,
		"unlocked_maps": unlocked_maps,
		"active_map": active_map,
		"discovered_planets": discovered_planets,
		"next_planet_id": next_planet_id,
	}

	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return

	file.store_string(JSON.stringify(payload, "\t"))


func _ensure_farm_plots() -> void:
	var target_count := get_plot_count()
	if farm_plots.size() > target_count:
		farm_plots = farm_plots.slice(0, target_count)

	while farm_plots.size() < target_count:
		farm_plots.append({
			"state": "empty",
			"growth_stage": 0,
			"crop_type": "",
			"needs_water": false,
			"last_action_at": 0.0,
		})


func _ensure_hives() -> void:
	if hives.is_empty():
		hives = _default_hives()


func _ensure_resource_state() -> void:
	if max_water <= 0:
		max_water = 100
	water = clamp(water, 0, max_water)
	if seeds.is_empty():
		seeds = _default_seed_counts()
	if harvested.is_empty():
		harvested = _default_harvested_counts()
	if coins < 0:
		coins = 0
	if bottled_honey_inventory < 0:
		bottled_honey_inventory = 0
	if glass_bottles < 0:
		glass_bottles = 0
	if total_xp < 0:
		total_xp = 0
	if harvests_count < 0:
		harvests_count = 0
	if unique_harvests.is_empty():
		unique_harvests = {}
	if pollination_events < 0:
		pollination_events = 0
	if sales_completed < 0:
		sales_completed = 0
	if classifications_completed < 0:
		classifications_completed = 0
	if tutorial_step_index < 0:
		tutorial_step_index = 0
	if hive_tutorial_step_index < 0:
		hive_tutorial_step_index = 0
	if unlocked_maps.is_empty():
		unlocked_maps = ["default"]
	if not unlocked_maps.has("default"):
		unlocked_maps.append("default")
	if not unlocked_maps.has(active_map):
		active_map = "default"
	if next_planet_id < 1:
		next_planet_id = 1
	ensure_daily_orders()


func _migrate_tutorial_flow_if_needed() -> void:
	if tutorial_version >= CURRENT_TUTORIAL_VERSION:
		return
	tutorial_completed = false
	tutorial_step_index = 0
	hive_tutorial_completed = false
	hive_tutorial_step_index = 0
	tutorial_version = CURRENT_TUTORIAL_VERSION
	save_state()


func calculate_xp_for_level(level: int) -> int:
	if level <= 1:
		return 0
	var base_xp := 100
	var multiplier := 75
	var total := 0
	for i in range(2, level + 1):
		total += base_xp + (i - 2) * multiplier
	return total


func calculate_level_from_xp(xp: int) -> int:
	var level := 1
	while calculate_xp_for_level(level + 1) <= xp:
		level += 1
	return level


func get_progress_info() -> Dictionary:
	var level := calculate_level_from_xp(total_xp)
	var current_level_xp := calculate_xp_for_level(level)
	var next_level_xp := calculate_xp_for_level(level + 1)
	var xp_in_level := total_xp - current_level_xp
	var needed: int = max(1, next_level_xp - current_level_xp)
	var progress: float = clamp(float(xp_in_level) / float(needed), 0.0, 1.0)
	return {
		"level": level,
		"total_xp": total_xp,
		"xp_in_level": xp_in_level,
		"xp_needed": needed,
		"progress": progress,
	}


func ensure_daily_orders() -> void:
	var today := _today_key()
	if orders_generated_on == today and not honey_orders.is_empty():
		return
	orders_generated_on = today
	honey_orders = _build_daily_orders(today)


func snapshot_honey_orders() -> Array[Dictionary]:
	var snapshot: Array[Dictionary] = []
	for order in honey_orders:
		snapshot.append(order.duplicate(true))
	return snapshot


func set_honey_orders(value: Array[Dictionary]) -> void:
	honey_orders = []
	for order in value:
		honey_orders.append(order.duplicate(true))
	ensure_daily_orders()


func fulfill_honey_order(order_id: String) -> Dictionary:
	ensure_daily_orders()
	for i in range(honey_orders.size()):
		var order := honey_orders[i]
		if str(order.get("id", "")) != order_id:
			continue
		if bool(order.get("fulfilled", false)):
			return {"ok": false, "message": "Order already fulfilled."}

		var required := int(order.get("required_bottles", 0))
		var reward := int(order.get("reward_coins", 0))
		if bottled_honey_inventory < required:
			return {"ok": false, "message": "Not enough bottled honey for this order."}

		bottled_honey_inventory -= required
		add_coins(reward)
		award_sale_xp(max(1, required * 4))
		order["fulfilled"] = true
		honey_orders[i] = order
		return {"ok": true, "message": "Order fulfilled (+%d coins)." % reward}

	return {"ok": false, "message": "Order not found."}


func snapshot_farm_plots() -> Array[Dictionary]:
	var snapshot: Array[Dictionary] = []
	for plot in farm_plots:
		snapshot.append(plot.duplicate(true))
	return snapshot


func set_farm_plots(value: Array[Dictionary]) -> void:
	farm_plots = []
	for plot in value:
		farm_plots.append(plot.duplicate(true))
	_ensure_farm_plots()


func snapshot_hives() -> Array[Dictionary]:
	var snapshot: Array[Dictionary] = []
	for hive in hives:
		snapshot.append(hive.duplicate(true))
	return snapshot


func set_hives(value: Array[Dictionary]) -> void:
	hives = []
	for hive in value:
		hives.append(hive.duplicate(true))
	_ensure_hives()


func set_farm_selected_crop(value: String) -> void:
	farm_selected_crop = value


func get_seed_count(crop_id: String) -> int:
	return int(seeds.get(crop_id, 0))


func consume_seed(crop_id: String, amount: int = 1) -> bool:
	var current := get_seed_count(crop_id)
	if current < amount:
		return false
	seeds[crop_id] = current - amount
	return true


func add_seed(crop_id: String, amount: int = 1) -> void:
	seeds[crop_id] = get_seed_count(crop_id) + amount


func add_harvest(crop_id: String, amount: int = 1) -> void:
	harvested[crop_id] = int(harvested.get(crop_id, 0)) + amount


func award_harvest_xp(crop_id: String) -> Dictionary:
	var gained := 1
	harvests_count += 1
	total_xp += 1
	if not bool(unique_harvests.get(crop_id, false)):
		unique_harvests[crop_id] = true
		total_xp += 10
		gained += 10
	return {"gained": gained, "level": calculate_level_from_xp(total_xp)}


func award_pollination_xp() -> Dictionary:
	pollination_events += 1
	total_xp += 10
	return {"gained": 10, "level": calculate_level_from_xp(total_xp)}


func award_classification_xp() -> Dictionary:
	classifications_completed += 1
	total_xp += 10
	return {"gained": 10, "level": calculate_level_from_xp(total_xp)}


func award_sale_xp(amount: int) -> Dictionary:
	var gained: int = max(0, amount)
	sales_completed += 1
	total_xp += gained
	return {"gained": gained, "level": calculate_level_from_xp(total_xp)}


func set_tutorial_step(index: int) -> void:
	tutorial_step_index = max(0, index)


func complete_tutorial() -> void:
	tutorial_completed = true


func set_hive_tutorial_step(index: int) -> void:
	hive_tutorial_step_index = max(0, index)


func complete_hive_tutorial() -> void:
	hive_tutorial_completed = true


func get_map_definitions() -> Array[Dictionary]:
	return [
		{
			"id": "default",
			"name": "Home Farm",
			"icon": "🏡",
			"description": "Your starting farm.",
			"unlock_cost": 0,
			"growth_rate": 1.0,
		},
		{
			"id": "desert",
			"name": "Desert Oasis",
			"icon": "🏜️",
			"description": "Hot and dry biome.",
			"unlock_cost": 100,
			"growth_rate": 0.9,
		},
		{
			"id": "swamp",
			"name": "Misty Swamp",
			"icon": "🌿",
			"description": "Humid biome with faster growth.",
			"unlock_cost": 100,
			"growth_rate": 1.1,
		},
		{
			"id": "ocean",
			"name": "Ocean Platform",
			"icon": "🌊",
			"description": "Moist ocean conditions.",
			"unlock_cost": 100,
			"growth_rate": 1.0,
		},
		{
			"id": "forest",
			"name": "Deep Forest",
			"description": "Cool, fertile forest biome.",
			"icon": "🌲",
			"unlock_cost": 100,
			"growth_rate": 1.2,
		},
	]


func is_map_unlocked(map_id: String) -> bool:
	return unlocked_maps.has(map_id)


func unlock_map(map_id: String) -> Dictionary:
	var maps := get_map_definitions()
	var target: Dictionary = {}
	for map_def in maps:
		if str(map_def.get("id", "")) == map_id:
			target = map_def
			break
	if target.is_empty():
		return {"ok": false, "message": "Map not found."}
	if is_map_unlocked(map_id):
		return {"ok": false, "message": "Map already unlocked."}
	var cost := int(target.get("unlock_cost", 0))
	if coins < cost:
		return {"ok": false, "message": "Not enough coins."}
	add_coins(-cost)
	unlocked_maps.append(map_id)
	return {"ok": true, "message": "Unlocked %s." % str(target.get("name", map_id))}


func set_active_map(map_id: String) -> Dictionary:
	if not is_map_unlocked(map_id):
		return {"ok": false, "message": "Map is locked."}
	active_map = map_id
	return {"ok": true, "message": "Active map set to %s." % map_id}


func get_active_map_growth_rate() -> float:
	var base := 1.0
	for map_def in get_map_definitions():
		if str(map_def.get("id", "")) == active_map:
			base = float(map_def.get("growth_rate", 1.0))
			break
	return base * growth_speed_multiplier


func get_planet_catalog() -> Array[Dictionary]:
	var catalog: Array[Dictionary] = [
		{
			"id": 0,
			"name": "Earth",
			"type": "Home World",
			"radius": 1.0,
			"gravity": 9.8,
			"orbital_period": 365.0,
			"has_life": true,
		},
	]
	for planet in discovered_planets:
		catalog.append(planet.duplicate(true))
	return catalog


func discover_planet() -> Dictionary:
	var archetypes: Array[Dictionary] = [
		{"type": "Desert World", "prefix": "Aru", "radius": 0.9, "gravity": 7.1, "orbital_period": 220.0, "has_life": false},
		{"type": "Forest World", "prefix": "Syl", "radius": 1.2, "gravity": 10.4, "orbital_period": 410.0, "has_life": true},
		{"type": "Ocean World", "prefix": "Ner", "radius": 1.4, "gravity": 9.2, "orbital_period": 300.0, "has_life": true},
		{"type": "Ice World", "prefix": "Cry", "radius": 0.8, "gravity": 6.8, "orbital_period": 520.0, "has_life": false},
		{"type": "Volcanic World", "prefix": "Ign", "radius": 1.1, "gravity": 12.0, "orbital_period": 180.0, "has_life": false},
	]
	var pick_index := int(Time.get_unix_time_from_system()) % archetypes.size()
	var arch: Dictionary = archetypes[pick_index]
	var planet := {
		"id": next_planet_id,
		"name": "%s-%03d" % [str(arch.get("prefix", "PX")), next_planet_id],
		"type": str(arch.get("type", "Unknown World")),
		"radius": float(arch.get("radius", 1.0)),
		"gravity": float(arch.get("gravity", 9.8)),
		"orbital_period": float(arch.get("orbital_period", 365.0)),
		"has_life": bool(arch.get("has_life", false)),
	}
	next_planet_id += 1
	discovered_planets.append(planet)
	var xp_event := award_classification_xp()
	return {
		"ok": true,
		"message": "Discovered %s (+%d XP)." % [str(planet["name"]), int(xp_event.get("gained", 0))],
	}


func consume_water(amount: int = 1) -> bool:
	if water < amount:
		return false
	water -= amount
	return true


func refill_water(amount: int = 1) -> void:
	water = min(max_water, water + amount)


func add_coins(amount: int) -> void:
	coins = max(0, coins + amount)


func consume_glass_bottle(amount: int = 1) -> bool:
	if glass_bottles < amount:
		return false
	glass_bottles -= amount
	return true


func add_glass_bottle(amount: int = 1) -> void:
	glass_bottles = max(0, glass_bottles + amount)


func add_bottled_honey(amount: int = 1) -> void:
	bottled_honey_inventory = max(0, bottled_honey_inventory + amount)


func get_plot_count() -> int:
	return plot_pages * PLOTS_PER_PAGE


func unlock_plot_page(target_page: int) -> Dictionary:
	var upgrade: Dictionary = {}
	for u in PLOT_PAGE_UPGRADES:
		if int(u.get("page", 0)) == target_page:
			upgrade = u
			break
	if upgrade.is_empty():
		return {"ok": false, "message": "Unknown upgrade page."}
	if plot_pages >= target_page:
		return {"ok": false, "message": "Already unlocked."}
	var required_level := int(upgrade.get("required_level", 1))
	var cost := int(upgrade.get("cost", 0))
	var current_level := calculate_level_from_xp(total_xp)
	if current_level < required_level:
		return {"ok": false, "message": "Reach level %d to unlock Page %d." % [required_level, target_page]}
	if coins < cost:
		return {"ok": false, "message": "Need %d coins to unlock Page %d." % [cost, target_page]}
	add_coins(-cost)
	plot_pages = target_page
	_ensure_farm_plots()
	return {"ok": true, "message": "Page %d unlocked! +6 plots." % target_page}
