import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const SIDEBAR_WIDTH = 84;

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: "layers-outline", iconActive: "layers" },
  { href: "/news", label: "News", icon: "newspaper-outline", iconActive: "newspaper" },
  { href: "/saved", label: "Saved", icon: "bookmark-outline", iconActive: "bookmark" },
  { href: "/settings", label: "Settings", icon: "settings-outline", iconActive: "settings" },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.rail}>
      <View style={styles.brand}>
        <Text style={styles.brandMark}>IS</Text>
      </View>

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const tint = active ? "#8B5CF6" : "#6B6B6B";

          return (
            <TouchableOpacity
              key={item.href}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => router.push(item.href)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
            >
              <Ionicons
                name={active ? item.iconActive : item.icon}
                size={22}
                color={tint}
              />
              <Text style={[styles.itemLabel, { color: tint }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: SIDEBAR_WIDTH,
    backgroundColor: "#070707",
    borderRightWidth: 1,
    borderRightColor: "#161616",
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  brand: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  brandMark: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  nav: { gap: 8, width: "100%", paddingHorizontal: 8 },
  item: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    gap: 5,
  },
  itemActive: { backgroundColor: "rgba(139,92,246,0.12)" },
  itemLabel: { fontSize: 11, fontWeight: "600" },
});
