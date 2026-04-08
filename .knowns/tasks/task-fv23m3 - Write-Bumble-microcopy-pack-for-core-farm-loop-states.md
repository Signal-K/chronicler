---
id: fv23m3
title: Write Bumble microcopy pack for core farm loop states
status: done
priority: high
labels:
  - liam-sprint
  - creative
  - writing
  - ux
  - bumble
  - agent-foundation
createdAt: '2026-04-02T21:59:38.740Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
parent: yfdpli
---
# Write Bumble microcopy pack for core farm loop states

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create tight player-facing copy for the current loop: harvest feedback, order fulfilled alerts, bee hatch moments, hive-full / no-capacity states, levelling feedback, empty states, and daily completion beats. Keep hatch moments small, levelling mostly a UI effect, and avoid surfacing honey quality as a player concept for now.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Copy covers harvest, orders, bees, progression, and empty-state moments currently present in code
- [x] #2 All strings stay short enough for mobile UI and Godot alert/dialog usage
- [x] #3 Copy avoids honey quality messaging and does not mention planets
<!-- AC:END -->

## What was done

- Added a default string pack in `.knowns/docs/bumble-v0-content-defaults.md`.
- Included toast, empty-state, order, hive, expansion, and sync placeholder copy sized for current Godot and mobile UI surfaces.
