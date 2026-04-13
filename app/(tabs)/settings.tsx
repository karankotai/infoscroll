import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/authStore";

export default function SettingsScreen() {
  const { signOut, session } = useAuthStore();

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "This will mark all cards as unseen so they appear in your feed again. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
              .from("user_card_state")
              .delete()
              .eq("user_id", user.id)
              .eq("status", "seen");

            Alert.alert("Done", "Your seen history has been cleared.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.email}>{session?.user?.email ?? "Not logged in"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feed</Text>
        <TouchableOpacity style={styles.button} onPress={handleClearHistory}>
          <Text style={styles.buttonText}>Clear Seen History</Text>
          <Text style={styles.buttonHint}>Re-surface all cards in your feed</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={signOut}
        >
          <Text style={styles.dangerText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>InfoScroll v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", paddingTop: 60, paddingHorizontal: 24 },
  header: { fontSize: 28, fontWeight: "bold", color: "#FFF", marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, color: "#666", fontWeight: "600", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  email: { fontSize: 16, color: "#CCC" },
  button: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "500" },
  buttonHint: { color: "#666", fontSize: 13, marginTop: 4 },
  dangerButton: { alignItems: "center" },
  dangerText: { color: "#EF4444", fontSize: 16, fontWeight: "600" },
  version: { color: "#333", fontSize: 13, textAlign: "center", marginTop: "auto", marginBottom: 24 },
});
