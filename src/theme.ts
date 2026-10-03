import {
    createContext,
    createElement,
    useContext,
    type ReactNode,
} from "react";
import { Platform } from "react-native";

const lightColors = {
  background: "#F7F4EE",
  surface: "#FFFDF8",
  surfaceMuted: "#EEEAE1",
  ink: "#172321",
  muted: "#68746F",
  border: "#DDD8CD",
  teal: "#087F73",
  tealSoft: "#DDF2ED",
  amber: "#D88924",
  amberSoft: "#FFF0D8",
  danger: "#B9433D",
  dangerSoft: "#FBE8E5",
  white: "#FFFFFF",
} as const;

const darkColors = {
  background: "#172321",
  surface: "#22312E",
  surfaceMuted: "#2C3B37",
  ink: "#F5F1E8",
  muted: "#B4C0BA",
  border: "#40504B",
  teal: "#63D0BE",
  tealSoft: "#244A43",
  amber: "#F3B35A",
  amberSoft: "#4B3822",
  danger: "#F28B82",
  dangerSoft: "#4A2C2A",
  white: "#FFFFFF",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800" as const,
  },
  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800" as const,
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  metric: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800" as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400" as const,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
} as const;

function createShadows(ink: string) {
  return {
    card: Platform.select({
      ios: {
        shadowColor: ink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
      default: {},
    }),
  } as const;
}

export type AppTheme = {
  colors: typeof lightColors | typeof darkColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: ReturnType<typeof createShadows>;
};

export function createTheme(darkMode: boolean): AppTheme {
  const themeColors = darkMode ? darkColors : lightColors;

  return {
    colors: themeColors,
    spacing,
    radii,
    typography,
    shadows: createShadows(themeColors.ink),
  };
}

export const colors = lightColors;
export const shadows = createShadows(lightColors.ink);

const ThemeContext = createContext<AppTheme>(createTheme(false));

export function ThemeProvider({
  theme,
  children,
}: {
  theme: AppTheme;
  children: ReactNode;
}) {
  return createElement(ThemeContext.Provider, { value: theme }, children);
}

export function useTheme() {
  return useContext(ThemeContext);
}
