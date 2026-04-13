---
id: gd028
title: "Godot port: pollination factor"
status: done
priority: medium
labels:
  - godot
  - port
  - progression
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: pollination factor

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the pollination factor system into Godot. This tracks total harvests and awards pollination XP, as well as triggering bee hatching events when thresholds are reached. Mirrors `hooks/usePollinationFactor.ts` and `lib/beeHatching.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `pollination_manager.gd` (singleton or part of `game_state.gd`)
- Methods: `increment_factor(amount)`, `can_spawn_bees()`
- Tracks `factor`, `total_harvests`, `threshold`
- On `increment_factor`, award XP and check for bee hatching (`lib/beeHatching.ts`)
- Persist pollination data in the save file

## Source reference
- RN: `hooks/usePollinationFactor.ts`, `lib/beeHatching.ts`
- Godot: `scripts/pollination_manager.gd`
