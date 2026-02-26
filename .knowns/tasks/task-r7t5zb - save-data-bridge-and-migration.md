---
id: r7t5zb
title: "Save-data bridge and migration"
status: todo
priority: high
labels:
  - godot
  - persistence
  - data
createdAt: '2026-02-25T22:40:00Z'
updatedAt: '2026-02-25T22:40:00Z'
timeSpent: 0
---

# Save-data bridge and migration

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define and implement save migration from current AsyncStorage schema into Godot save format, with optional bridge APIs per host shell.

Acceptance criteria:
- Existing player data migrates without losing farm/hive progression.
- Save/load works on native, web, and desktop hosts.
- Backward-compatible versioning is documented and tested.
<!-- SECTION:DESCRIPTION:END -->
