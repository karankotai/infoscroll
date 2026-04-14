import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useFeedStore } from "../../stores/feedStore";
import { FeedSwiper } from "../../components/FeedSwiper";

export default function FeedScreen() {
  const {
    mode,
    cards,
    videos,
    loading,
    error,
    setMode,
    fetchFeed,
    markSeen,
    markSaved,
    markSkipped,
    setCurrentIndex,
  } = useFeedStore();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFeed();
  }, [mode]);

  const currentList = mode === "videos" ? videos : cards;

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
    const card = currentList[index];
    if (card) markSeen(card.id);
  };

  const handleSave = (cardId: string) => {
    markSaved(cardId);
    setSavedIds((prev) => new Set(prev).add(cardId));
  };

  const handleSkip = (cardId: string) => {
    markSkipped(cardId);
  };

  const ModeToggle = () => (
    <View style={styles.toggleContainer} pointerEvents="box-none">
      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === "cards" && styles.toggleButtonActive]}
          onPress={() => setMode("cards")}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, mode === "cards" && styles.toggleTextActive]}>
            Cards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === "videos" && styles.toggleButtonActive]}
          onPress={() => setMode("videos")}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, mode === "videos" && styles.toggleTextActive]}>
            Shorts
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const bgColor = mode === "videos" ? "#000" : "#0A0A0A";

  if (loading && currentList.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <ModeToggle />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>
            Loading {mode === "videos" ? "shorts" : "cards"}...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <ModeToggle />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (currentList.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <ModeToggle />
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            {mode === "videos" ? "No more shorts!" : "No cards yet."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FeedSwiper
        cards={currentList}
        onIndexChange={handleIndexChange}
        onSave={handleSave}
        onSkip={handleSkip}
        savedCardIds={savedIds}
      />
      <ModeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toggleContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  toggleBar: {
    flexDirection: "row",
    backgroundColor: "rgba(20,20,20,0.85)",
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: "#8B5CF6",
  },
  toggleText: { color: "#888", fontSize: 15, fontWeight: "600" },
  toggleTextActive: { color: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { color: "#888", marginTop: 16, fontSize: 16 },
  errorText: { color: "#EF4444", fontSize: 16, textAlign: "center" },
  emptyText: { color: "#888", fontSize: 16, textAlign: "center" },
});
