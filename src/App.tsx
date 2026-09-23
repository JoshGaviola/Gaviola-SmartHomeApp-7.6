import { NavigationContainer } from "@react-navigation/native";
import { IoTProvider } from "./context/IoTContext";
import DrawerNavigator from "./navigation/DrawerNavigator";

export default function App() {
  return (
    <IoTProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </IoTProvider>
  );
}
