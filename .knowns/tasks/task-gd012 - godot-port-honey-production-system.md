---
id: gd012
title: "Godot port: honey production system"
status: done
priority: high
labels:
  - godot
  - port
  - hives
  - honey
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: honey production system

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the honey production logic into `game_state.gd`. Hives produce honey during active production windows (08:00–16:00 and 20:00–04:00). Production rate is driven by hive level and pollination factor. Mirrors `useHoneyProduction.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Add production tick timer to `game_state.gd` (fires every 5s in force-day mode, every 60s otherwise)
- Implement `HIVE_LEVELS` capacity/yield table (level 1: cap 20/yield 15, level 2: cap 30/yield 22, level 3: cap 40/yield 30)
- Check production window against current hour (or force-daytime flag) before ticking
- Accumulate honey per hive; emit `honey_produced` signal when a hive fills
- Expose `bottle_honey(hive_id)` method that converts accumulated honey into `BottledHoney` inventory entries

## Source reference
- RN: `hooks/useHoneyProduction.ts`, `types/hive.ts`
- Godot: `scripts/game_state.gd`
