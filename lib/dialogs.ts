import { Alert, Platform } from "react-native";

/**
 * react-native-web renders `Alert.alert()` as a no-op, so anything routed
 * through it silently does nothing in the browser. These helpers fall back to
 * the native browser dialogs on web and keep using Alert on iOS/Android.
 */

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

export function confirm({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  destructive = false,
}: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelLabel, style: "cancel", onPress: () => resolve(false) },
      {
        text: confirmLabel,
        style: destructive ? "destructive" : "default",
        onPress: () => resolve(true),
      },
    ]);
  });
}

export function notify(title: string, message?: string): void {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }

  Alert.alert(title, message);
}
