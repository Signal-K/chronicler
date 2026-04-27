---
id: swf006
title: "NPC requests & tooltips"
status: todo
priority: medium
labels:
  - swift
  - npc
  - orders
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# NPC requests & tooltips

## Description

Modal sheet that appears when an NPC has a new request. Shows NPC portrait, dialogue, required item + quantity, and gold reward. Player can Accept or Decline.

## Implementation Plan

1. `NPCRequestSheet` — portrait, name badge, dialogue bubble, requires/reward row, ACCEPT/DECLINE buttons
2. `NPCRequest` model: `(id, npcName, npcPortrait, dialogue, requiresItem, requiresQty, rewardGold)`
3. MVP NPC: Farmer Sam with 2–3 hardcoded requests
4. Accepting a fulfilled request deducts items and awards gold
5. Accepting an unfulfilled request shows "You don't have enough" feedback
6. Tooltips: long-press on any item shows a small popover with item description

## Acceptance Criteria

- [ ] NPC sheet renders with portrait, dialogue, requirements
- [ ] Accept works when inventory has enough items
- [ ] Decline dismisses sheet
- [ ] Visual matches Stitch screenshot

## Reference

- Stitch: `stitch-designs/npc-requests-tooltips.png`
- Godot reference: `reference/godot-scripts/orders_panel.gd`
