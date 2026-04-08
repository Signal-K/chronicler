---
id: gd-ui-01
title: "Godot port: Universal 'Cosy' Theme"
status: todo
priority: high
labels:
  - godot
  - port
  - ui
  - theme
  - foundation
  - agent-ready
  - two-week
  - active-local-changes
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
---

# Godot port: Universal 'Cosy' Theme

## Description
Create and apply a global `Theme` resource to the Godot project to achieve the "cosy" aesthetic (rounded corners, soft colors, clean typography) without needing new assets.

## Acceptance Criteria
- [ ] Create `resources/main_theme.tres`.
- [ ] Define `StyleBoxFlat` for `Button` (normal, hover, pressed, disabled) with 8-12px corner radius and subtle shadows.
- [ ] Define `StyleBoxFlat` for `Panel` and `PanelContainer` with soft backgrounds (e.g., `rgba(255, 255, 255, 0.9)`).
- [ ] Set global colors matching the React Native palette (`#86efac`, `#4ade80`, `#22c55e`).
- [ ] Apply the theme to `game_root.tscn`.
- [ ] Replace basic `Label.new()` and `Button.new()` in code with pre-styled nodes or ensure they inherit correctly.

## Execution Notes

- Current local work already adds `scene/resources/main_theme.tres` and applies it in `scene/scenes/game_root.tscn`.
- Finish this task by treating the new theme as the global visual default described in `.knowns/docs/bumble-v0-agent-brief.md`.
- This is a Lane 1 foundation task and safe to continue without new design input.
