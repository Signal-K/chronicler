# Bumble v0 Content Defaults

Use this doc whenever a coding task needs copy, naming, or lightweight content design. The goal is to unblock implementation, not to create a final narrative layer.

## Voice Rules

- Write in a calm manual voice.
- Keep lines short and practical.
- Default to one sentence. Use two only when a second sentence prevents confusion.
- Use one emoji at most for alerts or labels. Help text does not need emoji.
- Keep NPC lines recognisable but not heavily personalised.
- Never use planets, hidden biomes, or wider Star Sailors lore as routine player-facing copy.

## UI String Defaults

| Surface | Default copy | Notes |
| --- | --- | --- |
| `game.toast.watered` | `Water applied.` | Success state for watering |
| `game.toast.no_water` | `Water tank empty.` | Blocked water action |
| `game.toast.harvest` | `Harvest collected.` | Use only when count-based toast is not shown |
| `game.toast.first_harvest_bonus` | `First harvest bonus +10 XP` | Show separately when possible |
| `game.toast.bee_hatched` | `New bee hatched.` | Keep hatch feedback small |
| `game.toast.level_up` | `Level %d reached.` | Practical, not celebratory |
| `game.toast.rain_start` | `Rain started.` | Short weather notification |
| `game.toast.rain_stop` | `Rain stopped.` | Short weather notification |
| `orders.empty` | `No orders posted yet today.` | Empty order board state |
| `orders.fulfilled` | `Order packed.` | Success state after fulfilment |
| `orders.not_ready` | `Not enough bottles yet.` | Optional blocked fulfilment message |
| `hives.no_honey_ready` | `Honey is still collecting.` | Bottle action blocked |
| `hives.no_bottles` | `No empty bottles.` | Bottle action blocked |
| `hives.build_locked` | `Need more coins for a new hive.` | Build hive blocked |
| `inventory.empty_crops` | `No crops stored yet.` | Empty crop tab |
| `inventory.empty_honey` | `No bottled honey yet.` | Empty honey state |
| `expand.locked` | `Save coins to unlock more land.` | Expansion prompt |
| `classification.limit` | `Daily bee checks used.` | Daily classification cap |
| `settings.cloud_off` | `Cloud sync not connected.` | Placeholder auth/sync status |

## Copy Pattern Defaults

- Harvest toasts should stay numeric-first when counts matter, for example `+2 🍅 and +1 seed`.
- XP bonus copy should usually be a second toast or a badge-level detail, not concatenated into long harvest messages.
- Level-up copy should confirm progress, not imply a major new story beat.
- Honey names can create variety, but should not imply quality grades.

## Help Screen Rewrite

Use these sections to replace the current help content when the help screen is revised.

### Getting Started

- `How do I plant a crop?`
  `Select Till and prepare an empty plot. Select Plant, choose a seed, then tap the tilled plot.`
- `When should I water?`
  `Water after planting and whenever a crop still needs support to grow. Water refills over time.`
- `When is a crop ready to harvest?`
  `Harvest when the crop reaches its final growth stage.`

### Tools And Navigation

- `What do the tools do?`
  `Till prepares soil. Plant uses a seed. Water supports growth. Harvest collects a ready crop.`
- `How do I move between screens?`
  `Use the bottom tabs to move between the garden, hives, inventory, progress, and settings screens.`
- `What should I check in the header?`
  `Track coins, water, and level first. Those three values explain most early decisions.`

### Bees And Hives

- `How do I attract more bees?`
  `Harvest crops to raise pollination. New bees join when you reach the next pollination milestone.`
- `What do hives do?`
  `Hives turn crop activity into bottled honey over time.`
- `Why build another hive?`
  `More hives increase bee capacity and give you more room for honey production.`

### Honey And Orders

- `How is honey made?`
  `Harvested crops feed hive production. Bottle honey when a hive has enough stored.`
- `Why are there different honey types?`
  `Honey type reflects the crops most used by the hive. It adds order variety, not quality tiers.`
- `What are orders for?`
  `Orders exchange bottled honey for coins and experience.`

### Save And Account

- `Do I need an account?`
  `No. Local play comes first. Account linking is for backup and recovery once auth is connected.`
- `What does reset do?`
  `Reset clears local progress on this device.`

## Tutorial Defaults

If a tutorial step needs to be rewritten or trimmed, use this order:

1. `Your garden`
   `Use the garden to grow crops and keep your first hive working.`
2. `Prepare a plot`
   `Till an empty plot before planting.`
3. `Plant and water`
   `Choose a seed, plant it, and keep water available.`
4. `Harvest`
   `Harvest crops when they finish growing.`
5. `Grow pollination`
   `Harvesting raises pollination and attracts more bees.`
6. `Bottle honey`
   `Collect honey from hives once enough has built up.`
7. `Fill orders`
   `Use bottled honey to complete daily orders for coins and experience.`
8. `Expand carefully`
   `Add hives or land when your current loop is stable.`

## NPC Order Voice

Keep the register consistent across all order-givers. The name adds flavour; the sentence does not need a deep persona.

### Farmer Joe

- Requests: `Need a few bottles for the weekend market.` `Looking for a steady honey order.`
- Reactions: `That will do nicely.` `Good. I can use this right away.`

### Chef Rosa

- Requests: `Need a clean batch for the kitchen.` `Send over a few bottles for service tonight.`
- Reactions: `Perfect for today's menu.` `That will go straight into the kitchen.`

### Baker Tim

- Requests: `Need honey for the morning bake.` `Running low on my usual stock.`
- Reactions: `Good timing.` `That keeps the ovens moving.`

### Grandma Bee

- Requests: `Set aside a few bottles for me.` `Need honey for the pantry shelf.`
- Reactions: `Lovely. Thank you.` `That will keep well.`

### Market Molly

- Requests: `Need stock for the front stall.` `Send whatever is ready for sale today.`
- Reactions: `Good. I can post that right away.` `That will move quickly.`

### Tea Master Li

- Requests: `Need a calm, reliable batch.` `Please send a few bottles for the tea room.`
- Reactions: `Well chosen.` `That will serve well.`

## Simple Building Defaults

Treat these as the first safe building concepts for Bumble. They can be implemented as upgrade cards or menu items before they ever become placeable art objects.

| Building | Player-facing description | Practical purpose |
| --- | --- | --- |
| Greenhouse | `Sheltered growing space.` | Safe future hook for growth speed or crop stability |
| Water tank | `Stores extra water.` | Increase max water or improve refill reliability |
| Seed shed | `Keeps seed stock in order.` | Increase seed storage or lower restock friction |
| Honey bench | `Packing space for honey work.` | Improve bottling or order handling efficiency |
| Hive stand | `Room for another working hive.` | Increase hive capacity without inventing a new system family |

## Immediate Integration Targets

- `scene/scripts/game_screen.gd`
- `scene/scripts/help_screen.gd`
- `scene/scripts/orders_panel.gd`
- `scene/scripts/game_state.gd`
- Future `scene/scripts/auth_screen.gd`
- Any remaining React Native copy that still says `Bee Garden` or openly references `Star Sailors` in player-facing auth flows
