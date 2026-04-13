---
id: gd-ui-02
title: "Godot port: Screen transitions & feedback"
status: todo
priority: high
labels:
  - godot
  - port
  - ui
  - animation
  - foundation
  - agent-ready
  - two-week
  - active-local-changes
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
---

# Godot port: Screen transitions & feedback

## Description
Implement smooth transitions between screens and interactive feedback for buttons and popups using Godot's `Tween` system.

## Acceptance Criteria
- [ ] Implement "Fade + Slide" transitions for all screen switching in `game_root.gd`.
- [ ] Add "Scale Up + Fade In" animations for all modal popups (Shop, Inventory).
- [ ] Implement "Pop/Squash" animations for all button presses using `Tween`.
- [ ] Enhance `_show_toast` in `game_screen.gd` with a sliding/fading animation.
- [ ] Ensure all state-change animations are smooth (approx 0.3s duration).
- [ ] Use `Tween.TRANS_QUART` or `Tween.TRANS_EXPO` for a "premium" feel.

## Execution Notes

- Current local work already adds fade-and-slide screen transitions in `scene/scripts/game_root.gd`.
- Remaining work is mostly modal, button, and toast feedback polish.
- Keep motion soft and quick per `.knowns/docs/bumble-v0-agent-brief.md`. This is a Lane 1 foundation task.
