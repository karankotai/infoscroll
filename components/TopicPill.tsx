import { View, Text, StyleSheet } from "react-native";
import { TOPIC_CONFIG } from "../constants/topics";
import { Topic } from "../lib/types";

type Props = { topic: Topic };

export function TopicPill({ topic }: Props) {
  const config = TOPIC_CONFIG[topic];
  return (
    <View style={[styles.pill, { backgroundColor: config.color + "22" }]}>
      <Text style={[styles.text, { color: config.color }]}>
        {config.emoji} {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: "flex-start" },
  text: { fontSize: 13, fontWeight: "600" },
});
