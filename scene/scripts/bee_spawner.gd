extends Node2D

const BeeScene := preload("res://scenes/bee.tscn") # Assume this will be created or used as Sprite2D

var bee_entities: Array = []
var spawn_timer: float = 0.0
const SPAWN_INTERVAL := 30.0
const DESPAWN_TIME := 120.0 # 2 minutes

func _ready() -> void:
	# Initial spawn
	_spawn_bees()

func _process(delta: float) -> void:
	spawn_timer += delta
	if spawn_timer >= SPAWN_INTERVAL:
		spawn_timer = 0.0
		_spawn_bees()
	
	_update_bees(delta)

func _spawn_bees() -> void:
	if not GameState.is_daytime:
		_clear_bees()
		return
	
	var growing_plots := []
	for i in GameState.plots.size():
		var p: Dictionary = GameState.plots[i]
		if (p["state"] == "planted" or p["state"] == "growing") and p["growth_stage"] >= 1:
			growing_plots.append(i)
	
	if growing_plots.is_empty():
		_clear_bees()
		return
	
	# Only use first 2 hives (mirroring RN)
	var available_hives = GameState.hives.slice(0, 2)
	if available_hives.is_empty():
		return
	
	# Clear existing to respawn
	_clear_bees()
	
	for hive in available_hives:
		if hive["bee_count"] < 0: continue # Should be >= 0 but keeping logic consistent
		
		var target_plot_idx = growing_plots[randi() % growing_plots.size()]
		_create_bee(target_plot_idx)

func _create_bee(plot_idx: int) -> void:
	# This requires knowing the position of the plot in the grid.
	# For now, we'll just create it. The actual positioning might need to be handled by the parent node (GardenGrid).
	var bee = Sprite2D.new()
	bee.texture = load("res://assets/Sprites/Bee.png")
	bee.scale = Vector2(0.5, 0.5)
	add_child(bee)
	
	# Simple hovering animation state
	var bee_data = {
		"node": bee,
		"plot_idx": plot_idx,
		"spawned_at": Time.get_unix_time_from_system(),
		"offset": Vector2(randf_range(-40, 40), randf_range(-40, 40)),
		"phase": randf() * PI * 2.0
	}
	bee_entities.append(bee_data)

func _update_bees(delta: float) -> void:
	var now := Time.get_unix_time_from_system()
	var to_remove := []
	
	for i in range(bee_entities.size()):
		var data = bee_entities[i]
		if now - data["spawned_at"] >= DESPAWN_TIME:
			to_remove.append(i)
			data["node"].queue_free()
			continue
		
		# Hovering motion
		data["phase"] += delta * 2.0
		var hover = Vector2(sin(data["phase"]), cos(data["phase"] * 0.7)) * 10.0
		# data["node"].position = ... # Position should be calculated based on plot_idx
	
	for i in range(to_remove.size() - 1, -1, -1):
		bee_entities.remove_at(to_remove[i])

func _clear_bees() -> void:
	for data in bee_entities:
		data["node"].queue_free()
	bee_entities.clear()
