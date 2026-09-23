import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useIoT } from "../../context/IoTContext";

export default function SensorsScreen() {
  const { sensors, loading, refreshSensors } = useIoT();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sensors</Text>
      <Text style={styles.subtitle}>Live readings from your smart home</Text>

      <View style={styles.readings}>
        <View style={styles.sensorCard}>
          <Ionicons name="thermometer-outline" size={30} />
          <Text style={styles.sensorLabel}>Temperature</Text>
          <Text style={styles.sensorValue}>{sensors.temperature} °C</Text>
        </View>

        <View style={styles.sensorCard}>
          <Ionicons name="water-outline" size={30} />
          <Text style={styles.sensorLabel}>Humidity</Text>
          <Text style={styles.sensorValue}>{sensors.humidity} %</Text>
        </View>

        <View style={styles.sensorCard}>
          <Ionicons name="sunny-outline" size={30} />
          <Text style={styles.sensorLabel}>Light Level</Text>
          <Text style={styles.sensorValue}>{sensors.lightLevel} lux</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={loading}
        onPress={() => {
          void refreshSensors();
        }}
        style={({ pressed }) => [
          styles.refreshButton,
          pressed && !loading && styles.refreshButtonPressed,
          loading && styles.refreshButtonDisabled,
        ]}
      >
        {loading && <ActivityIndicator color="#ffffff" size="small" />}
        <Text style={styles.refreshButtonText}>
          {loading ? "Refreshing..." : "Refresh Sensors"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },
  readings: {
    gap: 15,
  },
  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#eeeeee",
  },
  sensorLabel: {
    fontSize: 16,
    marginTop: 10,
  },
  sensorValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  refreshButton: {
    minHeight: 48,
    marginTop: 25,
    borderRadius: 8,
    backgroundColor: "#208AEF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  refreshButtonPressed: {
    opacity: 0.8,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
