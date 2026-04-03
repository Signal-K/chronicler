extends Node

# ── Signals ──────────────────────────────────────────────────────────────────
signal task_ready(project: String, data: Dictionary)
signal error_occurred(message: String)

# ── Config ───────────────────────────────────────────────────────────────────
const ZOONIVERSE_PROJECT_ID := "19453" # Science for Bumble Bees
const INATURALIST_BEE_TAXON := "63095" # Bumble Bees (Bombus)
const INATURALIST_POLLINATORS_TAXON := "47221" # Bees, Ants, Wasps, and Sawflies

# ── Tasks ────────────────────────────────────────────────────────────────────
# Each task: { project, id, image_url, image_texture, correct_answer (optional), options }
var current_task: Dictionary = {}

# ── HTTP Requests ────────────────────────────────────────────────────────────
var _http_data: HTTPRequest
var _http_image: HTTPRequest

func _ready() -> void:
	_http_data = HTTPRequest.new()
	add_child(_http_data)
	_http_data.request_completed.connect(_on_data_received)

	_http_image = HTTPRequest.new()
	add_child(_http_image)
	_http_image.request_completed.connect(_on_image_received)

# ── Public Methods ────────────────────────────────────────────────────────────

func fetch_inaturalist_observation() -> void:
	var url := "https://api.inaturalist.org/v1/observations?taxon_id=%s&per_page=20&quality_grade=research&order_by=random" % INATURALIST_POLLINATORS_TAXON
	_http_data.request(url)

func fetch_zooniverse_subject() -> void:
	var url := "https://panoptes.zooniverse.org/api/subjects?project_id=%s" % ZOONIVERSE_PROJECT_ID
	_http_data.request(url)

# ── Internal Callbacks ────────────────────────────────────────────────────────

func _on_data_received(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		error_occurred.emit("Failed to fetch data from API (Code: %d)" % response_code)
		return

	var json = JSON.parse_string(body.get_string_from_utf8())
	if not json:
		error_occurred.emit("Failed to parse API response.")
		return

	if "results" in json and json["results"].size() > 0:
		# iNaturalist or Zooniverse list
		var item = json["results"][randi() % json["results"].size()]
		_process_task_item(item)
	elif "subjects" in json and json["subjects"].size() > 0:
		# Zooniverse specific
		var item = json["subjects"][randi() % json["subjects"].size()]
		_process_zooniverse_item(item)
	else:
		error_occurred.emit("No observations found.")

func _process_task_item(item: Dictionary) -> void:
	# Check if it's iNaturalist
	if "photos" in item and item["photos"].size() > 0:
		current_task = {
			"project": "iNaturalist",
			"id": str(item["id"]),
			"image_url": item["photos"][0]["url"].replace("square", "medium"),
			"correct_answer": item.get("taxon", {}).get("name", "Unknown"),
			"common_name": item.get("taxon", {}).get("preferred_common_name", ""),
			"options": _generate_options(item.get("taxon", {}).get("preferred_common_name", ""))
		}
		_http_image.request(current_task["image_url"])

func _process_zooniverse_item(item: Dictionary) -> void:
	if "locations" in item and item["locations"].size() > 0:
		var locations = item["locations"][0]
		var img_url = locations.values()[0]
		current_task = {
			"project": "Zooniverse",
			"id": str(item["id"]),
			"image_url": img_url,
			"options": ["Bumble bee", "Honey bee", "Carpenter bee", "Something else"]
		}
		_http_image.request(img_url)

func _on_image_received(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		error_occurred.emit("Failed to download image.")
		return

	var image := Image.new()
	var error = Image.load_jpg_from_buffer(body)
	if error != OK:
		error = Image.load_png_from_buffer(body)
	
	if error != OK:
		error_occurred.emit("Failed to load image data.")
		return

	var texture := ImageTexture.create_from_image(image)
	current_task["image_texture"] = texture
	task_ready.emit(current_task["project"], current_task)

func _generate_options(correct_common: String) -> Array:
	var options := ["Bumble bee", "Honey bee", "Carpenter bee", "Sweat bee", "Hover fly", "Wasp"]
	if not correct_common.is_empty() and not correct_common in options:
		options.append(correct_common)
	options.shuffle()
	return options.slice(0, 4)
