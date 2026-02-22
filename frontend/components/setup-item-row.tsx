import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";

export interface SetupItem {
  label: string;
  suffix?: string;
}

export const SETUP_ITEMS: SetupItem[] = [
  { label: "4 data sources connected (📞, 📱, 📍)" },
  { label: "Health profile created" },
  { label: "Personal goals selected" },
  { label: "Privacy preferences saved 🔒" },
];

export function SetupItemRow({ item }: { item: SetupItem }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 7,
      }}
    >
      <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
      <Text
        style={{
          marginLeft: 12,
          color: "#2D3449",
          fontSize: 15,
          fontFamily: preventionTheme.typography.family.medium,
          flex: 1,
        }}
      >
        {item.label}
      </Text>
    </View>
  );
}
