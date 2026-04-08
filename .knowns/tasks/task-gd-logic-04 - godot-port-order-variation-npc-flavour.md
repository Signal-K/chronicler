---
id: gd-logic-04
title: "Godot port: Order variation & NPC flavour"
status: todo
priority: medium
labels:
  - godot
  - port
  - logic
  - narrative
  - core-loop
  - agent-ready
  - two-week
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
parent: gd014
---

# Godot port: Order variation & NPC flavour

## Description
Expand the NPC order system in `game_state.gd` with more variety, NPC flavour, and economic logic to keep the core loop engaging.

## Acceptance Criteria
- [ ] Implement `ORDER_CHARACTERS` with 6+ unique NPCs and emoji matching the project's style.
- [ ] Add 2-3 variety messages for each character.
- [ ] Implement "Quota" logic: Diminishing returns (50% value) when selling the same honey type more than 2 times in one day.
- [ ] Implement varied quantity requirements (1-5 bottles) and correctly calculate coins/XP based on `HONEY_TYPE_CONFIG`.
- [ ] Add "Success/Failure" messages in `fulfill_order` that can be displayed to the player.
- [ ] Ensure `orders_changed` signal is emitted when orders are generated or fulfilled.

## Execution Notes

- Use the NPC lines and copy defaults in `.knowns/docs/bumble-v0-content-defaults.md`.
- Keep this grounded in the current loop: small message variety, light reward variation, no deeper story system.
- This belongs in Lane 2 after honey typing is stable.
