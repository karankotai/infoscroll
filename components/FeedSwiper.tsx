import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "../lib/types";
import { CardRenderer } from "./cards/CardRenderer";
import { CardActions } from "./CardActions";
import { TopicPill } from "./TopicPill";
import { TOPIC_GRADIENTS } from "../constants/cardTheme";
import { TOPIC_CONFIG } from "../constants/topics";

const isWeb = Platform.OS === "web";

// On desktop the feed is a centred column instead of a full-bleed phone screen.
const CARD_MAX_WIDTH = 460;

type Props = {
  cards: Card[];
  onIndexChange: (index: number) => void;
  onSave: (cardId: string) => void;
  onSkip: (cardId: string) => void;
  savedCardIds: Set<string>;
};

export function FeedSwiper({ cards, onIndexChange, onSave, onSkip, savedCardIds }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);

  // One page equals the height of the scroll container, so the geometry stays
  // correct when the browser window is resized.
  const handleLayout = useCallback((event: any) => {
    const height = Math.round(event.nativeEvent.layout.height);
    setCardHeight((prev) => (height > 0 && height !== prev ? height : prev));
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= cards.length) return;
      currentIndex.current = index;
      setActiveIndex(index);
      onIndexChange(index);
      scrollRef.current?.scrollTo({ y: index * cardHeight, animated: true });
    },
    [cards.length, cardHeight, onIndexChange]
  );

  // react-native-web never fires onMomentumScrollEnd, so the settled page is
  // derived from the offset on every scroll event instead.
  const handleScroll = useCallback(
    (event: any) => {
      if (cardHeight <= 0) return;
      const next = Math.round(event.nativeEvent.contentOffset.y / cardHeight);
      if (next !== currentIndex.current && next >= 0 && next < cards.length) {
        currentIndex.current = next;
        setActiveIndex(next);
        onIndexChange(next);
      }
    },
    [cardHeight, cards.length, onIndexChange]
  );

  useEffect(() => {
    if (!isWeb) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
        case "j":
          event.preventDefault();
          goToIndex(currentIndex.current + 1);
          break;
        case "ArrowUp":
        case "PageUp":
        case "k":
          event.preventDefault();
          goToIndex(currentIndex.current - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToIndex]);

  const getThreadPosition = (card: Card) => {
    if (!card.thread_id) return undefined;
    const threadCards = cards.filter((c) => c.thread_id === card.thread_id);
    const current = threadCards.findIndex((c) => c.id === card.id) + 1;
    return { current, total: threadCards.length };
  };

  return (
    <View style={[styles.root, isWeb && styles.rootWeb]} onLayout={handleLayout}>
      {cardHeight > 0 && (
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardHeight}
          snapToAlignment="start"
          style={styles.scroller}
        >
          {cards.map((card, index) => {
            const gradient = TOPIC_GRADIENTS[card.topic];
            const topicColor = TOPIC_CONFIG[card.topic].color;
            const isVideo = card.card_type === "short_video";
            const isActive = index === activeIndex;

            // Video cards get a clean full-screen layout
            if (isVideo) {
              return (
                <View key={card.id} style={[styles.slot, { height: cardHeight }, isWeb && styles.slotWeb]}>
                  <View style={[styles.frame, isWeb && styles.frameWeb, styles.videoFrame]}>
                    <CardRenderer
                      card={card}
                      topicColor={topicColor}
                      isActive={isActive}
                    />
                  </View>
                </View>
              );
            }

            // Regular cards get gradient + topic pill + actions
            return (
              <View key={card.id} style={[styles.slot, { height: cardHeight }, isWeb && styles.slotWeb]}>
                <LinearGradient
                  colors={gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.frame,
                    styles.card,
                    isWeb && styles.frameWeb,
                    isWeb && styles.cardWeb,
                  ]}
                >
                  <View style={styles.topicRow}>
                    <TopicPill topic={card.topic} />
                  </View>
                  <CardRenderer
                    card={card}
                    threadPosition={getThreadPosition(card)}
                    topicColor={topicColor}
                    isActive={isActive}
                  />
                  <CardActions
                    onSave={() => onSave(card.id)}
                    onSkip={() => onSkip(card.id)}
                    isSaved={savedCardIds.has(card.id)}
                  />
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A0A" },
  rootWeb: { backgroundColor: "#050505" },
  scroller: { flex: 1 },
  slot: { alignItems: "center", justifyContent: "center" },
  slotWeb: { paddingHorizontal: 16, paddingVertical: 20 },
  frame: { flex: 1, width: "100%" },
  frameWeb: {
    maxWidth: CARD_MAX_WIDTH,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  card: { justifyContent: "space-between", paddingTop: 120, paddingBottom: 100 },
  cardWeb: { paddingTop: 92, paddingBottom: 72 },
  videoFrame: { backgroundColor: "#000" },
  topicRow: { paddingHorizontal: 28 },
});
