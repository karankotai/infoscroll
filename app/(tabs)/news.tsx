import { View, Text, StyleSheet } from "react-native";

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>News — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center" },
  text: { color: "#FFF", fontSize: 18 },
});
