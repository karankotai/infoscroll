import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuthStore();

  const handleSignIn = async () => {
    setError(null);
    const { error } = await signIn(email);
    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>InfoScroll</Text>
        <Text style={styles.subtitle}>Learn while you scroll</Text>

        {sent ? (
          <Text style={styles.sent}>Check your email for the magic link!</Text>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Send Magic Link</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 48,
  },
  input: {
    backgroundColor: "#1A1A1A",
    color: "#FFF",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  error: { color: "#EF4444", marginBottom: 12, textAlign: "center" },
  sent: { color: "#10B981", fontSize: 16, textAlign: "center" },
});
