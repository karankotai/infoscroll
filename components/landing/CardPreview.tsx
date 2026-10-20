import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "../../lib/types";
import { TOPIC_GRADIENTS } from "../../constants/cardTheme";
import { TOPIC_CONFIG } from "../../constants/topics";
import { CardRenderer } from "../cards/CardRenderer";
import { CardActions } from "../CardActions";
import { TopicPill } from "../TopicPill";

// Rendered with the real card components so the hero shows the actual product
// rather than a mock-up. The moth is the Harvard Mark II log entry from 1947.
const SAMPLE_CARD: Card = {
  id: "3f1a6c2e-1d4b-4a7f-9c3e-7b2d5a8f4e10",
  topic: "tech",
  card_type: "quick_fact",
  title: "The first computer bug was a real insect",
  content: {
    fact: "In 1947 a moth was pulled out of a relay on the Harvard Mark II and taped into the logbook as the first actual case of a bug being found.",
    context:
      "Engineers had used the word for defects for decades. The moth is just the most literal example anyone ever recorded.",
  },
  source: "static",
  source_url: null,
  difficulty: "casual",
  thread_id: null,
  thread_order: null,
  created_at: "2024-01-01T00:00:00.000Z",
};

export function CardPreview() {
  const { width } = useWindowDimensions();
  const frameWidth = Math.min(400, width - 48);

  return (
    <View style={[styles.frame, { width: frameWidth }]} pointerEvents="none">
      <LinearGradient
        colors={TOPIC_GRADIENTS[SAMPLE_CARD.topic]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topicRow}>
          <TopicPill topic={SAMPLE_CARD.topic} />
        </View>

        <CardRenderer
          card={SAMPLE_CARD}
          topicColor={TOPIC_CONFIG[SAMPLE_CARD.topic].color}
          isActive={false}
        />

        <CardActions onSave={() => {}} onSkip={() => {}} isSaved={false} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 620,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    backgroundColor: "#0A0A0A",
    overflow: "hidden",
  },
  card: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 12,
  },
  topicRow: { paddingHorizontal: 28 },
});
