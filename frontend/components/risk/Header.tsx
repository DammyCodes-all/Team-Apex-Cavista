import React from "react";
import { View, Text } from "react-native";

import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export function Header() {
  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.headline,
            lineHeight: typo.lineHeight.headline,
            color: colors.textPrimary,
          }}
        >
          Your Health Risk Trends
        </Text>
      </View>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.body,
          lineHeight: typo.lineHeight.body,
          color: colors.textSecondary,
        }}
      >
        AI predicts potential lifestyle risks and suggests preventive actions.
      </Text>
    </View>
  );
}
