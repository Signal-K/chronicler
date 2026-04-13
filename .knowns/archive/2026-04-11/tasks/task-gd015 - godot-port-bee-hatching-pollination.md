---
id: gd015
title: "Godot port: bee hatching and pollination milestones"
status: done
priority: medium
labels:
  - godot
  - port
  - hives
  - bees
  - progression
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: bee hatching and pollination milestones

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the bee hatching system into Godot. Every 10 pollination score points crossed triggers a new bee hatching event, adding a bee to an available hive. Mirrors `lib/beeHatching.ts` and `usePollinationFactor.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Track `pollination_score: float` in `game_state.gd`; recalculate when plots change (active flowering crops contribute)
- Persist `pollination_milestones: Array[int]` (which multiples of 10 have already triggered)
- `check_bee_hatching()`: for each new multiple of 10 crossed, find a hive with available capacity and increment its `bee_count`; emit `bee_hatched(hive_id)` signal
- Show a toast/notification in the garden screen when a bee hatches (mirrors `BeeHatchAlert.tsx`)
- Persist milestones via `ConfigFile`

## Source reference
- RN: `lib/beeHatching.ts`, `hooks/usePollinationFactor.ts`, `components/ui/BeeHatchAlert.tsx`
- Godot: `scripts/game_state.gd`, `scenes/main.tscn`
