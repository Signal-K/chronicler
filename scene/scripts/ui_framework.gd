class_name UIFwk
extends RefCounted

const BG_COLOR := Color("14231c")
const PANEL_COLOR := Color("164f34")
const PANEL_BORDER := Color("0d2a1d")
const TITLE_COLOR := Color("f8fafc")
const TEXT_COLOR := Color("e2e8f0")
const MUTED_TEXT_COLOR := Color("94a3b8")
const ACCENT_GOLD := Color("fde047")
const ACCENT_GREEN := Color("86efac")
const ACCENT_BLUE := Color("93c5fd")

static func apply_screen_theme(screen_root: Control, root: Control, title_label: Label) -> void:
	var background := screen_root.get_node_or_null("Background")
	if background is ColorRect:
		(background as ColorRect).color = BG_COLOR

	title_label.add_theme_color_override("font_color", TITLE_COLOR)
	title_label.add_theme_font_size_override("font_size", 24)

	_style_panels_recursive(root)
	_style_labels_recursive(root, TEXT_COLOR)


static func apply_tab_theme(tabs: TabContainer) -> void:
	var panel := StyleBoxFlat.new()
	panel.bg_color = Color("0f172a")
	panel.border_color = Color("1f2937")
	panel.border_width_left = 1
	panel.border_width_top = 1
	panel.border_width_right = 1
	panel.border_width_bottom = 1
	tabs.add_theme_stylebox_override("panel", panel)

	var tab_selected := StyleBoxFlat.new()
	tab_selected.bg_color = Color("14532d")
	tab_selected.border_color = Color("166534")
	tab_selected.border_width_bottom = 2
	tab_selected.corner_radius_top_left = 8
	tab_selected.corner_radius_top_right = 8
	tabs.add_theme_stylebox_override("tab_selected", tab_selected)

	var tab_unselected := StyleBoxFlat.new()
	tab_unselected.bg_color = Color("111827")
	tab_unselected.border_color = Color("1f2937")
	tab_unselected.border_width_bottom = 1
	tab_unselected.corner_radius_top_left = 8
	tab_unselected.corner_radius_top_right = 8
	tabs.add_theme_stylebox_override("tab_unselected", tab_unselected)

	tabs.add_theme_color_override("font_selected_color", TITLE_COLOR)
	tabs.add_theme_color_override("font_unselected_color", MUTED_TEXT_COLOR)
	tabs.add_theme_color_override("font_hovered_color", ACCENT_GREEN)


static func style_primary_text(label: Label) -> void:
	label.add_theme_color_override("font_color", TITLE_COLOR)


static func style_muted_text(label: Label) -> void:
	label.add_theme_color_override("font_color", MUTED_TEXT_COLOR)


static func style_accent_gold(label: Label) -> void:
	label.add_theme_color_override("font_color", ACCENT_GOLD)


static func style_accent_green(label: Label) -> void:
	label.add_theme_color_override("font_color", ACCENT_GREEN)


static func style_accent_blue(label: Label) -> void:
	label.add_theme_color_override("font_color", ACCENT_BLUE)


static func style_button(button: Button, bg_color: Color = Color("0f766e"), text_color: Color = TITLE_COLOR) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = bg_color
	style.border_color = Color("0f172a")
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 10
	style.corner_radius_top_right = 10
	style.corner_radius_bottom_right = 10
	style.corner_radius_bottom_left = 10
	button.add_theme_stylebox_override("normal", style)
	button.add_theme_stylebox_override("hover", style)
	button.add_theme_stylebox_override("pressed", style)
	button.add_theme_color_override("font_color", text_color)


static func _style_panels_recursive(node: Node) -> void:
	if node is PanelContainer:
		var panel := StyleBoxFlat.new()
		panel.bg_color = PANEL_COLOR
		panel.border_color = PANEL_BORDER
		panel.border_width_left = 2
		panel.border_width_top = 2
		panel.border_width_right = 2
		panel.border_width_bottom = 2
		panel.corner_radius_top_left = 12
		panel.corner_radius_top_right = 12
		panel.corner_radius_bottom_right = 12
		panel.corner_radius_bottom_left = 12
		(node as PanelContainer).add_theme_stylebox_override("panel", panel)
	for child in node.get_children():
		_style_panels_recursive(child)


static func _style_labels_recursive(node: Node, color: Color) -> void:
	if node is Label:
		(node as Label).add_theme_color_override("font_color", color)
	for child in node.get_children():
		_style_labels_recursive(child, color)
