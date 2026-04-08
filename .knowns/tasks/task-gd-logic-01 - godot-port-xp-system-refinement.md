---
id: gd-logic-01
title: "Godot port: XP system refinement"
status: todo
priority: high
labels:
  - godot
  - port
  - logic
  - xp
  - foundation
  - agent-ready
  - two-week
  - active-local-changes
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
parent: gd018
---

# Godot port: XP system refinement

## Description
Refine the XP and levelling logic in `game_state.gd` to achieve 1:1 parity with the React Native `lib/experienceSystem.ts`. This ensures the progression feel is consistent across platforms.

## Acceptance Criteria
- [ ] Implement "First-time harvest" bonus XP (+10 XP) for each unique crop type.
- [ ] Track `unique_harvests` (Set/Dictionary) in `game_state.gd` and persist it.
- [ ] Update `harvest_plot` to award this bonus and trigger a specific toast/signal.
- [ ] Ensure `xp_for_level` and `_level_from_xp` formulas exactly match the React version.
- [ ] Award specific XP for different honey types based on `HONEY_TYPE_CONFIG`.
- [ ] Ensure level-up signals provide the correct "XP in current level" data for progress bars.

## Execution Notes

- Current local work already adds `unique_harvests` persistence and first-harvest bonus XP in `scene/scripts/game_state.gd` and `scene/scripts/save_manager.gd`.
- Remaining work is parity hardening: toasts or signals, honey-type XP, and level-progress data.
- This is a Lane 1 foundation task with a single-file ownership hotspot in `scene/scripts/game_state.gd`.
