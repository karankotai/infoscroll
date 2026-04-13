import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Card, Topic } from "../../lib/types";
import { TopicPill } from "../../components/TopicPill";
import { TOPIC_CONFIG } from "../../constants/topics";
import { TOPICS } from "../../lib/schemas";

export default function SavedScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<Topic | "all">("all");
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_card_state")
      .select("card_id, cards(*)")
      .eq("user_id", user.id)
      .eq("status", "saved")
      .order("seen_at", { ascending: false });

    const savedCards = (data ?? [])
      .map((row: any) => row.cards)
      .filter(Boolean) as Card[];

    setCards(savedCards);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSaved();
  }, []);

  const filtered =
    filter === "all" ? cards : cards.filter((c) => c.topic === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved</Text>
      <Text style={styles.count}>{cards.length} cards saved</Text>

      <FlatList
        horizontal
        data={["all" as const, ...TOPICS]}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              filter === item && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === item && styles.filterChipTextActive,
              ]}
            >
              {item === "all" ? "All" : `${TOPIC_CONFIG[item].emoji} ${TOPIC_CONFIG[item].label}`}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.savedCard}>
            <TopicPill topic={item.topic} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardType}>{item.card_type.replace("_", " ").toUpperCase()}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {loading ? "Loading..." : "No saved cards yet. Bookmark cards from the feed!"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", paddingTop: 60 },
  header: { fontSize: 28, fontWeight: "bold", color: "#FFF", paddingHorizontal: 24 },
  count: { fontSize: 14, color: "#666", paddingHorizontal: 24, marginTop: 4, marginBottom: 16 },
  filterBar: { maxHeight: 50, marginBottom: 16 },
  filterBarContent: { paddingHorizontal: 24, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1A1A1A",
  },
  filterChipActive: { backgroundColor: "#8B5CF622", borderColor: "#8B5CF6" },
  filterChipText: { color: "#888", fontSize: 13, fontWeight: "600" },
  filterChipTextActive: { color: "#8B5CF6" },
  cardList: { paddingHorizontal: 24, gap: 12, paddingBottom: 24 },
  savedCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  cardType: { fontSize: 12, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  emptyText: { color: "#666", fontSize: 16, textAlign: "center" },
});
