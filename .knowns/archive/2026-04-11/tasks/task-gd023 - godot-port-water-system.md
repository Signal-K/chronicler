---
id: gd023
title: "Godot port: water system"
status: done
priority: medium
labels:
  - godot
  - port
  - water
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: water system

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the water system logic into Godot. This includes current water levels, maximum capacity, refill rates (hourly and rain), and usage costs. Mirrors `lib/waterSystem.ts` and `hooks/useWaterSystem.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Implement `water_system.gd` as a global singleton or part of `game_state.gd`
- Constants: `MAX_WATER = 100`, `HOURLY_REFILL_RATE = 100`, `RAIN_REFILL_RATE = 10`, `WATER_USAGE_PER_ACTION = 1`
- Methods: `get_water_data()`, `save_water_data()`, `update_water(is_raining)`, `use_water()`
- Persist water data in the save file (mirroring `WATER_STORAGE_KEY = 'water_system'`)
- Hook up to UI in `main.tscn` (watering can tool display)

## Source reference
- RN: `lib/waterSystem.ts`, `hooks/useWaterSystem.ts`
- Godot: `scripts/water_system.gd` (or `game_state.gd`)
