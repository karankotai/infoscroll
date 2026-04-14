import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { z } from "zod";
import { ShortVideoContent } from "../../lib/schemas";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  title: string;
  content: z.infer<typeof ShortVideoContent>;
  accentColor: string;
  isActive: boolean;
};

// YouTube IFrame API error codes that indicate embedding is blocked
// 101 & 150: embedding disabled by owner
// 153: player config error (also embed-related)
// 100: video not found/private
const EMBED_BLOCKED_CODES = new Set([100, 101, 150, 153]);

function getPlayerHtml(videoId: string, autoplay: boolean) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
        #player { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="player"></div>
      <script>
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
            videoId: '${videoId}',
            playerVars: {
              autoplay: ${autoplay ? 1 : 0},
              mute: 1,
              playsinline: 1,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              showinfo: 0
            },
            events: {
              onReady: function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ready'}));
              },
              onError: function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', code: e.data}));
              }
            }
          });
        }
      </script>
    </body>
    </html>
  `;
}

export function ShortVideoCard({ title, content, accentColor, isActive }: Props) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const webviewRef = useRef<WebView>(null);

  // Reset fail state when video changes
  useEffect(() => {
    setEmbedFailed(false);
  }, [content.youtube_id]);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "error" && EMBED_BLOCKED_CODES.has(msg.code)) {
        setEmbedFailed(true);
      }
    } catch {
      // ignore
    }
  };

  const openInYoutube = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${content.youtube_id}`);
  };

  // Fallback UI: thumbnail with tap-to-open
  if (embedFailed) {
    const thumbnailUrl = `https://img.youtube.com/vi/${content.youtube_id}/hqdefault.jpg`;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.fallbackContainer} onPress={openInYoutube} activeOpacity={0.9}>
          <Image source={{ uri: thumbnailUrl }} style={styles.fallbackThumbnail} resizeMode="cover" />
          <View style={styles.fallbackDim} />
          <View style={styles.fallbackContent}>
            <View style={[styles.playCircle, { backgroundColor: accentColor }]}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <Text style={styles.fallbackHint}>Tap to watch on YouTube</Text>
          </View>
        </TouchableOpacity>

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

  // Normal: embedded YouTube player
  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <WebView
          ref={webviewRef}
          source={{
            html: getPlayerHtml(content.youtube_id, isActive),
            baseUrl: "https://www.youtube.com",
          }}
          style={styles.webview}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          scrollEnabled={false}
          bounces={false}
          allowsFullscreenVideo={true}
          onMessage={onMessage}
        />
      </View>

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
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackThumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
  },
  fallbackDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  fallbackContent: {
    alignItems: "center",
    gap: 16,
  },
  playCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: { color: "#FFF", fontSize: 32, marginLeft: 4 },
  fallbackHint: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
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
