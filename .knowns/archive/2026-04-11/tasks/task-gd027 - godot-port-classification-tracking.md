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
Replicate daily classification tracking and history into Godot. This limits the number of classifications a user can make per day based on their hive count and records them for the almanac. Integrated with real APIs from Zooniverse (Bumble Bee Identification) and iNaturalist (Pollinator Scouting).
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Implement `citizen_science_manager.gd` for API handling (Zooniverse & iNaturalist).
- Update `GameState.record_classification(type, project, species_id, photo_url)` to award XP and bonuses.
- Create `discover.tscn` and `classification.tscn` for the identification workflow.
- Persist detailed history in the save file.

## Source reference
- RN: `lib/classificationTracking.ts`, `hooks/useClassificationTracking.ts`
- Godot: `scripts/classification_manager.gd`
