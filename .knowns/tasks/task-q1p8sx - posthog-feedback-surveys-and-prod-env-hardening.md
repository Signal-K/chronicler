---
id: q1p8sx
title: "PostHog feedback surveys and prod env hardening"
status: todo
priority: high
labels:
  - posthog
  - survey
  - supabase
  - security
  - migration
createdAt: '2026-02-26T09:45:00Z'
updatedAt: '2026-02-26T09:45:00Z'
timeSpent: 0
---

# PostHog feedback surveys and prod env hardening

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement structured player feedback collection for core mechanics and onboarding completion:
- 2-question pulse surveys for farming, classification, and hives/orders.
- NPS-style survey after the basics are complete.
- PostHog API script to create/update these surveys from local env credentials.

Harden bundled builds to use production Supabase variables via managed build environments, without committing secrets in repo config.

Acceptance criteria:
- In-app survey triggers fire based on mechanic milestones and classification completion.
- Survey responses are captured to PostHog events.
- PostHog survey creation script supports dry-run and apply modes and loads local env file.
- `eas.json` contains no committed Supabase secrets and uses build environment mapping.
- Secret env locations are git-ignored.
<!-- SECTION:DESCRIPTION:END -->
