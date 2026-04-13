import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { MiniThreadContent } from "../../lib/schemas";

type Props = {
  title: string;
  content: z.infer<typeof MiniThreadContent>;
  threadPosition?: { current: number; total: number };
  accentColor: string;
};

export function MiniThreadCard({ title, content, threadPosition, accentColor }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Text style={styles.icon}>🧵</Text>
          <Text style={[styles.label, { color: accentColor }]}>THREAD</Text>
        </View>
        {threadPosition && (
          <View style={[styles.positionBadge, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
            <Text style={[styles.positionText, { color: accentColor }]}>
              {threadPosition.current} of {threadPosition.total}
            </Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      {threadPosition && (
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: accentColor,
                width: `${(threadPosition.current / threadPosition.total) * 100}%`,
              },
            ]}
          />
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{content.body}</Text>

      {threadPosition && threadPosition.current < threadPosition.total && (
        <View style={styles.continueHint}>
          <Text style={[styles.continueText, { color: accentColor }]}>Swipe up to continue ↑</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  positionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  positionText: { fontSize: 12, fontWeight: "700" },
  progressBarBg: {
    height: 3,
    backgroundColor: "#222",
    borderRadius: 2,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  title: { fontSize: 26, fontWeight: "bold", color: "#FFF", marginBottom: 20, lineHeight: 34 },
  body: { fontSize: 18, color: "#E0E0E0", lineHeight: 30 },
  continueHint: { marginTop: 24, alignItems: "center" },
  continueText: { fontSize: 14, fontWeight: "600" },
});
