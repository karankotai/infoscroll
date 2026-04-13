import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { z } from "zod";
import { ShortVideoContent } from "../../lib/schemas";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  title: string;
  content: z.infer<typeof ShortVideoContent>;
  accentColor: string;
  isActive: boolean;
};

function getEmbedHtml(videoId: string, autoplay: boolean) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow: hidden; }
        iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
      </style>
    </head>
    <body>
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=1&playsinline=1&controls=1&rel=0&modestbranding=1&showinfo=0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    </body>
    </html>
  `;
}

export function ShortVideoCard({ title, content, accentColor, isActive }: Props) {
  return (
    <View style={styles.container}>
      {/* Full-screen video player */}
      <View style={styles.playerContainer}>
        <WebView
          source={{ html: getEmbedHtml(content.youtube_id, isActive) }}
          style={styles.webview}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          scrollEnabled={false}
          bounces={false}
          allowsFullscreenVideo={true}
        />
      </View>

      {/* Bottom overlay with title + channel */}
      <View style={styles.bottomOverlay}>
        <View style={styles.titleRow}>
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text style={styles.badgeText}>🎬 {content.duration_seconds}s</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
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
  playerContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  titleRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
    lineHeight: 24,
  },
  channelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  channelDot: { width: 6, height: 6, borderRadius: 3 },
  channelName: { fontSize: 13, color: "#CCC", fontWeight: "500" },
});
