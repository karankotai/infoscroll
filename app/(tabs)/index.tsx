import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useFeedStore } from "../../stores/feedStore";
import { FeedSwiper } from "../../components/FeedSwiper";

export default function FeedScreen() {
  const { cards, loading, error, fetchFeed, markSeen, markSaved, markSkipped, setCurrentIndex } =
    useFeedStore();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
    const card = cards[index];
    if (card) markSeen(card.id);
  };

  const handleSave = (cardId: string) => {
    markSaved(cardId);
    setSavedIds((prev) => new Set(prev).add(cardId));
  };

  const handleSkip = (cardId: string) => {
    markSkipped(cardId);
  };

  if (loading && cards.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading your feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No cards yet. Run the content pipeline first!</Text>
      </View>
    );
  }

  return (
    <FeedSwiper
      cards={cards}
      onIndexChange={handleIndexChange}
      onSave={handleSave}
      onSkip={handleSkip}
      savedCardIds={savedIds}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { color: "#888", marginTop: 16, fontSize: 16 },
  errorText: { color: "#EF4444", fontSize: 16, textAlign: "center" },
  emptyText: { color: "#888", fontSize: 16, textAlign: "center" },
});
