import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IoTProvider } from "./context/IoTContext";
import DrawerNavigator from "./navigation/DrawerNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <IoTProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </IoTProvider>
    </SafeAreaProvider>
  );
}
