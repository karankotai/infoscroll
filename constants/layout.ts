import { Platform } from "react-native";

// iOS/Android reserve space for the status bar; the browser does not.
export const SCREEN_TOP_PADDING = Platform.OS === "web" ? 32 : 60;

// Wide browser windows keep content in a readable centred column.
export const CONTENT_MAX_WIDTH = 640;
export const AUTH_MAX_WIDTH = 400;
