# Bumble MVP Sprint

Sprint start: 2026-04-11
Sprint review target: 2026-04-25

## Goal

Turn the current Godot port into a coherent MVP PWA by narrowing the surface area, improving UI consistency, making the core loop readable and dependable, and shipping required auth/backup support.

## Sprint definition of done

- The playable loop is garden -> hives -> orders -> progress without confusion.
- Non-MVP screens are hidden, deferred, or clearly removed from primary navigation.
- Core surfaces share one visual system and one copy style.
- Save/load is stable enough for repeat sessions.
- The first five minutes explain what to do next without external guidance.
- Godot has a real web export path suitable for installed PWA delivery.
- Auth and backup work in the Godot MVP flow.

## In scope

1. Narrow navigation to MVP screens.
2. Unify theme and feedback.
3. Clarify progression, order rewards, and hive readiness.
4. Harden persistence plus required auth/backup integration.
5. Decide and polish the citizen-science flow for MVP.
6. Establish Godot web export and PWA delivery path.
7. Replace remaining prototype help/copy on MVP surfaces.

## Out of scope

- Deep ecosystem expansion beyond required auth/backup integration
- Planets content
- Manual terrain painting and tile polish blocked by editor work

## Sprint backlog

| Order | Item | Outcome |
| --- | --- | --- |
| 1 | Navigation cut | Remove non-MVP destinations from primary flow |
| 2 | Theme pass | Shared colours, spacing, panels, and readable hierarchy |
| 3 | Feedback pass | Better toasts, transitions, and completion states |
| 4 | Persistence and auth | Reliable save/load, backup, and ecosystem account path |
| 5 | Citizen science decision | Keep and polish it if it supports the product clearly, otherwise demote it from the main loop |
| 6 | Godot web export | Verified web export path aligned with installable PWA delivery |
| 7 | Help/manual rewrite | Short manual-style support for the first session |
| 8 | Final MVP audit | Run a release-style pass and capture remaining gaps |

## Acceptance questions for review

- Can a new player understand the loop without opening source code or asking for help?
- Does every visible screen justify its existence in MVP?
- Do the UI surfaces look like one game rather than a collection of prototype panels?
- Is any critical player state hidden or hard to interpret?

## Dependencies

- `scene/scripts/game_root.gd`
- `scene/resources/main_theme.tres`
- `scene/scripts/game_state.gd`
- `scene/scripts/save_manager.gd`
- `scene/scripts/game_screen.gd`
- `scene/scripts/hives_screen.gd`
- `scene/scripts/orders_panel.gd`
- `scene/scripts/help_screen.gd`
- `scene/scripts/discover_screen.gd`
- `scene/scripts/classification_screen.gd`
- `scene/scripts/supabase_manager.gd`
- Godot web export configuration once added

## Archive reference

See `knowns-incomplete-reference-2026-04-11.md` for the archived non-MVP backlog and revisit schedule.
