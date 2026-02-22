import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle } from "react-native-svg";

import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export function WellnessRiskScore({
  score,
  delta,
}: {
  score: number;
  delta: number;
}) {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const deltaPositive = delta >= 0;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: typo.family.medium,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.primary,
          letterSpacing: 2,
          marginBottom: 20,
        }}
      >
        WELLNESS RISK SCORE
      </Text>

      <View style={{ width: size, height: size, marginBottom: 20 }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8E8E8"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${progress} ${circumference - progress}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 44,
              color: colors.textPrimary,
            }}
          >
            {score}
          </Text>
          <Text
            style={{
              fontFamily: typo.family.body,
              fontSize: typo.size.caption,
              lineHeight: typo.lineHeight.caption,
              color: colors.textSecondary,
            }}
          >
            / 100
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: deltaPositive ? "#E8F5E9" : "#FEF2F2",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons
          name={deltaPositive ? "trending-up" : "trending-down"}
          size={16}
          color={deltaPositive ? "#10b981" : colors.error}
        />
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.body,
            lineHeight: typo.lineHeight.body,
            color: deltaPositive ? "#10b981" : colors.error,
          }}
        >
          {`${deltaPositive ? "+" : ""}${delta} vs previous insight`}
        </Text>
      </View>
    </View>
  );
}
