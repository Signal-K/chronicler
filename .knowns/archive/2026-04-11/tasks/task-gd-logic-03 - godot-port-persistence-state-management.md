---
id: gd-logic-03
title: "Godot port: Persistence & state management"
status: todo
priority: medium
labels:
  - godot
  - port
  - logic
  - persistence
  - core-loop
  - agent-ready
  - two-week
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
parent: gd016
---

# Godot port: Persistence & state management

## Description
Ensure the Godot port's persistence logic in `save_manager.gd` and `game_state.gd` covers all metrics and milestones from the React Native version.

## Acceptance Criteria
- [ ] Verify `SaveManager.save_game` persists: `unique_harvests`, `pollination_milestones`, `daily_classification_count`, and `orders_date`.
- [ ] Implement a "Version Check" in `SaveManager` to handle potential state format changes gracefully.
- [ ] Add a "Reset Save" functionality in `settings_screen.gd`.
- [ ] Ensure `last_updated_water` and `last_hourly_refill_water` are correctly loaded from save data.
- [ ] Add a placeholder for "Cloud Sync" status (connected/disconnected) for future Supabase work.

## Execution Notes

- Several acceptance points are already present in the current save flow, so start by tightening the gaps instead of rewriting persistence wholesale.
- This ticket should follow `gd-logic-01` and stay coordinated with `gd032` so the cloud-sync placeholder matches the auth direction.
