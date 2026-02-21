import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

export default function ProfileTabScreen() {
  const colors = preventionTheme.colors.light;
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
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
        Profile (Coming Soon)
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoading}
        style={{
          marginTop: 20,
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          height: 46,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily: preventionTheme.typography.family.medium,
          }}
        >
          {isLoading ? "Logging out..." : "Log out"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
