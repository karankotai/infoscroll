import { View, Text, StyleSheet } from "react-native";
import { TOPIC_CONFIG } from "../constants/topics";
import { Topic } from "../lib/types";

type Props = { topic: Topic };

export function TopicPill({ topic }: Props) {
  const config = TOPIC_CONFIG[topic];
  return (
    <View style={[styles.pill, { backgroundColor: config.color + "18", borderColor: config.color + "35" }]}>
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
  },
  emoji: { fontSize: 14 },
  text: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
});
