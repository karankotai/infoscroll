import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import { z } from "zod";
import { ShortVideoContent } from "../../lib/schemas";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  title: string;
  content: z.infer<typeof ShortVideoContent>;
  accentColor: string;
  isActive: boolean;
};

export function ShortVideoCard({ title, content, accentColor }: Props) {
  const thumbnailUrl = `https://img.youtube.com/vi/${content.youtube_id}/hqdefault.jpg`;

  const openInYoutube = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${content.youtube_id}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tapArea} onPress={openInYoutube} activeOpacity={0.92}>
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.dim} />
        <View style={styles.playButtonContainer}>
          <View style={[styles.playCircle, { backgroundColor: accentColor }]}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.bottomOverlay}>
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text style={styles.badgeText}>🎬 {content.duration_seconds}s</Text>
          </View>
          <View style={styles.youtubeBadge}>
            <Text style={styles.youtubeIcon}>▶</Text>
            <Text style={styles.youtubeText}>YouTube</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={3}>{title}</Text>
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
  tapArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  playButtonContainer: {
    alignItems: "center",
    gap: 14,
  },
  playCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  playIcon: { color: "#FFF", fontSize: 36, marginLeft: 5 },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  youtubeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  youtubeIcon: { color: "#FF0000", fontSize: 11 },
  youtubeText: { color: "#FFF", fontSize: 11, fontWeight: "600" },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
    lineHeight: 26,
  },
  channelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  channelDot: { width: 6, height: 6, borderRadius: 3 },
  channelName: { fontSize: 13, color: "#CCC", fontWeight: "500" },
});
