import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { KeyInsightContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof KeyInsightContent> };

export function KeyInsightCard({ title, content }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>KEY INSIGHT</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.insight}>{content.insight}</Text>
      <View style={styles.divider} />
      <Text style={styles.whyLabel}>Why it matters</Text>
      <Text style={styles.whyText}>{content.why_it_matters}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  label: { fontSize: 12, color: "#10B981", fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 16 },
  insight: { fontSize: 18, color: "#E0E0E0", lineHeight: 28, marginBottom: 20 },
  divider: { height: 1, backgroundColor: "#333", marginBottom: 16 },
  whyLabel: { fontSize: 14, color: "#10B981", fontWeight: "600", marginBottom: 8 },
  whyText: { fontSize: 15, color: "#AAA", lineHeight: 24 },
});
