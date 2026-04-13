import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onSave: () => void;
  onSkip: () => void;
  isSaved: boolean;
};

export function CardActions({ onSave, onSkip, isSaved }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onSkip}>
        <Ionicons name="close-circle-outline" size={28} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={28}
          color={isSaved ? "#8B5CF6" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    paddingVertical: 16,
  },
  button: { padding: 8 },
});
