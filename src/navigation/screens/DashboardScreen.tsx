import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { AppScreen, ScreenHeader } from "../../components/AppScreen";
import { useIoT } from "../../context/IoTContext";
import { colors, radii, shadows, spacing, typography } from "../../theme";

export default function DashboardScreen() {
  // const [deviceStatus, setDeviceStatus] = useState(
  //     devices.reduce((acc, device) => {
  //         acc[device.id] = device.status;
  //         return acc;
  //     }, {} as Record<number, boolean>)
  // );

  const { devices, gatewayConnected, sensors, toggleDevice, updatingDeviceId } =
    useIoT();

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Good evening" subtitle="Your home at a glance" />

        <View style={styles.sensorRow}>
          <View style={styles.sensorCard}>
            <View style={styles.sensorHeader}>
              <Ionicons name="water-outline" size={22} />

              <Text style={styles.sensorLabel}>Temperature</Text>
            </View>

            <Text style={styles.sensorValue}>{sensors.temperature}°C</Text>
          </View>

          <View style={styles.sensorCard}>
            <View style={styles.sensorHeader}>
              <Ionicons name="water-outline" size={22} />

              <Text style={styles.sensorLabel}>Humidity</Text>
            </View>

            <Text style={styles.sensorValue}>{sensors.humidity}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Device Status</Text>

        {/* <View style={styles.deviceCard}>

                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceIcon}>
                        💡
                    </Text>

                    <View>
                        <Text style={styles.deviceName}>
                            Living Room Light
                        </Text>

                        <Text style={styles.deviceType}>
                            Smart Light
                        </Text>
                    </View>
                </View>

                <Text style={styles.deviceStatus}>
                    ON
                </Text>

            </View>

        </View>
    ); */}

        {devices.map((device) => (
          <View key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <Ionicons
                name={device.icon}
                size={28}
                style={styles.deviceIcon}
              />

              <View>
                <Text style={styles.deviceName}>{device.name}</Text>

                <Text style={styles.deviceType}>{device.type}</Text>

                <Text style={styles.deviceState}>
                  {updatingDeviceId === device.id
                    ? "Updating..."
                    : device.status
                      ? "ON"
                      : "OFF"}
                </Text>
              </View>
            </View>

            <Switch
              value={device.status}
              disabled={!gatewayConnected || updatingDeviceId === device.id}
              onValueChange={(value) => {
                void toggleDevice(device.id, value);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  sensorRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  sensorCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  sensorLabel: {
    color: colors.muted,
    ...typography.caption,
  },
  sensorValue: {
    color: colors.ink,
    ...typography.metric,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xl,
    ...typography.heading,
  },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  deviceIcon: {
    marginRight: spacing.md,
    color: colors.teal,
  },

  deviceName: {
    color: colors.ink,
    ...typography.body,
    fontWeight: "700",
  },

  deviceType: {
    color: colors.muted,
    marginTop: spacing.xs,
    ...typography.caption,
  },

  deviceStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },

  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  deviceState: {},
});
