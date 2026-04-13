extends Node

func _ready() -> void:
	var pass_count := 0
	var fail_count := 0

	var scenes_to_test := [
		"res://scenes/game_root.tscn",
		"res://scenes/main.tscn",
		"res://scenes/hives.tscn",
		"res://scenes/hive_card.tscn",
		"res://scenes/plot.tscn",
		"res://scenes/inventory.tscn",
		"res://scenes/progress.tscn",
		"res://scenes/settings.tscn",
		"res://scenes/expand.tscn",
		"res://scenes/planets.tscn",
		"res://scenes/shop.tscn",
		"res://scenes/orders_panel.tscn",
		"res://scenes/auth.tscn",
	]

	var game_state := get_node_or_null("/root/GameState")
	if game_state and game_state.has_method("reset_game"):
		game_state.reset_game()

	for path in scenes_to_test:
		var scene := load(path) as PackedScene
		if scene == null:
			printerr("FAIL: could not load " + path)
			fail_count += 1
		else:
			var instance := scene.instantiate()
			if instance == null:
				printerr("FAIL: could not instantiate " + path)
				fail_count += 1
			else:
				add_child(instance)
				await get_tree().process_frame
				print("PASS: " + path)
				pass_count += 1
				instance.queue_free()
				await get_tree().process_frame

	print("\n%d passed, %d failed" % [pass_count, fail_count])
	get_tree().quit(1 if fail_count > 0 else 0)
