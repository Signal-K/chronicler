import type { TutorialStep } from './TutorialOverlay';

// ==========================================
// WELCOME & GETTING STARTED TUTORIAL
// ==========================================
export const WELCOME_TUTORIAL: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Bee Garden! 🐝',
    description: 'Welcome to your very own bee garden! Here you\'ll grow crops, manage beehives, and produce delicious honey.\n\nLet\'s learn the basics to get you started on your beekeeping adventure!',
    icon: '🌻',
    tips: [
      'This tutorial will walk you through all the main features',
      'You can access this tutorial again from Settings',
    ],
  },
  {
    id: 'header-overview',
    title: 'Your Dashboard',
    description: 'At the top of your screen, you\'ll find your vital stats:\n\n☀️/🌙 Weather Badge — Tap to access Settings\n\n⭐ Level Badge — Shows your current level. Tap to see detailed XP info\n\n💧 Water Supply — Your current water for watering crops\n\n🪙 Coins — Your currency. Tap to open the Shop',
    icon: '📊',
    highlight: 'header',
    tips: [
      'Water refills over time automatically',
      'Earn coins by selling harvested crops',
      'Leveling up unlocks new features and farm expansions',
    ],
  },
  {
    id: 'farming-tools',
    title: 'Farming Tools',
    description: 'At the bottom of your screen is the toolbar with essential farming tools:\n\n🚜 Till — Prepare empty soil for planting\n\n🌱 Plant — Select and plant seeds in tilled soil\n\n💧 Water — Water your planted crops to help them grow\n\n🌾 Harvest — Collect fully grown crops',
    icon: '🛠️',
    highlight: 'toolbar',
    tips: [
      'Tools highlight when they can be used',
      'Select a tool, then tap the plot you want to use it on',
      'Planting opens a seed selection menu',
    ],
  },
  {
    id: 'garden-plots',
    title: 'Your Garden Plots',
    description: 'Your farm has 6 garden plots where you grow crops. Each plot goes through stages:\n\n1️⃣ Empty — Ready to be tilled\n2️⃣ Tilled — Brown soil ready for seeds\n3️⃣ Planted — Seed placed, needs water\n4️⃣ Growing — Crop is growing (water regularly!)\n5️⃣ Ready — Crop is ready to harvest!',
    icon: '🌱',
    highlight: 'garden',
    tips: [
      'Tap a plot with the right tool selected to use it',
      'Crops grow faster when watered regularly',
      'Neglected crops may wilt and need extra care',
    ],
  },
  {
    id: 'navigation',
    title: 'Screen Navigation',
    description: 'Use the arrow buttons at the bottom to navigate between screens:\n\n◀️ Left Arrow — Go to Hives screen\n▶️ Right Arrow — Navigate between farm pages\n▼ Down Arrow — Access expanded farm (when unlocked)\n\nThe center shows your current location (FARM 1, HIVES, etc.)',
    icon: '🧭',
    highlight: 'navigation',
    tips: [
      'Swipe between screens for quick navigation',
      'Farm 2 and beyond are unlocked with XP levels',
    ],
  },
];

// ==========================================
// HIVES & HONEY PRODUCTION TUTORIAL
// ==========================================
export const HIVES_TUTORIAL: TutorialStep[] = [
  {
    id: 'hives-intro',
    title: 'Your Beehives',
    description: 'The Hives screen is where you manage your bees and collect honey! Navigate here using the left arrow (◀️) from the farm.\n\nThis is where the magic of beekeeping happens! 🍯',
    icon: '🏺',
    highlight: 'hives',
    tips: [
      'You start with one hive',
      'Build more hives as you progress',
    ],
  },
  {
    id: 'bees-and-pollination',
    title: 'Bees & Pollination',
    description: 'When you harvest crops, you earn Pollination Points! 🌸\n\nPollination Points represent how actively your garden attracts bees. Higher pollination = more bees joining your hives!\n\nWatch for the "Bees Ready!" badge when new bees can hatch.',
    icon: '🐝',
    tips: [
      'Harvest diverse crops for better pollination',
      'Different flowers attract different amounts of bees',
      'Sunflowers and lavender are great for bees!',
    ],
  },
  {
    id: 'honey-production',
    title: 'Honey Production',
    description: 'Your bees produce honey during active hours:\n\n☀️ Daytime: 8 AM - 4 PM\n🌙 Nighttime: 8 PM - 4 AM\n\nHarvested crops contribute to honey production. The more diverse your harvests, the more interesting your honey blends!\n\nEach hive shows a honey bottle indicator (🍯 X/15).',
    icon: '🍯',
    tips: [
      'More bees = faster honey production',
      'Honey color depends on which crops you harvest',
      'Collect honey when bottles are ready!',
    ],
  },
  {
    id: 'collecting-honey',
    title: 'Collecting Honey',
    description: 'When a hive has honey ready (shown by the bottle count), tap the "Collect Honey" button!\n\nThe honey type and color depends on the crops your bees visited:\n\n🍅 Tomato → Light, mild honey\n🫐 Blueberry → Amber, fruity honey\n🌸 Lavender → Specialty, floral honey\n🌻 Sunflower → Golden, classic honey',
    icon: '🫗',
    tips: [
      'Collected honey goes to your inventory',
      'Sell honey at the shop for coins',
      'Different honey types have different values',
    ],
  },
  {
    id: 'building-hives',
    title: 'Building New Hives',
    description: 'As your farm grows, you can build additional hives!\n\nEach new hive:\n• Costs coins (price increases with each hive)\n• Holds up to 10 bees\n• Produces honey independently\n• Increases your bee classification limit\n\nMore hives = more honey production capacity!',
    icon: '🏗️',
    tips: [
      'Save up coins for new hives',
      'Each hive adds +2 bee classifications per day',
      'Plan your hive expansion with your farm growth',
    ],
  },
];

// ==========================================
// SHOP & INVENTORY TUTORIAL
// ==========================================
export const SHOP_TUTORIAL: TutorialStep[] = [
  {
    id: 'shop-intro',
    title: 'The Shop',
    description: 'Tap the coins (🪙) in the header to open the Shop!\n\nHere you can purchase:\n\n🌱 Seeds — Tomato, Blueberry, Lavender, Sunflower\n🫙 Glass Bottles — For storing honey\n\nYour current coin balance is shown at the top of the shop.',
    icon: '🛍️',
    highlight: 'shop',
    tips: [
      'Prices vary by item rarity',
      'Stock up on diverse seeds for better pollination',
      'Glass bottles are needed to bottle honey',
    ],
  },
  {
    id: 'seed-types',
    title: 'Seed Types',
    description: 'Each seed type has unique properties:\n\n🍅 Tomato (10 coins) — Quick growing, low nectar\n🫐 Blueberry (12 coins) — Medium growth, good nectar\n🌸 Lavender (15 coins) — Slow growing, specialty honey\n🌻 Sunflower (18 coins) — Medium growth, high bee attraction\n\nChoose based on your strategy!',
    icon: '🌱',
    tips: [
      'Fast-growing crops = quicker income',
      'High-nectar crops = more honey',
      'Balance your planting for optimal results',
    ],
  },
  {
    id: 'inventory-overview',
    title: 'Your Inventory',
    description: 'Access your inventory from the bottom panels. It has tabs for:\n\n🌱 Seeds — Your seed collection\n🌾 Crops — Harvested produce\n🛠️ Tools — Special farming tools\n📐 Expansions — Farm upgrades\n\nBottled honey appears at the bottom!',
    icon: '🎒',
    highlight: 'inventory',
    tips: [
      'Use the + button to expand the inventory view',
      'Harvested crops can be sold for coins',
      'Check inventory before buying seeds',
    ],
  },
];

// ==========================================
// EXPERIENCE & LEVELING TUTORIAL
// ==========================================
export const EXPERIENCE_TUTORIAL: TutorialStep[] = [
  {
    id: 'xp-intro',
    title: 'Experience Points (XP)',
    description: 'Tap your Level Badge (Lv.X) to see detailed XP information!\n\nYou earn XP from various activities:\n\n🌾 Harvesting crops\n🆕 First-time harvests (bonus XP!)\n🌸 Pollination events\n🏷️ Bee classifications\n💰 Selling items',
    icon: '⭐',
    tips: [
      'First harvest of each crop type gives bonus XP',
      'Regular activity is key to leveling up',
      'Higher levels unlock new features',
    ],
  },
  {
    id: 'level-benefits',
    title: 'Level Benefits',
    description: 'As you level up, you unlock:\n\n📍 Level 2+ — Farm expansions available\n📍 Level 5+ — Advanced farm plots\n📍 Level 10+ — Premium upgrades\n\nEach level requires progressively more XP, so keep farming!',
    icon: '📈',
    tips: [
      'Check the Experience screen for unlock requirements',
      'Farm expansions cost coins but add 6 new plots',
      'Plan your purchases based on your level',
    ],
  },
];

// ==========================================
// BEE CLASSIFICATION TUTORIAL
// ==========================================
export const CLASSIFICATION_TUTORIAL: TutorialStep[] = [
  {
    id: 'bees-hovering',
    title: 'Hovering Bees',
    description: 'When you have bees and pollination, you\'ll see bees hovering over your garden! 🐝\n\nThese aren\'t just for show — they\'re interactive!\n\nTap a hovering bee to open the Classification Modal.',
    icon: '🐝',
    tips: [
      'Bees appear based on your hive population',
      'Active gardens attract more visible bees',
    ],
  },
  {
    id: 'classification-system',
    title: 'Bee Classification',
    description: 'Classifying bees is a fun mini-game that earns XP!\n\nWhen you tap a bee, you\'ll be asked to identify details about it. Correct classifications earn:\n\n⭐ XP Points\n🎯 Classification count\n🏆 Achievement progress',
    icon: '🔬',
    tips: [
      'You have limited classifications per day',
      'More hives = more daily classifications',
      'Pay attention to bee characteristics!',
    ],
  },
];

// ==========================================
// SETTINGS & ADVANCED TUTORIAL
// ==========================================
export const SETTINGS_TUTORIAL: TutorialStep[] = [
  {
    id: 'settings-access',
    title: 'Settings Screen',
    description: 'Tap the weather icon (☀️/🌙) in the header to access Settings!\n\nHere you can manage:\n\n👤 Account & login\n🎨 Appearance (dark/light mode)\n⚙️ Debug options\n📱 Permissions\n💾 Local progress',
    icon: '⚙️',
    tips: [
      'Link your account to save progress across devices',
      'Toggle Force Daytime for testing',
    ],
  },
  {
    id: 'day-night-cycle',
    title: 'Day/Night Cycle',
    description: 'The game follows a real day/night cycle!\n\n☀️ Daytime (6 AM - 8 PM):\n• Full visibility\n• Active bee production\n\n🌙 Nighttime (8 PM - 6 AM):\n• Darker visuals\n• Different production windows\n\nHoney is produced during specific hours!',
    icon: '🌓',
    tips: [
      'Use Force Daytime in Settings for testing',
      'Plan your activities around production windows',
    ],
  },
];

// ==========================================
// COMPLETE BEGINNER TUTORIAL (All sections)
// ==========================================
export const COMPLETE_TUTORIAL: TutorialStep[] = [
  ...WELCOME_TUTORIAL,
  ...HIVES_TUTORIAL.slice(0, 3), // Include key hive steps
  ...SHOP_TUTORIAL.slice(0, 2), // Include key shop steps
  ...EXPERIENCE_TUTORIAL.slice(0, 1), // Include XP intro
  {
    id: 'final-tips',
    title: 'You\'re Ready!',
    description: 'You now know the basics of Bee Garden!\n\nRemember:\n\n1️⃣ Till → Plant → Water → Harvest\n2️⃣ Harvests attract bees and make honey\n3️⃣ Collect honey from your hives\n4️⃣ Buy seeds and expand your farm\n5️⃣ Level up to unlock new features!\n\nHappy farming! 🌻🐝🍯',
    icon: '🎉',
    tips: [
      'Experiment with different crop combinations',
      'Check back regularly for honey collection',
      'Have fun growing your bee empire!',
    ],
  },
];

// ==========================================
// QUICK TIPS (for returning players)
// ==========================================
export const QUICK_TIPS: TutorialStep[] = [
  {
    id: 'quick-tip-1',
    title: 'Quick Farming Cycle',
    description: '🚜 Till empty plots\n🌱 Plant seeds\n💧 Water daily\n🌾 Harvest when ready\n\nRepeat for continuous production!',
    icon: '⚡',
  },
  {
    id: 'quick-tip-2',
    title: 'Maximize Honey',
    description: '🌻 Plant high-nectar crops\n🐝 Keep hives populated\n⏰ Play during production hours\n🍯 Collect honey regularly',
    icon: '🍯',
  },
  {
    id: 'quick-tip-3',
    title: 'Level Up Fast',
    description: '🌾 Harvest frequently\n🆕 Try new crop types\n🏷️ Classify bees daily\n💰 Complete sales',
    icon: '⭐',
  },
];
