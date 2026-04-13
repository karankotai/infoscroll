import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { z } from "zod";
import { ShortVideoContent } from "../../lib/schemas";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PLAYER_WIDTH = SCREEN_WIDTH - 56;
const PLAYER_HEIGHT = PLAYER_WIDTH * (16 / 9);

type Props = { title: string; content: z.infer<typeof ShortVideoContent>; accentColor: string };

export function ShortVideoCard({ title, content, accentColor }: Props) {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>🎬</Text>
        <Text style={[styles.label, { color: accentColor }]}>SHORT VIDEO</Text>
        <View style={[styles.durationBadge, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
          <Text style={[styles.durationText, { color: accentColor }]}>
            {content.duration_seconds}s
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={[styles.playerWrapper, { borderColor: accentColor + "30" }]}>
        <YoutubePlayer
          height={PLAYER_HEIGHT > 400 ? 400 : PLAYER_HEIGHT}
          width={PLAYER_WIDTH}
          play={playing}
          videoId={content.youtube_id}
          onChangeState={onStateChange}
          webViewProps={{
            allowsInlineMediaPlayback: true,
          }}
        />
      </View>

      <View style={styles.channelRow}>
        <Text style={styles.channelLabel}>Channel</Text>
        <Text style={styles.channelName}>{content.channel_name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  icon: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: "auto",
  },
  durationText: { fontSize: 11, fontWeight: "700" },
  title: { fontSize: 22, fontWeight: "bold", color: "#FFF", marginBottom: 16, lineHeight: 30 },
  playerWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 16,
    backgroundColor: "#111",
  },
  channelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  channelLabel: { fontSize: 12, color: "#555", fontWeight: "600" },
  channelName: { fontSize: 14, color: "#AAA", fontWeight: "500" },
});
