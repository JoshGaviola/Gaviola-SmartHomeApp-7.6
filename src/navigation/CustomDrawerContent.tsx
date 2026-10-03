import { StyleSheet, Text, View } from "react-native";

import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";

import { Ionicons } from "@expo/vector-icons";
import { radii, spacing, typography, useTheme, type AppTheme } from "../theme";

export default function CustomDrawerContent(props: any) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="hardware-chip-outline"
            size={38}
            color={theme.colors.teal}
          />
        </View>

        <Text style={styles.title}>IoT Home</Text>

        <Text style={styles.subtitle}>Smart Environment</Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },

    header: {
      padding: spacing.xl,
      alignItems: "center",
      backgroundColor: colors.tealSoft,
      margin: spacing.md,
      borderRadius: radii.md,
    },

    logoContainer: {
      marginBottom: spacing.sm,
    },

    title: {
      color: colors.ink,
      ...typography.heading,
    },

    subtitle: {
      color: colors.muted,
      ...typography.caption,
      marginTop: spacing.xs,
    },

    menu: {
      marginTop: spacing.sm,
    },
  });
}
