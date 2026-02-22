import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface FooterProps {
  onLogOut: () => void;
}

export function Footer({ onLogOut }: FooterProps) {
  return (
    <View style={{ alignItems: "center", marginBottom: 24 }}>
      <TouchableOpacity
        onPress={onLogOut}
        style={{
          width: "100%",
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#FECACA",
          backgroundColor: "#FFF5F5",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.bodyLg,
            lineHeight: typo.lineHeight.bodyLg,
            color: colors.error,
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
        }}
      >
        Version 1.4.2 | Build 889
      </Text>
    </View>
  );
}
