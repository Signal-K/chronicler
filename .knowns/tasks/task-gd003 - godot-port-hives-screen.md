---
id: gd003
title: "Godot port: hives screen and hive card component"
status: done
priority: high
labels:
  - godot
  - port
  - hives
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: hives screen and hive card component

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the hives management screen into Godot. `hives.tscn` lists hive cards and handles hive state display. Each hive is an instanced `hive_card.tscn`. Mirrors `app/hives.tsx`, `components/hives/HiveComponent.tsx`, and the `useHiveState` hook.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `hives.tscn` (Control) with `hives_screen.gd`
- Created `hive_card.tscn` (PanelContainer) with `hive_card.gd` — displays per-hive honey production state
- Hive data read from `game_state.gd`

## Source reference
- RN: `app/hives.tsx`, `components/hives/HiveComponent.tsx`, `hooks/useHiveState.ts`, `hooks/useHoneyProduction.ts`
- Godot: `scenes/hives.tscn`, `scenes/hive_card.tscn`, `scripts/hives_screen.gd`, `scripts/hive_card.gd`
