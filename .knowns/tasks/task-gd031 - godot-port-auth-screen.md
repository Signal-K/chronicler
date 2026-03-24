---
id: gd031
title: "Godot port: auth screen"
status: todo
priority: low
labels:
  - godot
  - port
  - auth
createdAt: '2026-03-28T00:00:00Z'
updatedAt: '2026-03-28T00:00:00Z'
timeSpent: 0
---

# Godot port: auth screen

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replicate the authentication screen into Godot. This includes sign up, sign in, and guest sign in (anonymous auth). Mirrors `app/auth.tsx`.
<!-- SECTION:DESCRIPTION:END -->

## What to do

- Create `auth.tscn` (Control) with `auth_screen.gd`
- Implement input fields for email and password
- Implement buttons for Sign Up, Sign In, and Guest Sign In
- Connect to Supabase Auth (depends on `gd032`)
- Ensure progress preservation logic is ported (mirrors `lib/progressPreservation.ts`)

## Source reference
- RN: `app/auth.tsx`, `lib/progressPreservation.ts`
- Godot: `scenes/auth.tscn`, `scripts/auth_screen.gd`
