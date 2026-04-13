import { View, Text, ScrollView, StyleSheet } from "react-native";
import { z } from "zod";
import { KeyInsightContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof KeyInsightContent>; accentColor: string; topicColor: string };

export function KeyInsightCard({ title, content, accentColor, topicColor }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>💡</Text>
        <Text style={[styles.label, { color: accentColor }]}>KEY INSIGHT</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.insight}>{content.insight}</Text>

      <View style={[styles.whyBox, { backgroundColor: accentColor + "12", borderColor: accentColor + "30" }]}>
        <View style={styles.whyHeader}>
          <View style={[styles.whyDot, { backgroundColor: accentColor }]} />
          <Text style={[styles.whyLabel, { color: accentColor }]}>Why it matters</Text>
        </View>
        <Text style={styles.whyText}>{content.why_it_matters}</Text>
      </View>

      {content.related_topic && (
        <View style={[styles.relatedBadge, { borderColor: topicColor + "40" }]}>
          <Text style={[styles.relatedText, { color: topicColor }]}>
            Related: {content.related_topic}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28 },
  contentContainer: { justifyContent: "center", flexGrow: 1 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  icon: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { fontSize: 26, fontWeight: "bold", color: "#FFF", marginBottom: 16, lineHeight: 34 },
  insight: { fontSize: 18, color: "#E0E0E0", lineHeight: 30, marginBottom: 24 },
  whyBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  whyHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  whyDot: { width: 8, height: 8, borderRadius: 4 },
  whyLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
  whyText: { fontSize: 15, color: "#B0B0B0", lineHeight: 24 },
  relatedBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  relatedText: { fontSize: 12, fontWeight: "600" },
});
