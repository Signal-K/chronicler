---
id: gd032
title: "Godot port: supabase integration"
status: todo
priority: medium
labels:
  - godot
  - port
  - backend
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
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

## Source reference
- RN: `lib/supabase.ts`
- Godot: `scripts/supabase_manager.gd`
