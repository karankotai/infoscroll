import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DemoButton } from "./DemoButton";
import { CardPreview } from "./CardPreview";
import { TOPICS } from "../../lib/schemas";
import { CardType } from "../../lib/types";
import { TOPIC_CONFIG } from "../../constants/topics";
import { CARD_TYPE_ACCENT } from "../../constants/cardTheme";

const PAGE_MAX_WIDTH = 1120;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const CARD_FORMATS: {
  type: CardType;
  label: string;
  icon: IoniconName;
  blurb: string;
}[] = [
  {
    type: "quick_fact",
    label: "Quick Fact",
    icon: "flash-outline",
    blurb: "One sharp fact, plus the context that makes it stick.",
  },
  {
    type: "summary",
    label: "Summary",
    icon: "list-outline",
    blurb: "A dense idea reduced to the handful of points worth keeping.",
  },
  {
    type: "mini_thread",
    label: "Mini Thread",
    icon: "chatbubbles-outline",
    blurb: "A short threaded explainer you can read in a few taps.",
  },
  {
    type: "key_insight",
    label: "Key Insight",
    icon: "bulb-outline",
    blurb: "The takeaway itself, and why it actually matters.",
  },
  {
    type: "did_you_know",
    label: "Did You Know",
    icon: "help-circle-outline",
    blurb: "A hook, the explanation, and a detail worth repeating.",
  },
  {
    type: "short_video",
    label: "Short Video",
    icon: "play-circle-outline",
    blurb: "A two-minute clip for when reading is the wrong format.",
  },
];

const STEPS = [
  {
    title: "Scroll the feed",
    body: "Cards arrive one at a time, one idea each. No endless wall of noise to wade through.",
  },
  {
    title: "Skip or save",
    body: "Skip what you already know. Bookmark what you want to find again later.",
  },
  {
    title: "Pull the news",
    body: "The News tab turns current coverage on any topic into the same card format, on demand.",
  },
];

export function LandingPage() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.rootContent}
    >
      <View style={styles.nav}>
        <View style={styles.navInner}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>IS</Text>
            </View>
            <Text style={styles.brandName}>InfoScroll</Text>
          </View>

          <View style={styles.navActions}>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              accessibilityRole="link"
            >
              <Text style={styles.navLink}>Sign in</Text>
            </TouchableOpacity>
            <DemoButton label="Try it out" size="sm" />
          </View>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroInner}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>LEARN WHILE YOU SCROLL</Text>
            <Text style={styles.h1}>
              Your feed, but you actually learn something.
            </Text>
            <Text style={styles.lede}>
              InfoScroll turns the scrolling you already do into short,
              card-sized lessons. Eight topics, six card formats, and nothing to
              sign up for.
            </Text>

            <View style={styles.ctaRow}>
              <DemoButton label="Try it out — no signup" />
            </View>

            <Text style={styles.ctaNote}>
              Opens a temporary account. No email, no password.
            </Text>
          </View>

          <View style={styles.heroVisual}>
            <CardPreview />
          </View>
        </View>
      </View>

      <View style={styles.band}>
        <View style={styles.container}>
          <Text style={styles.bandLabel}>Topics on the feed</Text>
          <View style={styles.chipRow}>
            {TOPICS.map((topic) => (
              <View
                key={topic}
                style={[
                  styles.chip,
                  {
                    borderColor: TOPIC_CONFIG[topic].color + "40",
                    backgroundColor: TOPIC_CONFIG[topic].color + "12",
                  },
                ]}
              >
                <View
                  style={[
                    styles.chipDot,
                    { backgroundColor: TOPIC_CONFIG[topic].color },
                  ]}
                />
                <Text style={styles.chipText}>{TOPIC_CONFIG[topic].label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>
            Six formats, so it never reads like a textbook
          </Text>
          <Text style={styles.sectionLede}>
            Every card is built from one of six structures. The format follows
            the idea instead of forcing everything into the same template.
          </Text>

          <View style={styles.grid}>
            {CARD_FORMATS.map((format) => {
              const accent = CARD_TYPE_ACCENT[format.type];
              return (
                <View key={format.type} style={styles.gridCell}>
                  <View
                    style={[
                      styles.iconTile,
                      {
                        borderColor: accent + "40",
                        backgroundColor: accent + "14",
                      },
                    ]}
                  >
                    <Ionicons name={format.icon} size={22} color={accent} />
                  </View>
                  <Text style={styles.gridTitle}>{format.label}</Text>
                  <Text style={styles.gridBody}>{format.blurb}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.band}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>How it works</Text>

          <View style={styles.grid}>
            {STEPS.map((step, index) => (
              <View key={step.title} style={styles.gridCell}>
                <Text style={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.gridTitle}>{step.title}</Text>
                <Text style={styles.gridBody}>{step.body}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.container}>
          <View style={styles.newsPanel}>
            <View style={styles.newsIcon}>
              <Ionicons name="newspaper-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Not just evergreen material</Text>
            <Text style={styles.sectionLede}>
              The News tab pulls current coverage for whichever topic you pick —
              AI/ML, space, economics, politics — and runs it through the same
              card format. Pull to refresh whenever you want the latest.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.finalCta}>
        <View style={styles.container}>
          <Text style={styles.finalTitle}>Start with the demo</Text>
          <Text style={styles.finalBody}>
            You will land straight in the feed with your own temporary account.
            Save a few cards and see whether the format works for you.
          </Text>
          <View style={styles.ctaRow}>
            <DemoButton label="Try it out — no signup" />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>IS</Text>
            </View>
            <Text style={styles.brandName}>InfoScroll</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            accessibilityRole="link"
          >
            <Text style={styles.navLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A0A" },
  rootContent: { flexGrow: 1 },

  container: {
    width: "100%",
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 24,
  },

  nav: {
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    backgroundColor: "#0A0A0A",
  },
  navInner: {
    width: "100%",
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  brandName: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  navActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  navLink: { color: "#B4B4B4", fontSize: 14, fontWeight: "600" },

  hero: { paddingVertical: 72 },
  heroInner: {
    width: "100%",
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 48,
  },
  heroCopy: { flexGrow: 1, flexBasis: 380, gap: 20 },
  heroVisual: { flexGrow: 1, flexBasis: 360, alignItems: "center" },
  eyebrow: {
    color: "#8B5CF6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
  },
  h1: {
    color: "#FFF",
    fontSize: 46,
    lineHeight: 54,
    fontWeight: "800",
    letterSpacing: -1,
  },
  lede: { color: "#9A9A9A", fontSize: 17, lineHeight: 28, maxWidth: 520 },
  ctaRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  ctaNote: { color: "#6E6E6E", fontSize: 13 },

  band: {
    backgroundColor: "#0D0D0D",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1A1A1A",
    paddingVertical: 56,
  },
  bandLabel: {
    color: "#6E6E6E",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 20,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipDot: { width: 7, height: 7, borderRadius: 4 },
  chipText: { color: "#DDD", fontSize: 13, fontWeight: "600" },

  section: { paddingVertical: 72 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  sectionLede: {
    color: "#9A9A9A",
    fontSize: 16,
    lineHeight: 26,
    marginTop: 14,
    maxWidth: 640,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 40,
  },
  gridCell: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: "#0E0E0E",
    borderWidth: 1,
    borderColor: "#1C1C1C",
    borderRadius: 16,
    padding: 22,
    gap: 10,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepNumber: {
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  gridTitle: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  gridBody: { color: "#8F8F8F", fontSize: 14, lineHeight: 22 },

  newsPanel: {
    backgroundColor: "#0E0E0E",
    borderWidth: 1,
    borderColor: "#1C1C1C",
    borderRadius: 18,
    padding: 32,
  },
  newsIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(139,92,246,0.14)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.32)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  finalCta: {
    paddingVertical: 72,
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    backgroundColor: "#0D0D0D",
  },
  finalTitle: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  finalBody: {
    color: "#9A9A9A",
    fontSize: 16,
    lineHeight: 26,
    marginTop: 14,
    marginBottom: 28,
    maxWidth: 560,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    paddingVertical: 28,
  },
  footerInner: {
    width: "100%",
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
