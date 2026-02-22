import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export function AiInsights({ summaryMessage }: { summaryMessage: string }) {
  const insights = [
    {
      icon: "sparkles-outline" as keyof typeof Ionicons.glyphMap,
      iconColor: colors.primary,
      iconBg: "#EAF6FC",
      title: "Latest AI Summary",
      description: summaryMessage,
    },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.subheadline,
            lineHeight: typo.lineHeight.subheadline,
            color: colors.textPrimary,
          }}
        >
          AI Prevention Insights
        </Text>
      </View>

      {insights.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: item.iconBg,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Ionicons name={item.icon} size={18} color={item.iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typo.family.semiBold,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textPrimary,
                marginBottom: 4,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                lineHeight: 18,
                color: colors.textSecondary,
              }}
            >
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
