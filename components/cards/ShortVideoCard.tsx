import { View, Text, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { z } from "zod";
import { ShortVideoContent } from "../../lib/schemas";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PLAYER_WIDTH = SCREEN_WIDTH - 56;
const PLAYER_HEIGHT = Math.min(PLAYER_WIDTH * 0.56, 280);

type Props = {
  title: string;
  content: z.infer<typeof ShortVideoContent>;
  accentColor: string;
  isActive: boolean;
};

export function ShortVideoCard({ title, content, accentColor, isActive }: Props) {
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
          height={PLAYER_HEIGHT}
          width={PLAYER_WIDTH}
          play={isActive}
          videoId={content.youtube_id}
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

      <View style={styles.channelRow}>
        <View style={[styles.channelDot, { backgroundColor: accentColor }]} />
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
  channelDot: { width: 8, height: 8, borderRadius: 4 },
  channelName: { fontSize: 15, color: "#BBB", fontWeight: "500" },
});
