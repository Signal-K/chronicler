extends Control

# Planets are sourced from Supabase classifications in the RN app.
# In the Godot port we show a placeholder list until a backend integration ticket is created.

@onready var list: VBoxContainer = $Scroll/List

const PLACEHOLDER_PLANETS := [
	{ "name": "Kepler-22b", "type": "Super-Earth", "color": "#4A90D9" },
	{ "name": "Proxima b",  "type": "Terrestrial", "color": "#7ED321" },
	{ "name": "TRAPPIST-1e","type": "Habitable",   "color": "#50E3C2" },
]

func _ready() -> void:
	_populate()

func _populate() -> void:
	for p in PLACEHOLDER_PLANETS:
		var lbl := Label.new()
		lbl.text = "🪐 %s  (%s)" % [p["name"], p["type"]]
		list.add_child(lbl)
