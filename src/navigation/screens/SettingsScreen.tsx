import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { AppScreen, ScreenHeader } from "../../components/AppScreen";
import { useIoT } from "../../context/IoTContext";
import {
  radii,
  spacing,
  typography,
  useTheme,
  type AppTheme,
} from "../../theme";

export default function SettingsScreen() {
  const {
    autoConnect,
    darkMode,
    gatewayConnected,
    notifications,
    setAutoConnect,
    setDarkMode,
    setGatewayConnected,
    setNotifications,
  } = useIoT();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="Settings"
          subtitle="Configure your IoT application"
        />

        {/* General Settings */}

        <Text style={styles.sectionTitle}>General</Text>

        {/* Notifications */}

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={26} />

            <View style={styles.settingText}>
              <Text style={styles.settingName}>Notifications</Text>

              <Text style={styles.settingDescription}>
                Receive alerts from your IoT devices
              </Text>
            </View>
          </View>

          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        {/* Auto Connect */}

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Ionicons name="wifi-outline" size={26} />

            <View style={styles.settingText}>
              <Text style={styles.settingName}>Auto Connect</Text>

              <Text style={styles.settingDescription}>
                Automatically connect to the IoT gateway
              </Text>
            </View>
          </View>

          <Switch value={autoConnect} onValueChange={setAutoConnect} />
        </View>

        {/* Dark Mode */}

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={26} />

            <View style={styles.settingText}>
              <Text style={styles.settingName}>Dark Mode</Text>

              <Text style={styles.settingDescription}>
                Use a darker application appearance
              </Text>
            </View>
          </View>

          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* Connection */}

        <Text style={styles.sectionTitle}>Connection</Text>

        <View style={styles.connectionCard}>
          <View style={styles.connectionInfo}>
            <Ionicons
              name={
                gatewayConnected
                  ? "cloud-done-outline"
                  : "cloud-offline-outline"
              }
              size={30}
            />

            <View>
              <Text style={styles.connectionTitle}>IoT Gateway</Text>

              <Text style={styles.connectionStatus}>
                {gatewayConnected
                  ? "Connected"
                  : "IoT Gateway is disconnected."}
              </Text>
            </View>
          </View>

          <View style={styles.gatewayControl}>
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Gateway Connection</Text>

              <Text style={styles.settingDescription}>
                Enable or disable communication with the IoT gateway
              </Text>
            </View>

            <Switch
              value={gatewayConnected}
              onValueChange={setGatewayConnected}
            />
          </View>
        </View>
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
    sectionTitle: {
      color: colors.ink,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.md,
      marginTop: spacing.lg,
      ...typography.heading,
    },

    settingCard: {
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

    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    settingText: {
      marginLeft: spacing.md,
      flex: 1,
    },

    settingName: {
      color: colors.ink,
      ...typography.body,
      fontWeight: "700",
    },

    settingDescription: {
      color: colors.muted,
      ...typography.caption,
      marginTop: spacing.xs,
    },

    connectionCard: {
      padding: spacing.lg,
      marginHorizontal: spacing.xl,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      ...shadows.card,
    },

    connectionInfo: {
      flexDirection: "row",
      alignItems: "center",
    },

    gatewayControl: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.lg,
    },

    connectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: spacing.md,
    },

    connectionStatus: {
      color: colors.muted,
      ...typography.caption,
      marginLeft: spacing.md,
      marginTop: spacing.xs,
    },
  });
}
