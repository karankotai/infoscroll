import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { SummaryContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof SummaryContent>; accentColor: string };

export function SummaryCard({ title, content, accentColor }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>📋</Text>
        <Text style={[styles.label, { color: accentColor }]}>SUMMARY</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.summaryBox, { backgroundColor: accentColor + "10", borderColor: accentColor + "30" }]}>
        <Text style={styles.summary}>{content.summary}</Text>
      </View>
      <View style={styles.pointsList}>
        {content.key_points.map((point, i) => (
          <View key={i} style={styles.pointRow}>
            <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
            <Text style={styles.point}>{point}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.sourceBadge, { borderColor: accentColor + "40" }]}>
        <Text style={[styles.sourceLabel, { color: accentColor }]}>SOURCE</Text>
        <Text style={styles.sourceText}>{content.source_title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  icon: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { fontSize: 26, fontWeight: "bold", color: "#FFF", marginBottom: 16, lineHeight: 34 },
  summaryBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  summary: { fontSize: 16, color: "#D0D0D0", lineHeight: 26 },
  pointsList: { gap: 12, marginBottom: 20 },
  pointRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  bulletDot: { width: 8, height: 8, borderRadius: 4, marginTop: 7 },
  point: { color: "#E0E0E0", fontSize: 15, lineHeight: 22, flex: 1 },
  sourceBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  sourceLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 2 },
  sourceText: { fontSize: 13, color: "#999" },
});
