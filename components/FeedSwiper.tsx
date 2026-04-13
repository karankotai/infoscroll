import { useCallback, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Card } from "../lib/types";
import { CardRenderer } from "./cards/CardRenderer";
import { CardActions } from "./CardActions";
import { TopicPill } from "./TopicPill";
import { TOPIC_GRADIENTS } from "../constants/cardTheme";
import { TOPIC_CONFIG } from "../constants/topics";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT;

type Props = {
  cards: Card[];
  onIndexChange: (index: number) => void;
  onSave: (cardId: string) => void;
  onSkip: (cardId: string) => void;
  savedCardIds: Set<string>;
};

export function FeedSwiper({ cards, onIndexChange, onSave, onSkip, savedCardIds }: Props) {
  const scrollY = useSharedValue(0);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onMomentumEnd = useCallback(
    (event: any) => {
      const newIndex = Math.round(
        event.nativeEvent.contentOffset.y / CARD_HEIGHT
      );
      if (newIndex !== currentIndex.current && newIndex >= 0 && newIndex < cards.length) {
        currentIndex.current = newIndex;
        setActiveIndex(newIndex);
        onIndexChange(newIndex);
      }
    },
    [cards.length, onIndexChange]
  );

  const getThreadPosition = (card: Card, _index: number) => {
    if (!card.thread_id) return undefined;
    const threadCards = cards.filter((c) => c.thread_id === card.thread_id);
    const current = threadCards.findIndex((c) => c.id === card.id) + 1;
    return { current, total: threadCards.length };
  };

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      onMomentumScrollEnd={onMomentumEnd}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_HEIGHT}
      snapToAlignment="start"
      style={styles.container}
    >
      {cards.map((card, index) => {
        const gradient = TOPIC_GRADIENTS[card.topic];
        const topicColor = TOPIC_CONFIG[card.topic].color;
        const isVideo = card.card_type === "short_video";
        const isActive = index === activeIndex;

        // Video cards get a clean full-screen layout
        if (isVideo) {
          return (
            <View key={card.id} style={[styles.videoCard, { height: CARD_HEIGHT }]}>
              <CardRenderer
                card={card}
                topicColor={topicColor}
                isActive={isActive}
              />
            </View>
          );
        }

        // Regular cards get gradient + topic pill + actions
        return (
          <LinearGradient
            key={card.id}
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { height: CARD_HEIGHT }]}
          >
            <View style={styles.topicRow}>
              <TopicPill topic={card.topic} />
            </View>
            <CardRenderer
              card={card}
              threadPosition={getThreadPosition(card, index)}
              topicColor={topicColor}
              isActive={isActive}
            />
            <CardActions
              onSave={() => onSave(card.id)}
              onSkip={() => onSkip(card.id)}
              isSaved={savedCardIds.has(card.id)}
            />
          </LinearGradient>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  card: { justifyContent: "space-between", paddingTop: 60, paddingBottom: 100 },
  videoCard: { backgroundColor: "#000" },
  topicRow: { paddingHorizontal: 28 },
});
