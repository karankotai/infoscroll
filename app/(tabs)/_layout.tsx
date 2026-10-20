import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { AppSidebar } from "../../components/AppSidebar";

// Below this width the browser falls back to the mobile-style bottom tab bar.
const SIDEBAR_BREAKPOINT = 768;

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const showSidebar = Platform.OS === "web" && width >= SIDEBAR_BREAKPOINT;

  return (
    <View style={styles.root}>
      {showSidebar && <AppSidebar />}

      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: showSidebar
              ? styles.hiddenTabBar
              : styles.tabBar,
            tabBarActiveTintColor: "#8B5CF6",
            tabBarInactiveTintColor: "#666",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Feed",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="layers-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="news"
            options={{
              title: "News",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="newspaper-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="saved"
            options={{
              title: "Saved",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bookmark-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: "#0A0A0A" },
  content: { flex: 1 },
  tabBar: {
    backgroundColor: "#0A0A0A",
    borderTopColor: "#1A1A1A",
  },
  hiddenTabBar: { display: "none" },
});
