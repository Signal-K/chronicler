# Godot Migration Parity Matrix

Generated on 2026-02-25.

Legend:
- `Replicated`: implemented in Godot with equivalent behavior.
- `Partial`: present in Godot but missing behavior or UI parity.
- `Not replicated`: no Godot implementation yet.
- `Host/migration-only`: React host/bridge code, not original gameplay behavior.

## Route/Page parity (original app surface)

| Route/Page | Source | Godot parity | Notes |
|---|---|---|---|
| `/` | `app/index.tsx` | Not replicated | Auth gate/routing logic remains React-only. |
| `/(tabs)` | `app/(tabs)/index.tsx` | Not replicated | Expo tab scaffold not mirrored in Godot. |
| `/auth` | `app/auth.tsx` | Not replicated | Supabase auth + account upgrade not migrated. |
| `/home` | `app/home.tsx` | Partial | Farm/hive gameplay exists in Godot, but not full multi-panel HomeView behavior. |
| `/farm` | `app/farm.tsx` | Partial | Godot farm scene exists (`main.tscn`) but host route parity is transitional. |
| `/hives` | `app/hives.tsx` | Partial | Hives tab exists in Godot with bottling, daily order fulfillment, and a basic hive tutorial; animation/detail parity is incomplete. |
| `/nests` | `app/nests.tsx` | Partial | Alias to hives in React; covered by Godot hives tab partially. |
| `/expand` | `app/expand.tsx` | Partial | Godot now includes an Expand tab with map unlock/select flow; full UI/mechanics parity is incomplete. |
| `/planets` | `app/planets.tsx` | Partial | Godot now includes a Planets tab with discovery/catalog flow; full visual/data-source parity is incomplete. |
| `/Inventory` | `app/Inventory.tsx` | Partial | Godot now includes a dedicated Inventory tab with core resources/seeds/harvest totals; full UI parity remains incomplete. |
| `/settings` | `app/settings.tsx` | Partial | Godot now includes a Settings tab with migration utility/debug actions; full React settings parity is incomplete. |
| `/experience` | `app/experience.tsx` | Partial | Godot includes a Progress tab with level/XP/stats, but full React experience page parity is incomplete. |
| `/help` | `app/help.tsx` | Not replicated | Help/manual screen not migrated. |
| `/modal` | `app/modal.tsx` | Not replicated | Modal sample route not migrated. |
| `/screens/GardenGrid` | `app/screens/GardenGrid.tsx` | Partial | Equivalent grid implemented via Godot plot scene instances. |
| `/screens/experience` | `app/screens/experience/index.tsx` | Partial | Godot Progress tab covers core XP/status display, but route-level UI parity is incomplete. |
| `/screens/landscape` | `app/screens/landscape.tsx` | Not replicated | Decorative landscape scene not migrated. |
| `/screens/shop` | `app/screens/shop.tsx` | Partial | Shop purchasing exists in Godot farm scene; dedicated standalone shop route UI is not migrated. |
| `/godot` | `app/godot.tsx` | Host/migration-only | New Godot host entrypoint for migration/testing. |

## Exported function parity (all exported original functions/components/hooks/libs)

| File | Exported function(s) | Godot parity | Notes |
|---|---|---|---|
| app/(tabs)/index.tsx | HomeScreen | Not replicated | No Godot equivalent implemented yet. |
| app/Inventory.tsx | Inventory | Partial | Godot now has a standalone Inventory tab with core inventory summaries; full visual/interaction parity is incomplete. |
| app/_layout.tsx | RootLayout | Not replicated | No Godot equivalent implemented yet. |
| app/auth.tsx | AuthScreen | Not replicated | No Godot equivalent implemented yet. |
| app/expand.tsx | ExpandScreen | Partial | Expand map unlock/select gameplay exists in Godot; full route/UI parity is incomplete. |
| app/experience.tsx | ExperienceDetailsScreen | Partial | Core XP/level display exists in Godot Progress tab; upgrade and full layout parity are incomplete. |
| app/farm.tsx | FarmScreen | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| app/godot.tsx | GodotScreen | Host/migration-only | Bridge shell for embedding Godot; not part of original gameplay parity. |
| app/help.tsx | HelpScreen | Not replicated | No Godot equivalent implemented yet. |
| app/hives.tsx | HivesScreen | Partial | Hive simulation, bottling, daily orders, and a basic hive tutorial exist in Godot; animation/detail parity is incomplete. |
| app/home.tsx | HomeScreen | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| app/index.tsx | InitialRoute | Not replicated | No Godot equivalent implemented yet. |
| app/modal.tsx | ModalScreen | Not replicated | No Godot equivalent implemented yet. |
| app/planets.tsx | PlanetsScreen | Partial | Godot Planets tab supports discovery/catalog and progression linkage; full screen parity is incomplete. |
| app/screens/GardenGrid.tsx | GardenGrid | Partial | Equivalent gameplay grid exists via Godot plot scene instances. |
| app/screens/experience/index.tsx | ExperienceDetailsScreen | Partial | Core XP/level display exists in Godot Progress tab; full duplicate-screen parity is incomplete. |
| app/screens/landscape.tsx | LandscapeScene | Not replicated | No Godot equivalent implemented yet. |
| app/screens/shop.tsx | Shop | Partial | Core shop purchasing is implemented in Godot farm UI; full standalone shop layout parity is incomplete. |
| app/settings.tsx | SettingsScreen | Partial | Godot has a Settings tab for core migration/debug actions; full account/theme/permissions parity is incomplete. |
| components/PlanetIcon.tsx | PlanetIcon | Not replicated | No Godot equivalent implemented yet. |
| components/animations/HarvestAnimation.tsx | HarvestAnimation | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/greenhouse.tsx | Greenhouse | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/minecart.tsx | Minecart | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/silo.tsx | GrainSilo | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/track.tsx | MinecartTrack | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/train-station.tsx | TrainStation | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/water-pipe.tsx | WaterPipe | Not replicated | No Godot equivalent implemented yet. |
| components/elements/buildings/water-tank.tsx | WaterTank | Not replicated | No Godot equivalent implemented yet. |
| components/elements/tree.tsx | Tree | Not replicated | No Godot equivalent implemented yet. |
| components/external-link.tsx | ExternalLink | Not replicated | No Godot equivalent implemented yet. |
| components/garden/BottomPanels.tsx | BottomPanels | Not replicated | No Godot equivalent implemented yet. |
| components/garden/GardenBottomBar.tsx | GardenBottomBar | Partial | Godot has native toolbar/header controls but not full design/behavior parity. |
| components/garden/GardenFence.tsx | GardenFence | Not replicated | No Godot equivalent implemented yet. |
| components/garden/GardenGrid.tsx | GardenGrid | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| components/garden/HoveringBeeWithTag.tsx | HoveringBeeWithTag | Not replicated | No Godot equivalent implemented yet. |
| components/garden/HoveringBeesManager.tsx | HoveringBeesManager | Not replicated | No Godot equivalent implemented yet. |
| components/garden/MapCard.tsx | MapCard | Partial | Godot Expand tab implements map unlock/select rows; card-level visual parity is incomplete. |
| components/garden/SimpleToolbar.tsx | SimpleToolbar | Partial | Godot has native toolbar/header controls but not full design/behavior parity. |
| components/garden/Toolbar.tsx | Toolbar | Partial | Godot has native toolbar/header controls but not full design/behavior parity. |
| components/godot/GodotHostView.tsx | GodotHostView | Host/migration-only | Bridge shell for embedding Godot; not part of original gameplay parity. |
| components/hives/FlyingBee.tsx | FlyingBee | Partial | Hive simulation, bottling, daily orders, and a basic hive tutorial exist in Godot; flying-bee animation parity is incomplete. |
| components/hives/HiveComponent.tsx | HiveComponent | Partial | Hive simulation, bottling, daily orders, and a basic hive tutorial exist in Godot; full visual/interaction parity is incomplete. |
| components/hives/OrdersPanel.tsx | OrdersPanel | Partial | Godot has a scene-authored daily orders panel with fulfillment; visual/feature parity is incomplete. |
| components/inventory/CoinsDisplay.tsx | CoinsDisplay | Partial | Core resource counters are shown in Godot; full inventory UI/tabs not yet migrated. |
| components/inventory/CropsTab.tsx | CropsTab | Partial | Core resource counters are shown in Godot; full inventory UI/tabs not yet migrated. |
| components/inventory/HoneyBottle.tsx | HoneyBottle | Partial | Core resource counters are shown in Godot; full inventory UI/tabs not yet migrated. |
| components/inventory/InventoryExtras.tsx | ExpansionsTab, ToolsTab | Not replicated | No Godot equivalent implemented yet. |
| components/inventory/InventoryTabs.tsx | InventoryTabs | Not replicated | No Godot equivalent implemented yet. |
| components/inventory/SeedsTab.tsx | SeedsTab | Partial | Core resource counters are shown in Godot; full inventory UI/tabs not yet migrated. |
| components/inventory/inventory.tsx | Inventory | Partial | Core resource counters are shown in Godot; full inventory UI/tabs not yet migrated. |
| components/landscape/background.tsx | LandscapeGrassBackground | Not replicated | No Godot equivalent implemented yet. |
| components/modals/ClassificationModal.tsx | ClassificationModal | Not replicated | No Godot equivalent implemented yet. |
| components/modals/SiloModal.tsx | SiloModal | Not replicated | No Godot equivalent implemented yet. |
| components/parallax-scroll-view.tsx | ParallaxScrollView | Not replicated | No Godot equivalent implemented yet. |
| components/placeables/SimplePlot.tsx | SimplePlot | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| components/placeables/SoilPlot.tsx | SoilPlot | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| components/screens/HomeContent.tsx | HomeContent | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| components/screens/HomeView.tsx | HomeView | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| components/screens/NestsContent.tsx | NestsContent | Partial | Hive simulation, bottling, daily orders, and a basic hive tutorial exist in Godot; full tab/content parity is incomplete. |
| components/settings/AccountSection.tsx | AccountSection | Not replicated | No Godot equivalent implemented yet. |
| components/settings/AppearanceSection.tsx | AppearanceSection | Not replicated | No Godot equivalent implemented yet. |
| components/settings/DayNightOverrideSection.tsx | DayNightOverrideSection | Not replicated | No Godot equivalent implemented yet. |
| components/settings/DebugSection.tsx | DebugSection | Partial | Godot Settings tab includes practical debug/migration utility actions; full section parity is incomplete. |
| components/settings/FillHivesSection.tsx | FillHivesSection | Partial | Godot Settings includes resource utility actions that support hive testing; exact section parity is incomplete. |
| components/settings/GrowthAlgorithmSection.tsx | GrowthAlgorithmSection | Not replicated | No Godot equivalent implemented yet. |
| components/settings/LocalProgressSection.tsx | LocalProgressSection | Not replicated | No Godot equivalent implemented yet. |
| components/settings/PermissionsSection.tsx | PermissionsSection | Not replicated | No Godot equivalent implemented yet. |
| components/sprites/CropSprite.tsx | CropSprite | Not replicated | No Godot equivalent implemented yet. |
| components/themed-text.tsx | ThemedText | Not replicated | No Godot equivalent implemented yet. |
| components/themed-view.tsx | ThemedView | Not replicated | No Godot equivalent implemented yet. |
| components/tutorial/HelpTooltip.tsx | CONTEXTUAL_TIPS, HelpTooltip | Partial | Farm onboarding exists in Godot tutorial overlay; contextual tooltip parity is incomplete. |
| components/tutorial/HiveTutorial.tsx | HiveTutorial | Partial | A basic hive tutorial flow exists in Godot hives scene; full step/content parity is incomplete. |
| components/tutorial/InteractiveTutorial.tsx | InteractiveTutorial | Partial | Core farm onboarding flow is implemented in Godot, but step coverage and visual parity are incomplete. |
| components/tutorial/TutorialOverlay.tsx | TutorialOverlay | Partial | Scene-authored tutorial overlay exists on Farm in Godot; global/tutorial-wide parity is incomplete. |
| components/ui/BeeHatchAlert.tsx | BeeHatchAlert | Not replicated | No Godot equivalent implemented yet. |
| components/ui/ExperienceBar.tsx | ExperienceBar | Partial | Godot Progress tab includes XP progress visualization, but visual component parity is incomplete. |
| components/ui/GameHeader.tsx | GameHeader | Partial | Godot has native toolbar/header controls but not full design/behavior parity. |
| components/ui/InfoDialog.tsx | InfoDialog | Not replicated | No Godot equivalent implemented yet. |
| components/ui/ShopIcons.tsx | BlueberrySeedIcon, LavenderSeedIcon, SunflowerSeedIcon, GlassBottleIcon, OrderBoxIcon, CoinIcon, TomatoSeedIcon | Not replicated | No Godot equivalent implemented yet. |
| components/ui/Toast.tsx | Toast | Not replicated | No Godot equivalent implemented yet. |
| components/ui/icon-symbol.tsx | IconSymbol | Not replicated | No Godot equivalent implemented yet. |
| contexts/auth.tsx | useAuth, AuthProvider | Not replicated | No Godot equivalent implemented yet. |
| hooks/themeManager.ts | getOverride, subscribe, setOverride | Not replicated | No Godot equivalent implemented yet. |
| hooks/use-color-scheme.ts | useColorScheme | Not replicated | No Godot equivalent implemented yet. |
| hooks/use-theme-color.ts | useThemeColor | Not replicated | No Godot equivalent implemented yet. |
| hooks/useClassificationTracking.ts | useClassificationTracking | Not replicated | No Godot equivalent implemented yet. |
| hooks/useDayNightCycle.ts | useDayNightCycle | Not replicated | No Godot equivalent implemented yet. |
| hooks/useFarmNavigation.ts | useFarms, useFarmNavigation | Not replicated | No Godot equivalent implemented yet. |
| hooks/useGameState.ts | useGameState | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| hooks/useHiveState.ts | useHiveState | Partial | Hive simulation, bottling, daily orders, and basic hive tutorial state exist in Godot; full hook parity is incomplete. |
| hooks/useHoneyOrders.ts | useHoneyOrders | Partial | Daily order generation/fulfillment exists in Godot state and hives UI, but full feature parity is incomplete. |
| hooks/useHoneyProduction.ts | useHoneyProduction | Partial | Hive simulation, bottling, daily orders, and basic hive tutorial state exist in Godot; production detail parity is incomplete. |
| hooks/useHoveringBees.ts | useHoveringBees | Not replicated | No Godot equivalent implemented yet. |
| hooks/useMapSystem.ts | useMapSystem | Partial | Map unlock/select state and active-map persistence now exist in Godot `GameState`; full API parity is incomplete. |
| hooks/usePanelManager.ts | usePanelManager | Partial | Godot has scene-level UI panels/tabs but no full panel-manager parity yet. |
| hooks/usePlanets.ts | usePlanets | Partial | Godot now tracks discovered planets in `GameState`; Supabase-driven parity and planet visualization detail remain incomplete. |
| hooks/usePlayerExperience.ts | usePlayerExperience | Partial | Godot now tracks persisted XP/level/progression metrics in `GameState`, but hook-level API parity is incomplete. |
| hooks/usePlotActions.ts | usePlotActions | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| hooks/usePollinationFactor.ts | usePollinationFactor | Not replicated | No Godot equivalent implemented yet. |
| hooks/useTutorial.ts | useTutorial | Partial | Godot persists tutorial step/completion state and advances on gameplay events; full hook-level parity is incomplete. |
| hooks/useWaterSystem.ts | useWaterSystem | Partial | Water resource and regen exist in Godot, but not all RN storage/timer semantics are matched. |
| lib/beeHatching.ts | checkForBeeHatching | Not replicated | No Godot equivalent implemented yet. |
| lib/classificationTracking.ts | getClassificationHistory, getTodayDateString, getDailyClassificationData, saveDailyClassificationData, canMakeClassification, recordClassification | Not replicated | No Godot equivalent implemented yet. |
| lib/cropConfig.ts | getCropConfig, canPlantCrop, calculateHoneyBlend | Partial | Farm loop exists in Godot (main.tscn, plot.tscn, game_screen.gd) but feature coverage is incomplete. |
| lib/experienceSystem.ts | savePlayerExperience, awardHarvestXP, awardPollinationXP, awardClassificationXP, awardSaleXP, getPlayerExperienceInfo, calculateXPForLevel, calculateLevelFromXP, getXPProgress, loadPlayerExperience | Partial | Equivalent XP curve and event awards are implemented in Godot `GameState`; full API and integration parity remain incomplete. |
| lib/progressPreservation.ts | signUpWithProgressPreservation, upgradeGuestWithProgressPreservation, getLocalDataSummary, migrateExperienceData, signInWithProgressPreservation | Not replicated | No Godot equivalent implemented yet. |
| lib/supabase.ts | supabase | Not replicated | No Godot equivalent implemented yet. |
| lib/waterSystem.ts | getWaterConstants, getWaterSystem, saveWaterSystem, updateWater, useWater | Partial | Water resource and regen exist in Godot, but not all RN storage/timer semantics are matched. |
