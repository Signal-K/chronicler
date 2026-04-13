---
id: mvp-20260411
title: "Bumble MVP sprint"
status: in-progress
priority: high
labels:
  - sprint
  - mvp
  - godot
  - ux
  - focus
createdAt: '2026-04-11T00:00:00Z'
updatedAt: '2026-04-12T00:00:00Z'
---

# Bumble MVP sprint

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Drive the current Godot port to MVP by narrowing navigation, unifying the UI, clarifying the core loop, hardening persistence, adding required auth/backup support, and closing the Godot-to-PWA delivery gap. This sprint replaces the broader mixed-readiness backlog with a focused deliverable.
<!-- SECTION:DESCRIPTION:END -->

## Sprint goals

- [x] Keep only MVP-essential screens in the main flow.
- [x] Make garden, hives, orders, inventory, progress, and settings feel like one product. (Universal header added, themes inherited)
- [x] Reduce ambiguity in progression and reward systems. (Level-up rewards and locked crops added)
- [ ] Make repeat sessions safe through reliable local persistence.
- [x] Deliver required account backup and Star Sailors ecosystem integration. (Supabase sync and Auth screen added)
- [ ] Establish a real Godot web export path suitable for installable PWA distribution.

## Acceptance Criteria

- A new player can complete the basic loop without external explanation.
- Non-MVP screens are hidden or deferred.
- Surface-level copy follows the Bumble v0 brief.
- Local save/load feels dependable through repeat play.
- Account connection and recovery are available in the Godot flow.
- The intended citizen-science flow is either polished enough to keep or explicitly removed from the primary MVP path.
- Godot web export exists as a real delivery path rather than an assumption.

## References

- `.knowns/docs/bumble-mvp-audit-2026-04-11.md`
- `.knowns/docs/bumble-mvp-sprint-2026-04-11.md`
- `.knowns/docs/knowns-incomplete-reference-2026-04-11.md`
