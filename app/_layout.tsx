import { useEffect } from "react";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "../stores/authStore";

export default function RootLayout() {
  const { session, loading, initialize } = useAuthStore();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    // The marketing page is public, so signed-out visitors are allowed to
    // stay on it instead of being bounced to the login screen.
    const onLandingPage = pathname === "/";

    if (!session && !inAuthGroup && !onLandingPage) {
      router.replace("/(auth)/login");
    } else if (session && (inAuthGroup || onLandingPage)) {
      router.replace("/(tabs)/feed");
    }
  }, [session, loading, segments, pathname]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
