---
id: m8q2ps
title: "Migrate auth and progress-preservation bridge"
status: todo
priority: high
labels:
  - godot
  - auth
  - backend
createdAt: '2026-02-25T23:05:00Z'
updatedAt: '2026-02-25T23:05:00Z'
timeSpent: 0
---

# Migrate auth and progress-preservation bridge

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define and implement bridge interfaces so Godot save/state can synchronize with React/Supabase auth and progress-preservation flows.

Acceptance criteria:
- Signed-in vs guest state is reflected in Godot runtime.
- Save migration between local Godot save and backend profile is deterministic.
- Existing React auth routes remain functional while Godot state is embedded.
<!-- SECTION:DESCRIPTION:END -->
