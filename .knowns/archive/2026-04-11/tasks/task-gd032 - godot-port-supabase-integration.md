---
id: gd032
title: "Godot port: supabase integration"
status: todo
priority: high
labels:
  - godot
  - port
  - backend
  - foundation
  - agent-ready
  - two-week
  - active-local-changes
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-04-08T11:00:00Z'
timeSpent: 0
---

# Godot port: supabase integration

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Integrate Supabase into the Godot project. This involves setting up authentication and potentially database access for persistent cross-device saves. Mirrors `lib/supabase.ts`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `supabase_manager.gd` (singleton)
- Methods: `sign_in(email, password)`, `sign_up(email, password)`, `sign_in_anonymously()`, `update_user(email, password)`
- Handle session persistence
- Potentially use a community Supabase addon or implement custom `HTTPRequest` logic for Supabase REST API

## Execution Notes

- Current local work already adds `scene/scripts/supabase_manager.gd` and registers it as an autoload in `scene/project.godot`.
- The remaining work is to harden the flow: session restoration, token refresh path, progress sync hooks, and clearer error states.
- This is a Lane 1 foundation task and the dependency for `gd031`.

## Source reference
- RN: `lib/supabase.ts`
- Godot: `scripts/supabase_manager.gd`
