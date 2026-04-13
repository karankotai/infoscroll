import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { QuickFactContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof QuickFactContent> };

export function QuickFactCard({ title, content }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>QUICK FACT</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.fact}>{content.fact}</Text>
      <Text style={styles.context}>{content.context}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  label: { fontSize: 12, color: "#8B5CF6", fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFF", marginBottom: 16 },
  fact: { fontSize: 18, color: "#E0E0E0", lineHeight: 28, marginBottom: 16 },
  context: { fontSize: 15, color: "#888", lineHeight: 24 },
});
