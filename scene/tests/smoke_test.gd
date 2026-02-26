extends SceneTree

func _init() -> void:
	var gs = load("res://scripts/game_state.gd").new()
	gs._ready()

	var failures: Array[String] = []

	if gs.get_seed_count("tomato") < 0:
		failures.append("Seed count should never be negative")

	var before_water: int = gs.water
	var consumed: bool = gs.consume_water(1)
	if not consumed:
		failures.append("Expected water consumption to succeed with default state")
	elif gs.water != before_water - 1:
		failures.append("Water did not decrease by expected amount")

	var before_seed: int = gs.get_seed_count("tomato")
	if not gs.consume_seed("tomato", 1):
		failures.append("Expected tomato seed consumption to succeed")
	elif gs.get_seed_count("tomato") != before_seed - 1:
		failures.append("Tomato seed count did not decrease")

	gs.add_harvest("tomato", 3)
	if int(gs.harvested.get("tomato", 0)) < 3:
		failures.append("Harvest tracking failed")

	var before_coins: int = gs.coins
	gs.add_coins(5)
	if gs.coins != before_coins + 5:
		failures.append("Coin increment failed")

	var before_glass: int = gs.glass_bottles
	if not gs.consume_glass_bottle(1):
		failures.append("Expected glass bottle consumption to succeed")
	elif gs.glass_bottles != before_glass - 1:
		failures.append("Glass bottle count did not decrease")
	gs.add_glass_bottle(1)
	if gs.glass_bottles != before_glass:
		failures.append("Glass bottle increment failed")

	gs.add_bottled_honey(2)
	if gs.bottled_honey_inventory < 2:
		failures.append("Bottled honey increment failed")

	var harvest_xp_before: int = gs.total_xp
	var harvest_event: Dictionary = gs.award_harvest_xp("tomato")
	if int(harvest_event.get("gained", 0)) < 1:
		failures.append("Harvest XP event should grant at least 1 XP")
	if gs.total_xp <= harvest_xp_before:
		failures.append("Total XP should increase after harvest XP award")

	var pollination_before: int = gs.total_xp
	gs.award_pollination_xp()
	if gs.total_xp != pollination_before + 10:
		failures.append("Pollination XP should add 10 XP")

	var progress: Dictionary = gs.get_progress_info()
	if int(progress.get("level", 0)) < 1:
		failures.append("Level should always be at least 1")
	if float(progress.get("progress", -1.0)) < 0.0:
		failures.append("Progress ratio should be non-negative")

	gs.set_tutorial_step(2)
	if gs.tutorial_step_index != 2:
		failures.append("Tutorial step index did not update")
	gs.complete_tutorial()
	if not gs.tutorial_completed:
		failures.append("Tutorial should be marked completed")

	gs.set_hive_tutorial_step(1)
	if gs.hive_tutorial_step_index != 1:
		failures.append("Hive tutorial step index did not update")
	gs.complete_hive_tutorial()
	if not gs.hive_tutorial_completed:
		failures.append("Hive tutorial should be marked completed")

	var map_unlock_result: Dictionary = gs.unlock_map("desert")
	if not bool(map_unlock_result.get("ok", false)):
		failures.append("Expected desert map unlock to succeed")
	var map_select_result: Dictionary = gs.set_active_map("desert")
	if not bool(map_select_result.get("ok", false)):
		failures.append("Expected active map update to succeed")
	if gs.active_map != "desert":
		failures.append("Active map should be desert")
	if gs.get_active_map_growth_rate() <= 0.0:
		failures.append("Growth rate should be positive for active map")

	var classifications_before: int = gs.classifications_completed
	var discover_result: Dictionary = gs.discover_planet()
	if not bool(discover_result.get("ok", false)):
		failures.append("Expected planet discovery to succeed")
	if gs.discovered_planets.size() < 1:
		failures.append("Discovered planet list should grow")
	if gs.classifications_completed <= classifications_before:
		failures.append("Planet discovery should award classification XP")
	var catalog: Array[Dictionary] = gs.get_planet_catalog()
	if catalog.is_empty():
		failures.append("Planet catalog should include at least Earth")

	gs.ensure_daily_orders()
	var orders: Array[Dictionary] = gs.snapshot_honey_orders()
	if orders.size() != 3:
		failures.append("Expected exactly 3 daily orders")
	else:
		var order_id := str(orders[0].get("id", ""))
		var required := int(orders[0].get("required_bottles", 0))
		var reward := int(orders[0].get("reward_coins", 0))
		gs.bottled_honey_inventory = max(gs.bottled_honey_inventory, required)
		var coins_before: int = gs.coins
		var result: Dictionary = gs.fulfill_honey_order(order_id)
		if not bool(result.get("ok", false)):
			failures.append("Expected order fulfillment to succeed")
		if gs.coins != coins_before + reward:
			failures.append("Order reward coins were not applied correctly")
		var orders_after: Array[Dictionary] = gs.snapshot_honey_orders()
		if not bool(orders_after[0].get("fulfilled", false)):
			failures.append("Order should be marked fulfilled")

	if failures.is_empty():
		print("SMOKE TEST PASSED")
		gs.free()
		quit(0)
		return

	for failure in failures:
		push_error(failure)
	gs.free()
	quit(1)
