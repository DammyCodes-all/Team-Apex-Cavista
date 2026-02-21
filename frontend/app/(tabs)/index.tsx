import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

export default function HomeTabScreen() {
  const colors = preventionTheme.colors.light;
  const { signOut, isLoading } = useAuth();

  const handleDummyLogout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 24,
          fontFamily: preventionTheme.typography.family.bold,
          textAlign: "center",
        }}
      >
        Dashboard (Coming Soon)
      </Text>

      <TouchableOpacity
        onPress={handleDummyLogout}
        disabled={isLoading}
        style={{
          marginTop: 20,
          backgroundColor: colors.primary,
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderRadius: 12,
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontFamily: preventionTheme.typography.family.medium,
          }}
        >
          {isLoading ? "Logging out..." : "Dummy Logout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
