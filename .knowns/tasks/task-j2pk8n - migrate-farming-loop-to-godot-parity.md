---
id: j2pk8n
title: "Migrate farming loop to Godot parity"
status: todo
priority: high
labels:
  - godot
  - gameplay
  - parity
createdAt: '2026-02-25T22:40:00Z'
updatedAt: '2026-02-25T22:40:00Z'
timeSpent: 0
---

# Migrate farming loop to Godot parity

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port all plot/inventory/growth mechanics from React hooks (`useGameState`, `usePlotActions`, crop config) into GDScript systems and scenes.

Acceptance criteria:
- Plot states, growth timing, watering rules, and harvest rewards match existing behavior.
- Crop definitions and stage visuals are data-driven and editable.
- Scene-first requirement is preserved: visible objects authored in `.tscn`.
<!-- SECTION:DESCRIPTION:END -->
