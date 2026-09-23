import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawerContent from "./CustomDrawerContent";
import DashboardScreen from "./screens/DashboardScreen";
import DevicesScreen from "./screens/DevicesScreen";
import SensorsScreen from "./screens/SensorsScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons name="grid-outline" size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons name="analytics-outline" size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons name="hardware-chip-outline" size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons name="settings-outline" size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
