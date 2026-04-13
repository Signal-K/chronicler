# Knowns Incomplete Reference

Date captured: 2026-04-11

This document records every Knowns ticket that was still incomplete on 2026-04-11 before the task board was archived and reset for an MVP-focused sprint.

## Snapshot summary

- Total archived tasks: 50
- Completed at archive time: 38
- Incomplete at archive time: 12
- `todo`: 11
- `blocked`: 1

## Incomplete tickets

### High priority

| ID | Status | Title | Why it still matters | Revisit date |
| --- | --- | --- | --- | --- |
| `gd-ui-01` | `todo` | Godot port: Universal 'Cosy' Theme | Current screens do not yet feel like one product. Theme unification is a direct MVP requirement. | 2026-04-25 |
| `gd-ui-02` | `todo` | Godot port: Screen transitions & feedback | Navigation works, but the product still needs feedback polish and clearer state changes. | 2026-04-25 |
| `gd-logic-01` | `todo` | Godot port: XP system refinement | Progression exists, but the levelling loop is still too thin and unclear for MVP retention. | 2026-04-25 |
| `gd-logic-02` | `todo` | Godot port: Honey & crop logic deepening | The honey loop needs stronger meaning and clearer player reward structure. | 2026-04-25 |
| `gd032` | `todo` | Godot port: supabase integration | Required for MVP because backup and Star Sailors ecosystem integration are in scope. Pull this into the active sprint. | 2026-04-25 |

### Medium priority

| ID | Status | Title | Why it still matters | Revisit date |
| --- | --- | --- | --- | --- |
| `b2q9lu` | `todo` | Ecosystem v0 release readiness for Bumble | This is the final stabilization and tester-readiness pass once the MVP loop is solid. | 2026-05-09 |
| `gd-logic-03` | `todo` | Godot port: Persistence & state management | Save/load works, but it still needs hardening before external testing. | 2026-04-25 |
| `gd-logic-04` | `todo` | Godot port: Order variation & NPC flavour | Orders functionally exist, but they need more life and clearer reward framing. | 2026-05-09 |
| `gd-ui-03` | `todo` | Godot port: Interactive Juice | Valuable polish work, but not as critical as clarity, consistency, and progression. | 2026-05-09 |
| `gd031` | `todo` | Godot port: auth screen | Required if the Godot MVP needs account linking and restore in the player-facing flow. Pull this into the active sprint. | 2026-04-25 |
| `gd021` | `blocked` | Godot port: tileset and terrain sprites | Needs manual Godot editor work. Keep blocked unless someone is explicitly available for tile painting and scene assembly. | 2026-05-09 |

### Low priority

| ID | Status | Title | Why it still matters | Revisit date |
| --- | --- | --- | --- | --- |
| `xqm080` | `todo` | Research citizen-science data and image sources for Bumble | Useful future ecosystem work, but not necessary to reach MVP. | 2026-05-23 |

## Recommended order after archive

1. `gd-ui-01`
2. `gd-ui-02`
3. `gd-logic-01`
4. `gd-logic-03`
5. `gd-logic-02`
6. `gd032`
7. `gd031`
8. MVP sprint acceptance pass

## Explicit defer list

- Hide or deprioritize `planets`, `discover`, `classification`, and deeper ecosystem surfaces unless they are essential to the first-session loop.
- Keep auth and cloud sync as post-MVP unless they are required for launch scope.
- Leave `gd021` blocked until manual editor capacity exists.
