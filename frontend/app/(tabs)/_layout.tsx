import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";

import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

export default function TabsLayout() {
  const colors = preventionTheme.colors.light;
  const { isAuthenticated, isHydrating, hasAuthHistory } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={hasAuthHistory ? "/auth/login" : "/auth/signup"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontFamily: preventionTheme.typography.family.medium,
          fontSize: 11,
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: "transparent",
          borderTopWidth: 0,
          borderColor: colors.inputBorder,
          borderWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 6,
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 0,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          elevation: 0,
          shadowOpacity: 0,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="risk"
        options={{
          title: "Risk",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pedometer-test"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
