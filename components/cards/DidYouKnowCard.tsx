import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { z } from "zod";
import { DidYouKnowContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof DidYouKnowContent>; accentColor: string };

export function DidYouKnowCard({ title, content, accentColor }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>🤯</Text>
        <Text style={[styles.label, { color: accentColor }]}>DID YOU KNOW?</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hook}>{content.hook}</Text>

      {revealed ? (
        <View style={[styles.revealedBox, { backgroundColor: accentColor + "10", borderColor: accentColor + "30" }]}>
          <Text style={styles.explanation}>{content.explanation}</Text>
          <View style={[styles.funDetailBar, { backgroundColor: accentColor + "20" }]}>
            <Text style={styles.funDetailLabel}>✨ Fun detail</Text>
            <Text style={styles.funDetail}>{content.fun_detail}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.revealButton, { borderColor: accentColor + "50", backgroundColor: accentColor + "10" }]}
          onPress={() => setRevealed(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.revealText, { color: accentColor }]}>Tap to reveal the answer</Text>
          <Text style={styles.revealIcon}>👇</Text>
        </TouchableOpacity>
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
  hook: { fontSize: 21, color: "#E8E8E8", lineHeight: 32, marginBottom: 28, fontWeight: "500" },
  revealedBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  explanation: { fontSize: 16, color: "#D0D0D0", lineHeight: 26, marginBottom: 16 },
  funDetailBar: {
    padding: 12,
    borderRadius: 10,
  },
  funDetailLabel: { fontSize: 12, color: "#AAA", fontWeight: "700", marginBottom: 4 },
  funDetail: { fontSize: 14, color: "#999", lineHeight: 22, fontStyle: "italic" },
  revealButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  revealText: { fontSize: 16, fontWeight: "600" },
  revealIcon: { fontSize: 20 },
});
