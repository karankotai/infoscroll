import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { SummaryContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof SummaryContent> };

export function SummaryCard({ title, content }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SUMMARY</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{content.summary}</Text>
      <View style={styles.pointsList}>
        {content.key_points.map((point, i) => (
          <View key={i} style={styles.pointRow}>
            <Text style={styles.bullet}>{"\u2022"}</Text>
            <Text style={styles.point}>{point}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.source}>From: {content.source_title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  label: { fontSize: 12, color: "#3B82F6", fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 12 },
  summary: { fontSize: 16, color: "#CCC", lineHeight: 26, marginBottom: 16 },
  pointsList: { gap: 8, marginBottom: 16 },
  pointRow: { flexDirection: "row", gap: 8 },
  bullet: { color: "#3B82F6", fontSize: 16 },
  point: { color: "#E0E0E0", fontSize: 15, lineHeight: 22, flex: 1 },
  source: { fontSize: 13, color: "#555", fontStyle: "italic" },
});
