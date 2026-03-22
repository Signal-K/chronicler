---
id: gd009
title: "Godot port: game_state singleton (replaces React hooks/context)"
status: done
priority: high
labels:
  - godot
  - port
  - architecture
  - state
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: game_state singleton (replaces React hooks/context)

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Created `game_state.gd` as a global autoload singleton to replace the React Native hooks and context pattern. Centralises all shared game state (plots, hives, inventory, XP, coins) that was previously spread across multiple hooks.
<!-- SECTION:DESCRIPTION:END -->

## What was done

- Created `scripts/game_state.gd` (Node) registered as an autoload
- Consolidates state previously managed by: `useGameState`, `useHiveState`, `useHoneyProduction`, `usePlotActions`, `usePollinationFactor`, `useHoneyOrders`, `usePlayerExperience`

## Source reference
- RN: `hooks/useGameState.ts`, `hooks/useHiveState.ts`, `hooks/useHoneyProduction.ts`, `hooks/usePlotActions.ts`, `hooks/usePollinationFactor.ts`, `hooks/useHoneyOrders.ts`, `lib/cropConfig.ts`, `lib/experienceSystem.ts`
- Godot: `scripts/game_state.gd`
