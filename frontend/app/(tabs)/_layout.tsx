import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

import { preventionTheme } from "@/constants/tokens";

export default function TabsLayout() {
  const colors = preventionTheme.colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home-filled" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pedometer-test"
        options={{
          title: "Pedometer",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions-walk" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
