import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { z } from "zod";
import { DidYouKnowContent } from "../../lib/schemas";

type Props = { title: string; content: z.infer<typeof DidYouKnowContent> };

export function DidYouKnowCard({ title, content }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DID YOU KNOW?</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hook}>{content.hook}</Text>

      {revealed ? (
        <>
          <Text style={styles.explanation}>{content.explanation}</Text>
          <Text style={styles.funDetail}>{content.fun_detail}</Text>
        </>
      ) : (
        <TouchableOpacity
          style={styles.revealButton}
          onPress={() => setRevealed(true)}
        >
          <Text style={styles.revealText}>Tap to reveal</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  label: { fontSize: 12, color: "#EC4899", fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 16 },
  hook: { fontSize: 20, color: "#E0E0E0", lineHeight: 30, marginBottom: 24 },
  explanation: { fontSize: 16, color: "#CCC", lineHeight: 26, marginBottom: 12 },
  funDetail: { fontSize: 14, color: "#888", lineHeight: 22, fontStyle: "italic" },
  revealButton: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  revealText: { color: "#EC4899", fontSize: 16, fontWeight: "600" },
});
