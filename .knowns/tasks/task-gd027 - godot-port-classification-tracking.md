---
id: gd027
title: "Godot port: classification tracking"
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

# Godot port: classification tracking

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate daily classification tracking and history into Godot. This limits the number of classifications a user can make per day based on their hive count and records them for the (future) almanac. Mirrors `lib/classificationTracking.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Implement `classification_manager.gd` (singleton or part of `game_state.gd`)
- Methods: `get_daily_data()`, `can_make_classification()`, `record_classification(type)`, `get_history()`
- Limit: `max_daily_classifications = min(hive_count, 2)`
- Persist daily data and history in the save file (mirroring `CLASSIFICATION_STORAGE_KEY` and `user_classifications_history`)

## Source reference
- RN: `lib/classificationTracking.ts`, `hooks/useClassificationTracking.ts`
- Godot: `scripts/classification_manager.gd`
