import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface InsightData {
  highlight: string;
  beforeHighlight: string;
  afterHighlight: string;
  isNew: boolean;
}

interface DailyInsightCardProps {
  insight: InsightData;
}

export function DailyInsightCard({ insight }: DailyInsightCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      {/* Bot Icon */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: "#EAF6FC",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="chatbubbles" size={24} color={colors.primary} />
      </View>

      {/* Text Content */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: typo.size.caption,
              color: colors.primary,
              letterSpacing: 1,
            }}
          >
            DAILY INSIGHT
          </Text>
          {insight.isNew && (
            <View
              style={{
                backgroundColor: "#E8F5E9",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: typo.family.medium,
                  fontSize: 10,
                  color: colors.success,
                }}
              >
                New
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.body,
            color: colors.textSecondary,
            lineHeight: 21,
          }}
        >
          {insight.beforeHighlight}
          <Text
            style={{ fontFamily: typo.family.bold, color: colors.textPrimary }}
          >
            {insight.highlight}
          </Text>
          {insight.afterHighlight}
        </Text>
      </View>
    </View>
  );
}
