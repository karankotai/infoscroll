import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { TOPIC_CONFIG } from "../../constants/topics";
import { Topic } from "../../lib/types";
import { TOPICS } from "../../lib/schemas";

type NewsCard = {
  topic: string;
  card_type: string;
  title: string;
  content: { fact: string; context: string };
  source: string;
  difficulty: string;
};

export default function NewsScreen() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("ai_ml");
  const [cards, setCards] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setError(null);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError("Not authenticated");
      return;
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/fetch-news?topic=${selectedTopic}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const result = await response.json();
    if (result.error) {
      setError(result.error);
      return;
    }

    setCards(result.cards ?? []);
  }, [selectedTopic]);

  useEffect(() => {
    setLoading(true);
    fetchNews().finally(() => setLoading(false));
  }, [selectedTopic]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  }, [fetchNews]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live News</Text>

      <FlatList
        horizontal
        data={[...TOPICS]}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.topicBar}
        contentContainerStyle={styles.topicBarContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedTopic(item)}
            style={[
              styles.topicChip,
              selectedTopic === item && {
                backgroundColor: TOPIC_CONFIG[item].color + "33",
                borderColor: TOPIC_CONFIG[item].color,
              },
            ]}
          >
            <Text
              style={[
                styles.topicChipText,
                selectedTopic === item && { color: TOPIC_CONFIG[item].color },
              ]}
            >
              {TOPIC_CONFIG[item].emoji} {TOPIC_CONFIG[item].label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.cardList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.newsCard}>
              <View style={styles.liveTag}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardFact}>{item.content.fact}</Text>
              <Text style={styles.cardContext}>{item.content.context}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No news available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", paddingTop: 60 },
  header: { fontSize: 28, fontWeight: "bold", color: "#FFF", paddingHorizontal: 24, marginBottom: 16 },
  topicBar: { maxHeight: 50, marginBottom: 16 },
  topicBarContent: { paddingHorizontal: 24, gap: 8 },
  topicChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1A1A1A",
  },
  topicChipText: { color: "#888", fontSize: 13, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#EF4444", fontSize: 16 },
  emptyText: { color: "#666", fontSize: 16 },
  cardList: { paddingHorizontal: 24, gap: 16, paddingBottom: 24 },
  newsCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#252525",
  },
  liveTag: {
    backgroundColor: "#EF444422",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  liveText: { color: "#EF4444", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF", marginBottom: 8 },
  cardFact: { fontSize: 15, color: "#CCC", lineHeight: 24, marginBottom: 8 },
  cardContext: { fontSize: 14, color: "#888", lineHeight: 22 },
});
