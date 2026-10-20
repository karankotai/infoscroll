import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";

type Props = {
  label: string;
  size?: "sm" | "lg";
  variant?: "primary" | "outline";
};

export function DemoButton({ label, size = "lg", variant = "primary" }: Props) {
  const signInDemo = useAuthStore((state) => state.signInDemo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = async () => {
    setLoading(true);
    setError(null);

    const result = await signInDemo();

    // On success the root layout sees the new session and redirects to the
    // feed, so the spinner stays up until this component unmounts.
    if (result.error) {
      setError(
        result.error.toLowerCase().includes("anonymous")
          ? "The demo account isn't enabled for this project yet. Use Sign in instead."
          : result.error
      );
      setLoading(false);
    }
  };

  const isPrimary = variant === "primary";

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          size === "lg" ? styles.buttonLg : styles.buttonSm,
          isPrimary ? styles.primary : styles.outline,
          loading && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={isPrimary ? "#FFF" : "#8B5CF6"}
          />
        )}
        <Text
          style={[
            styles.label,
            size === "lg" ? styles.labelLg : styles.labelSm,
            { color: isPrimary ? "#FFF" : "#EDEDED" },
          ]}
        >
          {loading ? "Setting up your demo\u2026" : label}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
  },
  buttonLg: { paddingVertical: 16, paddingHorizontal: 28 },
  buttonSm: { paddingVertical: 10, paddingHorizontal: 18 },
  primary: { backgroundColor: "#8B5CF6" },
  outline: { borderWidth: 1, borderColor: "#2E2E2E" },
  buttonDisabled: { opacity: 0.7 },
  label: { fontWeight: "600", textAlign: "center" },
  labelLg: { fontSize: 16 },
  labelSm: { fontSize: 14 },
  error: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
    maxWidth: 420,
    lineHeight: 19,
  },
});
