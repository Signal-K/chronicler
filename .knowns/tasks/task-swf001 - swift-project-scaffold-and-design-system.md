---
id: swf001
title: "Swift project scaffold and design system"
status: todo
priority: high
labels:
  - swift
  - setup
  - design-system
createdAt: '2026-04-27T00:00:00+10:00'
updatedAt: '2026-04-27T00:00:00+10:00'
timeSpent: 0
assignee: '@me'
---

# Swift project scaffold and design system

## Description

Create the Xcode project (SwiftUI, iOS 17+) and implement the full design system from the Stitch designs. This is the foundation everything else builds on.

## Implementation Plan

1. Create `BeeGarden.xcodeproj` with SwiftUI app target
2. Bundle custom fonts: Space Grotesk, Be Vietnam Pro, Lexend
3. Implement `DesignSystem.swift` — all colors (primary, surface, tertiary-fixed-dim, etc.), corner radii, spacing constants
4. Implement `BeeCard` view modifier — the chunky brown border + shadow style used on every card
5. Implement `BeeHeader` — top bar with menu icon, title, gold/water counters
6. Implement `BeeTabBar` — bottom nav (Field / Hives / Tools / Seeds / Shop) with active state highlight
7. Paper texture background modifier

## Acceptance Criteria

- [ ] App builds and runs on iOS simulator
- [ ] Design system colors match Stitch palette exactly
- [ ] BeeCard, BeeHeader, BeeTabBar render correctly against Stitch screenshots
- [ ] Custom fonts load
