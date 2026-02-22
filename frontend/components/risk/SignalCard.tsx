import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

type RiskLevel = "LOW RISK" | "MOD RISK" | "HIGH RISK";

interface SignalCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  score: number;
  riskLabel: RiskLevel;
  title: string;
  trend: string;
  trendColor: string;
  actionLabel: string;
  actionIcon: keyof typeof Ionicons.glyphMap;
}

function riskColor(level: RiskLevel) {
  switch (level) {
    case "LOW RISK":
      return "#10b981";
    case "MOD RISK":
      return "#F59E0B";
    case "HIGH RISK":
      return colors.error;
  }
}

export function SignalCard({
  icon,
  iconColor,
  iconBg,
  score,
  riskLabel,
  title,
  trend,
  trendColor,
  actionLabel,
  actionIcon,
}: SignalCardProps) {
  const rc = riskColor(riskLabel);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.inputBorder,
      }}
    >
      {/* Top row: icon + score */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: iconBg,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: typo.size.headline,
              lineHeight: typo.lineHeight.headline,
              color: colors.textPrimary,
            }}
          >
            {score}
          </Text>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 9,
              color: rc,
              letterSpacing: 0.5,
            }}
          >
            {riskLabel}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.body,
          lineHeight: typo.lineHeight.body,
          color: colors.textPrimary,
          marginBottom: 2,
        }}
      >
        {title}
      </Text>

      {/* Trend */}
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: trendColor,
          marginBottom: 12,
        }}
      >
        {trend}
      </Text>

      {/* Action button */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          backgroundColor: "#F0F9FF",
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#D6EAF8",
        }}
      >
        <Ionicons name={actionIcon} size={14} color={colors.primary} />
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.caption,
            lineHeight: typo.lineHeight.caption,
            color: colors.primary,
          }}
        >
          {actionLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
