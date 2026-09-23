import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useIoT } from "../../context/IoTContext";

export default function DevicesScreen() {
  const { devices, gatewayConnected, toggleDevice, updatingDeviceId } =
    useIoT();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.subtitle}>Control your connected devices</Text>

      {!gatewayConnected && (
        <Text style={styles.gatewayStatus}>Gateway disconnected</Text>
      )}

      {devices.map((device) => {
        const isUpdating = updatingDeviceId === device.id;

        return (
          <View key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <Ionicons name={device.icon} size={28} />

              <View style={styles.deviceDetails}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceType}>{device.type}</Text>
                <Text style={styles.deviceState}>
                  {isUpdating ? "Updating..." : device.status ? "ON" : "OFF"}
                </Text>
              </View>
            </View>

            <Switch
              value={device.status}
              disabled={!gatewayConnected || isUpdating}
              onValueChange={(value) => {
                void toggleDevice(device.id, value);
              }}
            />
          </View>
        );
      })}
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
  gatewayStatus: {
    color: "#b00020",
    marginBottom: 15,
  },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 15,
    backgroundColor: "#eeeeee",
    marginBottom: 15,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 15,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },
  deviceState: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 3,
  },
});
