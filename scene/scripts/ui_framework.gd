class_name UIFwk
extends RefCounted

# ─── Original dark palette (kept for backwards compat) ───────────────────────
const BG_COLOR := Color("14231c")
const PANEL_COLOR := Color("164f34")
const PANEL_BORDER := Color("0d2a1d")
const TITLE_COLOR := Color("f8fafc")
const TEXT_COLOR := Color("e2e8f0")
const MUTED_TEXT_COLOR := Color("94a3b8")
const ACCENT_GOLD := Color("fde047")
const ACCENT_GREEN := Color("86efac")
const ACCENT_BLUE := Color("93c5fd")

# ─── Warm palette (matches React Native app) ─────────────────────────────────
const FARM_BG := Color("4ade80")
const FARM_HEADER_BG := Color("78350f")
const TOOLBAR_BG := Color("92400e")
const TOOLBAR_BORDER := Color("44403c")

const CREAM_BG := Color("FFFBF5")
const AMBER_HEADER_BG := Color("FEF3C7")
const AMBER_BORDER := Color("F59E0B")
const AMBER_TEXT := Color("92400E")
const AMBER_MUTED := Color("78716C")
const AMBER_MUTED_DARK := Color("57534E")

const WARM_PANEL_BG := Color("fff7ed")
const WARM_PANEL_BORDER := Color("f3d9bf")
const WARM_TITLE := Color("78350f")
const WARM_SECTION := Color("a16207")


# ─── Original dark theme helpers ─────────────────────────────────────────────

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


# ─── Warm theme helpers (React Native match) ─────────────────────────────────

static func apply_farm_bg(screen_root: Control) -> void:
	var background := screen_root.get_node_or_null("Background")
	if background is ColorRect:
		(background as ColorRect).color = FARM_BG


static func apply_warm_screen_theme(screen_root: Control) -> void:
	var background := screen_root.get_node_or_null("Background")
	if background is ColorRect:
		(background as ColorRect).color = CREAM_BG


static func apply_warm_tab_theme(tabs: TabContainer) -> void:
	var panel := StyleBoxFlat.new()
	panel.bg_color = TOOLBAR_BG
	panel.border_color = TOOLBAR_BORDER
	panel.border_width_left = 0
	panel.border_width_top = 3
	panel.border_width_right = 0
	panel.border_width_bottom = 0
	tabs.add_theme_stylebox_override("panel", panel)

	var tab_selected := StyleBoxFlat.new()
	tab_selected.bg_color = Color("78350f")
	tab_selected.border_color = AMBER_BORDER
	tab_selected.border_width_top = 3
	tab_selected.corner_radius_top_left = 0
	tab_selected.corner_radius_top_right = 0
	tabs.add_theme_stylebox_override("tab_selected", tab_selected)

	var tab_unselected := StyleBoxFlat.new()
	tab_unselected.bg_color = TOOLBAR_BG
	tab_unselected.border_color = TOOLBAR_BORDER
	tab_unselected.border_width_top = 0
	tabs.add_theme_stylebox_override("tab_unselected", tab_unselected)

	tabs.add_theme_color_override("font_selected_color", AMBER_BORDER)
	tabs.add_theme_color_override("font_unselected_color", Color("d4a574"))
	tabs.add_theme_color_override("font_hovered_color", ACCENT_GOLD)
	tabs.add_theme_font_size_override("font_size", 13)


static func style_header_panel(panel: PanelContainer, bg_color: Color = FARM_HEADER_BG) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = bg_color
	style.border_color = TOOLBAR_BORDER
	style.border_width_left = 0
	style.border_width_top = 0
	style.border_width_right = 0
	style.border_width_bottom = 2
	panel.add_theme_stylebox_override("panel", style)


static func style_toolbar_panel(panel: PanelContainer) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = TOOLBAR_BG
	style.border_color = TOOLBAR_BORDER
	style.border_width_left = 0
	style.border_width_top = 3
	style.border_width_right = 0
	style.border_width_bottom = 0
	panel.add_theme_stylebox_override("panel", style)


static func style_garden_panel(panel: PanelContainer) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.05, 0.25, 0.1, 0.45)
	style.border_color = Color(0.05, 0.2, 0.05, 0.7)
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 12
	style.corner_radius_top_right = 12
	style.corner_radius_bottom_right = 12
	style.corner_radius_bottom_left = 12
	panel.add_theme_stylebox_override("panel", style)


static func style_amber_panel(panel: PanelContainer) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = AMBER_HEADER_BG
	style.border_color = AMBER_BORDER
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 14
	style.corner_radius_top_right = 14
	style.corner_radius_bottom_right = 14
	style.corner_radius_bottom_left = 14
	panel.add_theme_stylebox_override("panel", style)


static func style_warm_panel(panel: PanelContainer) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = WARM_PANEL_BG
	style.border_color = WARM_PANEL_BORDER
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.corner_radius_top_left = 12
	style.corner_radius_top_right = 12
	style.corner_radius_bottom_right = 12
	style.corner_radius_bottom_left = 12
	panel.add_theme_stylebox_override("panel", style)


static func style_amber_button(button: Button) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = Color("FCD34D")
	style.border_color = Color("92400e")
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_right = 8
	style.corner_radius_bottom_left = 8
	button.add_theme_stylebox_override("normal", style)

	var hover_style := StyleBoxFlat.new()
	hover_style.bg_color = Color("F59E0B")
	hover_style.border_color = Color("78350f")
	hover_style.border_width_left = 2
	hover_style.border_width_top = 2
	hover_style.border_width_right = 2
	hover_style.border_width_bottom = 2
	hover_style.corner_radius_top_left = 8
	hover_style.corner_radius_top_right = 8
	hover_style.corner_radius_bottom_right = 8
	hover_style.corner_radius_bottom_left = 8
	button.add_theme_stylebox_override("hover", hover_style)
	button.add_theme_stylebox_override("pressed", hover_style)
	button.add_theme_color_override("font_color", AMBER_TEXT)


static func style_disabled_button(button: Button) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = Color("D1D5DB")
	style.border_color = Color("9CA3AF")
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_right = 8
	style.corner_radius_bottom_left = 8
	button.add_theme_stylebox_override("normal", style)
	button.add_theme_stylebox_override("hover", style)
	button.add_theme_stylebox_override("pressed", style)
	button.add_theme_color_override("font_color", Color("6B7280"))


static func style_warm_title(label: Label, font_size: int = 24) -> void:
	label.add_theme_color_override("font_color", WARM_TITLE)
	label.add_theme_font_size_override("font_size", font_size)


static func style_warm_section(label: Label) -> void:
	label.add_theme_color_override("font_color", WARM_SECTION)
	label.add_theme_font_size_override("font_size", 18)


static func style_amber_text(label: Label) -> void:
	label.add_theme_color_override("font_color", AMBER_TEXT)


static func style_amber_muted(label: Label) -> void:
	label.add_theme_color_override("font_color", AMBER_MUTED)


static func style_warm_text(label: Label) -> void:
	label.add_theme_color_override("font_color", WARM_TITLE)


static func style_warm_muted(label: Label) -> void:
	label.add_theme_color_override("font_color", AMBER_MUTED_DARK)
