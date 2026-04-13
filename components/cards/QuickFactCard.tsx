import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { QuickFactContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof QuickFactContent>; accentColor: string };

export function QuickFactCard({ title, content, accentColor }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.labelRow}>
        <Text style={styles.icon}>⚡</Text>
        <Text style={[styles.label, { color: accentColor }]}>QUICK FACT</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.factBox, { borderLeftColor: accentColor }]}>
        <Text style={styles.fact}>{content.fact}</Text>
      </View>
      <Text style={styles.context}>{content.context}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  accentBar: { height: 3, width: 40, borderRadius: 2, marginBottom: 20 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  icon: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: "bold", color: "#FFF", marginBottom: 20, lineHeight: 38 },
  factBox: { borderLeftWidth: 3, paddingLeft: 16, paddingVertical: 4, marginBottom: 20 },
  fact: { fontSize: 19, color: "#E8E8E8", lineHeight: 30, fontWeight: "500" },
  context: { fontSize: 15, color: "#777", lineHeight: 24 },
});
