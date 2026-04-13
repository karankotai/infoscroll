import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { z } from "zod";
import { ShortVideoContent } from "../../lib/schemas";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PLAYER_HEIGHT = SCREEN_HEIGHT - 180;

type Props = {
  title: string;
  content: z.infer<typeof ShortVideoContent>;
  accentColor: string;
  isActive: boolean;
};

export function ShortVideoCard({ title, content, accentColor, isActive }: Props) {
  const [ready, setReady] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  // Delay play slightly after becoming active to let the player initialize
  useEffect(() => {
    if (isActive && ready) {
      const timer = setTimeout(() => setShouldPlay(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShouldPlay(false);
    }
  }, [isActive, ready]);

  return (
    <View style={styles.container}>
      {/* Player fills most of the screen */}
      <View style={[styles.playerWrapper, { borderColor: accentColor + "20" }]}>
        <YoutubePlayer
          height={PLAYER_HEIGHT}
          width={SCREEN_WIDTH}
          play={shouldPlay}
          videoId={content.youtube_id}
          onReady={() => setReady(true)}
          initialPlayerParams={{
            preventFullScreen: false,
            modestbranding: true,
            rel: false,
          }}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
            allowsFullscreenVideo: true,
          }}
        />
      </View>

      {/* Overlay info at bottom */}
      <View style={styles.infoOverlay}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <View style={[styles.durationBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.durationText}>{content.duration_seconds}s</Text>
          </View>
        </View>
        <View style={styles.channelRow}>
          <View style={[styles.channelDot, { backgroundColor: accentColor }]} />
          <Text style={styles.channelName}>{content.channel_name}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  playerWrapper: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  infoOverlay: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  channelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  channelDot: { width: 6, height: 6, borderRadius: 3 },
  channelName: { fontSize: 13, color: "#AAA", fontWeight: "500" },
});
