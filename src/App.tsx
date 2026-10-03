import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IoTProvider, useIoT } from "./context/IoTContext";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { createTheme, ThemeProvider } from "./theme";

function AppNavigation() {
  const { darkMode } = useIoT();
  const theme = createTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer
        theme={{
          ...(darkMode ? DarkTheme : DefaultTheme),
          dark: darkMode,
          colors: {
            primary: theme.colors.teal,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.ink,
            border: theme.colors.border,
            notification: theme.colors.amber,
          },
        }}
      >
        <DrawerNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <IoTProvider>
        <AppNavigation />
      </IoTProvider>
    </SafeAreaProvider>
  );
}
