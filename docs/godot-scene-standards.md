# Godot Scene Authoring Standards

Version: 1.0
Status: Active

---

## Purpose

These rules keep Godot scene files (`.tscn`) the source of truth for what the player
sees, so the editor preview matches runtime and code-reviewers can follow UI changes
without running the game.

---

## Core Rules

### 1. Visible nodes must be authored in `.tscn`

All nodes that are visible to the player **must** exist in the scene file as static
nodes. Do not create structural layout nodes (Panel, VBox, HBox, Label, Button, etc.)
at runtime from GDScript.

**Allowed:**
```gdscript
# Styling an existing node is fine
UIFwk.style_warm_panel($Root/Summary)
$Root/Title.text = "My Title"
```

**Not allowed:**
```gdscript
# Do not create layout/visible nodes at runtime
var panel = PanelContainer.new()
add_child(panel)
```

**Exceptions:** Dynamically spawned game entities (e.g. HiveCard instances, PlotNode
instances) driven by data arrays are explicitly exempt. Document these with an inline
comment: `# spawned at runtime – see _build_hive_list()`.

---

### 2. Scripts are behavior, not structure

Scripts attached to scene nodes must contain **behavior, state, and styling logic only**.
Node hierarchy and relationships are defined in `.tscn`.

- ✅ Signal connections (`button.pressed.connect(...)`)
- ✅ Theme overrides via `UIFwk.*`
- ✅ `text`, `visible`, `disabled` property updates
- ❌ `add_child()` for layout nodes
- ❌ `Node.new()` for PanelContainer / VBoxContainer / Label / Button

---

### 3. `@onready` paths must match the scene tree exactly

Every `@onready` variable must reflect the precise node path in the `.tscn` file.
If a node is renamed or moved in the scene, update all `@onready` references in the
script in the same commit.

```gdscript
# Good – path matches scene tree
@onready var coins_label: Label = $Root/Summary/SummaryMargin/SummaryBody/CoinsLabel

# Bad – ambiguous shortcut
@onready var coins_label: Label = find_child("CoinsLabel")
```

---

### 4. One script per scene root

Each `.tscn` file has at most one GDScript file attached to its root node.
Child nodes that need behavior should be separate subscenes (`.tscn`) with their own
scripts, not inline scripts.

---

### 5. Theme and color constants live in `UIFwk`

Colors, font sizes, and StyleBoxFlat definitions **must not** be hardcoded inline in
individual screen scripts. Define them once in `ui_framework.gd` and call the
appropriate helper.

```gdscript
# Good
UIFwk.style_amber_text(my_label)

# Bad – colour value repeated across files
my_label.add_theme_color_override("font_color", Color("92400E"))
```

---

### 6. Background colors belong in the scene file

The root Control node's background color must be set as a `StyleBoxFlat` override
in the `.tscn` file, not in `_ready()` or `_apply_ui_theme()`. Runtime theme calls
may *adjust* colors but should not be the sole source of the background.

---

### 7. Naming conventions

| Node type | Convention | Example |
|---|---|---|
| Root container | `Root` | `Root (VBoxContainer)` |
| Header panels | `*Panel` suffix | `HeaderPanel`, `TopBar` |
| Content sections | Descriptive noun | `HiveList`, `OrdersPanel` |
| Labels | Descriptive + `Label` | `CoinsLabel`, `StatusLabel` |
| Buttons | Descriptive + `Button` | `CollectButton`, `UnlockButton` |
| Margin wrappers | Parent name + `Margin` | `CardMargin`, `SummaryMargin` |
| Body containers | Parent name + `Body` | `SummaryBody`, `CardBody` |

---

### 8. Subscription to external state

Screens should **pull** data from `GameState` in `_refresh_ui()` and `_ready()`.
Do not keep a second copy of arrays that `GameState` already owns; use snapshot
helpers (`GameState.snapshot_hives()`, etc.) and write back with setters.

---

## New Scene Checklist

Before merging a new Godot scene:

- [ ] All visible nodes exist in the `.tscn`, not created at runtime
- [ ] Root node has a `_apply_ui_theme()` call in `_ready()`
- [ ] All colors/fonts use `UIFwk` helpers
- [ ] `@onready` paths verified against scene tree
- [ ] Background color set in `.tscn` StyleBoxFlat (not only in script)
- [ ] Scene follows naming conventions above
- [ ] Dynamic-spawn exceptions are commented inline

---

## Allowed Exceptions (document inline)

| Pattern | Reason | Comment required |
|---|---|---|
| HiveCard / PlotNode instantiation | Data-driven count not known at edit time | Yes |
| Tutorial overlay visibility toggling | State-driven show/hide of existing nodes | No (just `visible =`) |
| Order row dynamic enable/disable | State-driven UI update on existing nodes | No |
