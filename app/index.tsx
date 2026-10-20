import { Platform } from "react-native";
import { Redirect } from "expo-router";
import { LandingPage } from "../components/landing/LandingPage";

// Web's root URL is the marketing page. The native apps have no use for it, so
// they go straight into the feed.
export default function Index() {
  if (Platform.OS !== "web") {
    return <Redirect href="/(tabs)/feed" />;
  }

  return <LandingPage />;
}
