---
id: gd-ui-03
title: "Godot port: Interactive Juice"
status: todo
priority: medium
labels:
  - godot
  - port
  - ui
  - vfx
  - polish
  - agent-ready
  - two-week
createdAt: '2026-04-08T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
---

# Godot port: Interactive Juice

## Description
Enhance the "cosy" farm feel with interactive juice (particles, wobble, subtle animation) using existing assets and Godot features.

## Acceptance Criteria
- [ ] Add `GPUParticles2D` for "Magic Dust" when a crop is harvested.
- [ ] Implement "Wobble" animations (using `Tween` or `AnimationPlayer`) when tapping crops or hives.
- [ ] Implement a subtle "Wind" oscillation (rotation/skew) for crop sprites in `plot.tscn`.
- [ ] Add "Level Up" VFX (particles, scale animation) for the progress bar.
- [ ] Implement a "Day/Night" transition shader or canvas modulation with smooth color interpolation.
- [ ] Add particles for "Rain" when `is_raining` is true in `GameState`.

## Execution Notes

- Do this after the theme and transition foundation tasks settle.
- Effects should stay subtle, asset-light, and easy to remove if they become noisy.
- Use the v0 brief as the limit: no spectacle, just enough motion to make the farm feel alive.
