import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export function MicroActions({ actions }: { actions: string[] }) {
  const fallbackActions = [
    "Stretch every hour",
    "Wind down 30 mins before bed",
    "Drink water now",
  ];
  const actionList = actions.length > 0 ? actions.slice(0, 3) : fallbackActions;

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
          marginBottom: 14,
        }}
      >
        Suggested Micro-Actions
      </Text>

      {actionList.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: colors.inputBorder,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textPrimary,
                marginBottom: 2,
              }}
            >
              {action}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                lineHeight: typo.lineHeight.caption,
                color: colors.textSecondary,
              }}
            >
              Recommended by AI insights
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
