import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
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

export default function SensorsScreen() {
  const { sensors, loading, sensorError, refreshSensors } = useIoT();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="Sensors"
          subtitle="Live readings from your smart home"
        />

        {loading && (
          <View style={styles.feedback}>
            <ActivityIndicator size="small" />
            <Text>Refreshing Sensors...</Text>
          </View>
        )}

        {sensorError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{sensorError}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void refreshSensors();
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

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
          {loading && (
            <ActivityIndicator color={theme.colors.white} size="small" />
          )}
          <Text style={styles.refreshButtonText}>
            {loading ? "Refreshing..." : "Refresh Sensors"}
          </Text>
        </Pressable>
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
    readings: {
      gap: spacing.md,
      marginHorizontal: spacing.xl,
    },
    sensorCard: {
      padding: spacing.lg,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      ...shadows.card,
    },
    sensorLabel: {
      color: colors.muted,
      ...typography.body,
      marginTop: spacing.md,
    },
    sensorValue: {
      color: colors.amber,
      ...typography.metric,
      marginTop: spacing.xs,
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
      borderRadius: radii.sm,
      backgroundColor: colors.dangerSoft,
      marginHorizontal: spacing.xl,
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
    refreshButton: {
      minHeight: 48,
      marginHorizontal: spacing.xl,
      marginTop: spacing.xl,
      borderRadius: radii.sm,
      backgroundColor: colors.teal,
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
      color: colors.white,
      ...typography.body,
      fontWeight: "700",
    },
  });
}
