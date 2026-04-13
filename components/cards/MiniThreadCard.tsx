import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { MiniThreadContent } from "../../lib/schemas";

type Props = {
  title: string;
  content: z.infer<typeof MiniThreadContent>;
  threadPosition?: { current: number; total: number };
};

export function MiniThreadCard({ title, content, threadPosition }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>THREAD</Text>
        {threadPosition && (
          <Text style={styles.position}>
            {threadPosition.current}/{threadPosition.total}
          </Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{content.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  label: { fontSize: 12, color: "#F59E0B", fontWeight: "700", letterSpacing: 1.5 },
  position: { fontSize: 14, color: "#F59E0B", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 16 },
  body: { fontSize: 17, color: "#E0E0E0", lineHeight: 28 },
});
