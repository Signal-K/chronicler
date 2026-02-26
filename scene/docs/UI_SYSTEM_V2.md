# Bee Garden UI System V2

## Design Philosophy
- One visual language everywhere: dark-base surfaces, green gameplay panels, high-contrast resource accents.
- UI as a framework, not scene-by-scene styling: shared theming and button/panel rules from `res://scripts/ui_framework.gd`.
- Keep gameplay scripts stable: scene rebuilds preserve node contracts used by screen scripts.
- Information first: each screen follows `Title -> Summary -> Primary Actions -> Detail Lists`.

## Core Framework
- Theme entrypoint: `res://scripts/ui_framework.gd` (`UIFwk`).
- App shell controller: `res://scripts/game_root.gd`.
- Shared color tokens:
  - Background: deep green-black.
  - Panel: dark green with border.
  - Text: `TITLE`, `BODY`, `MUTED`.
  - Semantic accents: `GOLD` (currency/results), `GREEN` (progress), `BLUE` (secondary data).
- Shared styling API:
  - `apply_screen_theme(screen_root, root, title_label)`
  - `apply_tab_theme(tabs)`
  - `style_button(button, bg_color, text_color)`
  - `style_primary_text`, `style_muted_text`, `style_accent_gold/green/blue`

## Product Flows
1. Farm Loop (`main.tscn`)
   - Actions: till, plant, water, harvest.
   - Economy hooks: buy seeds, buy bottles.
   - Feedback: top status + tutorial overlay.
2. Hive Loop (`hives.tscn`)
   - Actions: bottle honey, fulfill daily orders.
   - Feedback: order statuses + rewards.
3. Expansion Loop (`expand.tscn`)
   - Actions: unlock map, select active map.
4. Discovery Loop (`planets.tscn`)
   - Action: discover planet.
5. Progress Loop (`progress.tscn`)
   - Actions: award test XP events for progression validation.
6. Utility Loop (`settings.tscn`)
   - Actions: coins/water/seeds/glass grants, tutorial resets.
7. Inventory Loop (`inventory.tscn`)
   - Read-only overview of economy and harvested resources.

## Screen Architecture Standard
- `Background` (`ColorRect`)
- `Root` (`VBoxContainer`)
- `Title` (`Label`)
- One or more `PanelContainer` sections with internal margin/body containers.
- Action rows use `Button` controls styled through `UIFwk`.

## Migration Rule
- Scene structure can be replaced freely, but script-used node paths must remain stable.
- Styling logic belongs in `UIFwk` + per-screen `_apply_ui_theme()` calls.
