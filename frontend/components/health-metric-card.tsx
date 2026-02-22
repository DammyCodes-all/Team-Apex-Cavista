import React from "react";
import { Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { preventionTheme } from "@/constants/tokens";

interface HealthMetricCardProps {
  label: string;
  value: string;
  trend: string;
  trendColor: "green" | "red" | "gray";
  icon: string | React.ReactNode;
  chartData: {
    labels: string[];
    datasets: [{ data: number[] }];
  };
}

export function HealthMetricCard({
  label,
  value,
  trend,
  trendColor,
  icon,
  chartData,
}: HealthMetricCardProps) {
  const colors = preventionTheme.colors.light;
  const trendColorMap = {
    green: "#10b981",
    red: "#ef4444",
    gray: "#9ca3af",
  };

  const borderColorMap = {
    green: "#10b981",
    red: "#ef4444",
    gray: "#d1d5db",
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.inputBorder,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor: borderColorMap[trendColor],
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              fontFamily: preventionTheme.typography.family.body,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 28,
              color: colors.textPrimary,
              fontFamily: preventionTheme.typography.family.bold,
            }}
          >
            {value}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: trendColorMap[trendColor],
              fontFamily: preventionTheme.typography.family.body,
            }}
          >
            {trend}
          </Text>
        </View>
        <View
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {typeof icon === "string" ? (
            <Text style={{ fontSize: 32 }}>{icon}</Text>
          ) : (
            icon
          )}
        </View>
      </View>

      <LineChart
        data={chartData}
        width={300}
        height={120}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          color: () => trendColorMap[trendColor],
          strokeWidth: 2,
          useShadowColorFromDataset: false,
          propsForDots: {
            r: 0,
          },
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        bezier
        style={{
          marginLeft: -16,
          marginRight: 0,
        }}
      />
    </View>
  );
}
