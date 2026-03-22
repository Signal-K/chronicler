---
id: gd001
title: "Godot port: game_root scene and tab navigation"
status: done
priority: high
labels:
  - godot
  - port
  - navigation
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: game_root scene and tab navigation

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicated the React Native app shell and tab navigation into Godot. `game_root.tscn` acts as the top-level scene, loading and switching between all screen scenes: main, hives, progress, settings, expand, planets, and inventory. Mirrors the `app/_layout.tsx` and `app/(tabs)/index.tsx` routing structure.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `game_root.tscn` as the root scene
- Wired tab/screen switching to load: `main.tscn`, `hives.tscn`, `progress.tscn`, `settings.tscn`, `expand.tscn`, `planets.tscn`, `inventory.tscn`
- Created `game_state.gd` (Node) as a global state singleton, replacing the React hooks/context pattern

## Source reference
- RN: `app/_layout.tsx`, `app/(tabs)/index.tsx`
- Godot: `scenes/game_root.tscn`, `scripts/game_state.gd`
