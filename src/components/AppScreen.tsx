import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { spacing, typography, useTheme } from "../theme";

type AppScreenProps = {
  children: ReactNode;
  edges?: Edge[];
};

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
};

export function AppScreen({
  children,
  edges = ["top", "left", "right"],
}: AppScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  rightContent,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Open navigation menu"
        accessibilityRole="button"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={({ pressed }) => [
          styles.menuButton,
          pressed && styles.menuButtonPressed,
        ]}
      >
        <Ionicons name="menu-outline" size={24} color={colors.ink} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightContent}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.lg,
    },
    menuButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
      backgroundColor: colors.surfaceMuted,
      marginRight: spacing.md,
    },
    menuButtonPressed: {
      opacity: 0.7,
    },
    headerCopy: {
      flex: 1,
    },
    title: {
      color: colors.ink,
      ...typography.title,
    },
    subtitle: {
      color: colors.muted,
      marginTop: spacing.xs,
      ...typography.body,
    },
  });
}
