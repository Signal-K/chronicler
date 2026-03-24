extends Node

const SAVE_PATH := "user://save.cfg"

func save_game(gs) -> void:
	var cfg := ConfigFile.new()

	cfg.set_value("player", "xp", gs.xp)
	cfg.set_value("player", "level", gs.level)
	cfg.set_value("player", "coins", gs.coins)
	cfg.set_value("player", "unlocked_rows", gs.unlocked_rows)
	cfg.set_value("player", "pollination_score", gs.pollination_score)
	cfg.set_value("player", "total_harvests", gs.total_harvests)
	cfg.set_value("player", "pollination_milestones", gs.pollination_milestones)

	cfg.set_value("water", "current_water", gs.current_water)
	cfg.set_value("water", "last_updated_water", gs.last_updated_water)
	cfg.set_value("water", "last_hourly_refill_water", gs.last_hourly_refill_water)

	cfg.set_value("classification", "date", gs.classification_date)
	cfg.set_value("classification", "daily_count", gs.daily_classification_count)
	cfg.set_value("classification", "history", gs.classification_history)

	cfg.set_value("tutorial", "completed", gs.has_completed_tutorial)
	cfg.set_value("tutorial", "shown", gs.tutorial_shown)
	cfg.set_value("tutorial", "actions", gs.tutorial_actions)

	cfg.set_value("inventory", "seeds", gs.seeds)
	cfg.set_value("inventory", "harvested", gs.harvested)
	cfg.set_value("inventory", "glass_bottles", gs.glass_bottles)
	cfg.set_value("inventory", "bottled_honey", gs.bottled_honey)

	cfg.set_value("plots", "data", gs.plots)

	cfg.set_value("hives", "data", gs.hives)

	cfg.set_value("settings", "force_daytime", gs.force_daytime)
	cfg.set_value("settings", "fast_growth", gs.fast_growth)

	cfg.set_value("orders", "data", gs.orders)
	cfg.set_value("orders", "date", gs.orders_date)
	cfg.set_value("orders", "fulfilled_counts", gs.fulfilled_counts)

	cfg.save(SAVE_PATH)

func load_game(gs) -> void:
	var cfg := ConfigFile.new()
	if cfg.load(SAVE_PATH) != OK:
		return  # No save file yet — use defaults

	gs.xp = cfg.get_value("player", "xp", 0)
	gs.level = cfg.get_value("player", "level", 1)
	gs.coins = cfg.get_value("player", "coins", 100)
	gs.unlocked_rows = cfg.get_value("player", "unlocked_rows", gs.INITIAL_ROWS)
	gs.pollination_score = cfg.get_value("player", "pollination_score", 0.0)
	gs.total_harvests = cfg.get_value("player", "total_harvests", 0)
	gs.pollination_milestones = cfg.get_value("player", "pollination_milestones", [])

	gs.current_water = cfg.get_value("water", "current_water", gs.MAX_WATER)
	gs.last_updated_water = cfg.get_value("water", "last_updated_water", 0.0)
	gs.last_hourly_refill_water = cfg.get_value("water", "last_hourly_refill_water", 0.0)

	gs.classification_date = cfg.get_value("classification", "date", "")
	gs.daily_classification_count = cfg.get_value("classification", "daily_count", 0)
	gs.classification_history = cfg.get_value("classification", "history", [])

	gs.has_completed_tutorial = cfg.get_value("tutorial", "completed", false)
	gs.tutorial_shown = cfg.get_value("tutorial", "shown", false)
	gs.tutorial_actions = cfg.get_value("tutorial", "actions", {})

	gs.seeds = cfg.get_value("inventory", "seeds", gs.seeds)
	gs.harvested = cfg.get_value("inventory", "harvested", gs.harvested)
	gs.glass_bottles = cfg.get_value("inventory", "glass_bottles", 10)
	gs.bottled_honey = cfg.get_value("inventory", "bottled_honey", [])

	var saved_plots = cfg.get_value("plots", "data", [])
	if not saved_plots.is_empty():
		gs.plots = saved_plots

	var saved_hives = cfg.get_value("hives", "data", [])
	if not saved_hives.is_empty():
		gs.hives = saved_hives

	gs.force_daytime = cfg.get_value("settings", "force_daytime", false)
	gs.fast_growth = cfg.get_value("settings", "fast_growth", false)

	gs.orders = cfg.get_value("orders", "data", [])
	gs.orders_date = cfg.get_value("orders", "date", "")
	gs.fulfilled_counts = cfg.get_value("orders", "fulfilled_counts", gs.fulfilled_counts)
