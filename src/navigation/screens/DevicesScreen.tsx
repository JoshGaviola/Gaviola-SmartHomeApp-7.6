import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { AppScreen, ScreenHeader } from "../../components/AppScreen";
import { useIoT } from "../../context/IoTContext";
import {
  radii,
  spacing,
  typography,
  useTheme,
  type AppTheme,
} from "../../theme";

export default function DevicesScreen() {
  const {
    devices,
    devicesLoading,
    deviceError,
    gatewayConnected,
    retryDeviceUpdate,
    retryDevices,
    toggleDevice,
    updatingDeviceId,
  } = useIoT();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="Devices"
          subtitle="Control your connected devices"
        />

        {!gatewayConnected && (
          <View style={styles.gatewayStatus}>
            <Ionicons
              name="cloud-offline-outline"
              size={18}
              color={theme.colors.danger}
            />
            <Text style={styles.gatewayStatusText}>
              IoT Gateway is disconnected.
            </Text>
          </View>
        )}

        {devicesLoading && (
          <View style={styles.feedback}>
            <ActivityIndicator size="small" />
            <Text>Loading devices...</Text>
          </View>
        )}

        {deviceError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{deviceError}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void (deviceError.startsWith("Unable to update")
                  ? retryDeviceUpdate()
                  : retryDevices());
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
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
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, shadows } = theme;

  return StyleSheet.create({
    container: {
      paddingBottom: spacing.xxl,
    },
    gatewayStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.lg,
      padding: spacing.md,
      borderRadius: radii.sm,
      backgroundColor: colors.dangerSoft,
    },
    gatewayStatusText: {
      color: colors.danger,
      ...typography.caption,
    },
    feedback: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.lg,
    },
    errorBox: {
      padding: spacing.lg,
      marginHorizontal: spacing.xl,
      borderRadius: radii.sm,
      backgroundColor: colors.dangerSoft,
      marginBottom: spacing.lg,
    },
    errorText: {
      color: colors.danger,
      marginBottom: 10,
    },
    retryButton: {
      alignSelf: "flex-start",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.sm,
      backgroundColor: colors.danger,
    },
    retryButtonText: {
      color: colors.white,
      fontWeight: "bold",
    },
    deviceCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.lg,
      marginHorizontal: spacing.xl,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      marginBottom: spacing.md,
      ...shadows.card,
    },
    deviceInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: spacing.md,
    },
    deviceDetails: {
      flex: 1,
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
    deviceState: {
      color: colors.teal,
      ...typography.caption,
      fontWeight: "700",
      marginTop: spacing.xs,
    },
  });
}
