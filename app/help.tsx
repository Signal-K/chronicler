import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';

type HelpSection = {
  id: string;
  title: string;
  icon: string;
  content: HelpItem[];
};

type HelpItem = {
  question: string;
  answer: string;
};

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'basics',
    title: 'Getting Started',
    icon: '🌱',
    content: [
      {
        question: 'How do I plant crops?',
        answer: 'First, tap the Till button (🚜) and tap an empty plot to prepare the soil. Then tap Plant (🌱), select a seed type, and tap the tilled plot to plant. Don\'t forget to water your plants!',
      },
      {
        question: 'How do I water my plants?',
        answer: 'Tap the Water button (💧) in the toolbar, then tap any planted plot that needs water. Your water supply is shown at the top of the screen and refills over time.',
      },
      {
        question: 'When can I harvest?',
        answer: 'Crops go through growth stages. When a plant is fully grown (you\'ll see the mature plant image), tap the Harvest button (🌾) and tap the ready crop to collect it.',
      },
      {
        question: 'What do I do with harvested crops?',
        answer: 'Harvested crops go to your inventory. You can sell them at the shop for coins, or they contribute to your hive\'s honey production. Different crops produce different types of honey!',
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation & Controls',
    icon: '🧭',
    content: [
      {
        question: 'How do I navigate between screens?',
        answer: 'Use the arrow buttons at the bottom of the screen. Left (◀️) goes to Hives, right arrows navigate farm pages. The center label shows your current location.',
      },
      {
        question: 'What do the header icons mean?',
        answer: '☀️/🌙 Weather (tap for Settings) | ⭐ Level (tap for XP details) | 💧 Water supply | 🪙 Coins (tap for Shop)',
      },
      {
        question: 'How do I access my inventory?',
        answer: 'Your inventory can be accessed through the bottom panel system. Seeds, crops, tools, and honey bottles are organized in tabs.',
      },
      {
        question: 'What\'s the toolbar?',
        answer: 'The toolbar at the bottom shows your farming tools: Till, Plant, Water, and Harvest. Tap a tool to select it, then tap the plot you want to use it on.',
      },
    ],
  },
  {
    id: 'bees',
    title: 'Bees & Hives',
    icon: '🐝',
    content: [
      {
        question: 'How do I get bees?',
        answer: 'Bees are attracted by your pollination score. Every time you harvest crops, you earn pollination points. When you reach the threshold, new bees will hatch and join your hives!',
      },
      {
        question: 'What is the Pollination Factor?',
        answer: 'The pollination factor represents how attractive your garden is to bees. Higher pollination means more bees will join your hives. Check your score on the Hives screen.',
      },
      {
        question: 'How do I build more hives?',
        answer: 'On the Hives screen, you\'ll see an option to build new hives if you have enough coins. Each hive can hold up to 10 bees and produces honey independently.',
      },
      {
        question: 'What do bees do?',
        answer: 'Bees collect nectar from your harvested crops and produce honey. More bees = faster honey production. They also allow you to make more daily bee classifications.',
      },
      {
        question: 'What is bee classification?',
        answer: 'Tap hovering bees on your farm to classify them! This mini-game earns you XP and counts toward achievements. Your daily classification limit increases with each hive you own.',
      },
    ],
  },
  {
    id: 'honey',
    title: 'Honey Production',
    icon: '🍯',
    content: [
      {
        question: 'How is honey produced?',
        answer: 'When you harvest crops, they contribute nectar to your hives. Your bees process this nectar into honey during production hours (8 AM - 4 PM and 8 PM - 4 AM).',
      },
      {
        question: 'What affects honey color and type?',
        answer: 'The crops you harvest determine your honey type! Tomatoes make light honey, blueberries make amber honey, lavender creates specialty honey, and sunflowers produce classic golden honey.',
      },
      {
        question: 'How do I collect honey?',
        answer: 'Go to the Hives screen. Each hive shows its honey bottle count (🍯 X/15). When bottles are ready, tap "Collect Honey" to add them to your inventory.',
      },
      {
        question: 'What do I do with honey?',
        answer: 'Honey bottles can be sold at the shop for coins. Different honey types have different values, so experimenting with crop varieties can be profitable!',
      },
    ],
  },
  {
    id: 'crops',
    title: 'Crop Types',
    icon: '🌻',
    content: [
      {
        question: 'What crops can I grow?',
        answer: 'There are 4 main crops: Tomato (🍅), Blueberry (🫐), Lavender (🌸), and Sunflower (🌻). Each has different growth times, values, and nectar properties.',
      },
      {
        question: 'Tomato (🍅)',
        answer: 'Cost: 10 coins | Fast growing, low nectar production. Great for quick income and beginners. Produces light, mild honey.',
      },
      {
        question: 'Blueberry (🫐)',
        answer: 'Cost: 12 coins | Medium growth, good nectar. Well-rounded crop that produces amber, fruity honey.',
      },
      {
        question: 'Lavender (🌸)',
        answer: 'Cost: 15 coins | Slower growing, specialty nectar. Creates premium floral honey that sells for higher prices.',
      },
      {
        question: 'Sunflower (🌻)',
        answer: 'Cost: 18 coins | Medium growth, high bee attraction. Produces classic golden honey and attracts the most bees.',
      },
    ],
  },
  {
    id: 'experience',
    title: 'XP & Leveling',
    icon: '⭐',
    content: [
      {
        question: 'How do I earn XP?',
        answer: 'Earn XP from: Harvesting crops, First-time harvests (bonus!), Pollination events, Bee classifications, and Selling items.',
      },
      {
        question: 'What do levels unlock?',
        answer: 'Higher levels unlock farm expansions (more plots), new features, and premium upgrades. Check the Experience screen for specific unlock requirements.',
      },
      {
        question: 'How do I see my XP progress?',
        answer: 'Tap your level badge (Lv.X) in the header to see detailed XP breakdown, including total XP, progress to next level, and activity counts.',
      },
      {
        question: 'What are farm expansions?',
        answer: 'At certain levels, you can purchase additional farm pages with 6 new plots each. Navigate between pages using the down arrow (▼) on the main farm.',
      },
    ],
  },
  {
    id: 'shop',
    title: 'Shop & Economy',
    icon: '🛍️',
    content: [
      {
        question: 'How do I access the shop?',
        answer: 'Tap your coin display (🪙) in the header to open the shop. Here you can buy seeds and glass bottles.',
      },
      {
        question: 'How do I earn coins?',
        answer: 'Sell your harvested crops and bottled honey at the shop. Different items have different values - specialty honey and high-tier crops are worth more.',
      },
      {
        question: 'What can I buy?',
        answer: 'Seeds (Tomato, Blueberry, Lavender, Sunflower) and Glass Bottles (needed for storing honey). Prices vary by item rarity.',
      },
      {
        question: 'What are Glass Bottles for?',
        answer: 'Glass bottles are used to bottle honey from your hives. You need bottles in your inventory to collect honey. Each bottle holds a set amount of honey.',
      },
    ],
  },
  {
    id: 'daynight',
    title: 'Day/Night Cycle',
    icon: '🌓',
    content: [
      {
        question: 'How does the day/night cycle work?',
        answer: 'The game follows real time! Daytime is 6 AM - 8 PM with full visibility. Nighttime is 8 PM - 6 AM with darker visuals.',
      },
      {
        question: 'Does nighttime affect gameplay?',
        answer: 'Yes! Honey production happens during specific windows (8 AM - 4 PM and 8 PM - 4 AM). Visual appearance changes but you can still farm at night.',
      },
      {
        question: 'What is Force Daytime mode?',
        answer: 'In Settings, you can enable "Force Daytime" for testing. This makes it always daytime and enables continuous honey production.',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Pro Tips',
    icon: '💡',
    content: [
      {
        question: 'Maximize honey production',
        answer: '1. Keep all plots planted\n2. Water regularly\n3. Harvest promptly\n4. Plant diverse crops for varied honey\n5. Build more hives as you progress',
      },
      {
        question: 'Level up faster',
        answer: '1. Try all crop types for first-harvest bonuses\n2. Classify bees daily (max your limit)\n3. Maintain active pollination\n4. Sell items regularly',
      },
      {
        question: 'Efficient farming',
        answer: '1. Plant crops in batches for easier harvesting\n2. Water right after planting\n3. Check hives during production hours\n4. Keep a seed reserve in inventory',
      },
      {
        question: 'Best crop strategies',
        answer: '• Quick income: Tomatoes (fast growth)\n• Best honey: Sunflowers + Lavender mix\n• Balanced: Blueberries\n• Premium: Lavender for specialty honey',
      },
    ],
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('basics');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const bg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBg = useThemeColor({ light: '#FEF3C7', dark: '#1a1a1a' }, 'background');
  const cardBorder = useThemeColor({ light: '#F59E0B', dark: '#333' }, 'icon');
  const answerBg = useThemeColor({ light: '#FDE68A', dark: '#262626' }, 'background');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleItem = (itemKey: string) => {
    setExpandedItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: tintColor }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>📖 Help & Guide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Intro */}
        <View style={[styles.introCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={styles.introIcon}>🐝</Text>
          <Text style={[styles.introTitle, { color: textColor }]}>Welcome to Bee Garden!</Text>
          <Text style={[styles.introText, { color: textColor }]}>
            Tap any section below to learn about different aspects of the game. 
            Questions expand to show detailed answers.
          </Text>
        </View>

        {/* Sections */}
        {HELP_SECTIONS.map((section) => (
          <View key={section.id} style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={[styles.sectionTitle, { color: textColor }]}>{section.title}</Text>
              <Text style={[styles.expandIcon, { color: tintColor }]}>
                {expandedSection === section.id ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View style={styles.sectionContent}>
                {section.content.map((item, index) => {
                  const itemKey = `${section.id}-${index}`;
                  const isExpanded = expandedItems[itemKey];

                  return (
                    <View key={itemKey} style={styles.helpItem}>
                      <TouchableOpacity
                        style={styles.questionRow}
                        onPress={() => toggleItem(itemKey)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.question, { color: textColor }]}>
                          {item.question}
                        </Text>
                        <Text style={[styles.questionExpand, { color: tintColor }]}>
                          {isExpanded ? '−' : '+'}
                        </Text>
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={[styles.answerContainer, { backgroundColor: answerBg }]}>
                          <Text style={[styles.answer, { color: textColor }]}>
                            {item.answer}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textColor }]}>
            💡 Tip: Access tutorials anytime from Settings!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  introCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  introIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  section: {
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  helpItem: {
    marginBottom: 8,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  questionExpand: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'center',
  },
  answerContainer: {
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  answer: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    opacity: 0.7,
  },
});
