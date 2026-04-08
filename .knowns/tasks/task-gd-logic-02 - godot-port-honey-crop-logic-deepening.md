---
id: gd-logic-02
title: "Godot port: Honey & crop logic deepening"
status: todo
priority: high
labels:
  - godot
  - port
  - logic
  - honey
  - core-loop
  - agent-ready
  - two-week
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
parent: gd012
---

# Godot port: Honey & crop logic deepening

## Description
Deepen the honey production and crop relationship in `game_state.gd` to create a more rewarding variety of outputs without needing new assets.

## Acceptance Criteria
- [ ] Associate specific crops with honey types in `game_state.gd`:
  - Lavender -> Specialty Honey
  - Sunflower -> Amber Honey
  - Blueberry -> Specialty Honey
  - Tomato -> Light Honey
  - Pumpkin -> Amber Honey
  - Potato -> Dark Honey
- [ ] Implement `harvest_sources` tracking in `GameState.hives` (Dictionary mapping `crop_id` to count).
- [ ] Implement honey type determination logic in `bottle_honey` (choose type based on most frequent source).
- [ ] Update `HONEY_TYPE_CONFIG` with correct base prices and XP rewards.
- [ ] Ensure `inventory_changed` is emitted correctly for each new honey type bottled.

## Execution Notes

- This is the main post-foundation loop deepening task.
- Use `.knowns/docs/bumble-v0-content-defaults.md` to keep honey naming varied but non-hierarchical.
- Finish this before the order-flavour ticket so `gd-logic-04` has stable honey outputs to build on.
