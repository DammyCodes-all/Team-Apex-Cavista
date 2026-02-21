import { Text, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";

export default function ProfileTabScreen() {
  const colors = preventionTheme.colors.light;

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
    </View>
  );
}
