---
id: swf007
title: "Game state and persistence"
status: todo
priority: high
labels:
  - swift
  - state
  - persistence
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# Game state and persistence

## Description

Central game state (gold, water, inventory, plots, hives) with persistence across app restarts. No backend for MVP — local only.

## Implementation Plan

1. `GameState` — `@Observable` class holding: gold, water, inventory `[ItemStack]`, plots `[Plot]`, hives `[Hive]`, activeRequests `[NPCRequest]`
2. All views receive `GameState` via environment
3. Persistence: `Codable` + `UserDefaults` or simple JSON file in app Documents
4. Auto-save on every mutation
5. Offline time progression: on app launch, calculate elapsed time and tick crops/hive production accordingly

## Acceptance Criteria

- [ ] State survives app kill and relaunch
- [ ] Crops that were growing continue to tick correctly after relaunch
- [ ] Hive production accumulates while app is closed
- [ ] No Supabase / network dependency

## Reference

- Godot reference: `reference/godot-scripts/game_state.gd`, `save_manager.gd`
