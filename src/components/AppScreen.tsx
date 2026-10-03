import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../theme";

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
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightContent}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
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
