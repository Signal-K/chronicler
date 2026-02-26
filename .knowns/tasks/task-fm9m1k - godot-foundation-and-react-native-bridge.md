---
id: fm9m1k
title: "Godot foundation and React Native bridge"
status: todo
priority: high
labels:
  - godot
  - react-native
  - migration
createdAt: '2026-02-25T22:40:00Z'
updatedAt: '2026-02-25T22:40:00Z'
timeSpent: 0
---

# Godot foundation and React Native bridge

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up the Godot project as the gameplay source of truth and wire the native app shell to load Godot using the Signal-K template approach (`@borndotcom/react-native-godot`, RTNGodotView, asset pack loading).

Acceptance criteria:
- Native route/screen loads Godot scene from `scene/` export pack.
- `ios` and `android` shells can start, render, and pause/resume Godot.
- Build scripts document and automate pck/asset export.
<!-- SECTION:DESCRIPTION:END -->
