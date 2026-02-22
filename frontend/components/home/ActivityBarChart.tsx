import React from "react";
import { View, Text } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface ActivityBar {
  h: number;
  active: boolean;
}

interface ActivityBarChartProps {
  bars: ActivityBar[];
}

export function ActivityBarChart({ bars }: ActivityBarChartProps) {
  const chartH = 80;

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          height: chartH,
          gap: 5,
        }}
      >
        {bars.map((bar, i) => (
          <View
            key={i}
            style={{
              width: 14,
              height: (bar.h / 100) * chartH,
              backgroundColor: bar.active ? colors.primary : "#D6EAF8",
              borderRadius: 3,
            }}
          />
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 6,
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: 10,
            color: colors.textSecondary,
          }}
        >
          AM
        </Text>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: 10,
            color: colors.textSecondary,
          }}
        >
          PM
        </Text>
      </View>
    </View>
  );
}
