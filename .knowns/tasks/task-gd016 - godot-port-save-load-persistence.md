---
id: gd016
title: "Godot port: save/load persistence (ConfigFile)"
status: done
priority: high
labels:
  - godot
  - port
  - persistence
  - storage
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: save/load persistence (ConfigFile)

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace React Native's `AsyncStorage` with Godot's `ConfigFile` for all persistent game state. Covers plots, hives, inventory, XP, coins, orders, settings, and pollination milestones. Mirrors `lib/progressPreservation.ts` and all `AsyncStorage` usage across hooks.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `scripts/save_manager.gd` (autoload) with `save()` and `load()` methods
- Save path: `user://save.cfg`
- Sections: `[plots]`, `[hives]`, `[inventory]`, `[player]`, `[orders]`, `[settings]`, `[milestones]`
- Call `SaveManager.save()` after any state mutation in `game_state.gd`
- Call `SaveManager.load()` in `game_state.gd`'s `_ready()`
- Handle missing/corrupt save gracefully (default state)

## Source reference
- RN: `lib/progressPreservation.ts`, `hooks/useGameState.ts`, `hooks/useHiveState.ts`, `hooks/useHoneyOrders.ts`
- Godot: `scripts/save_manager.gd`, `scripts/game_state.gd`
