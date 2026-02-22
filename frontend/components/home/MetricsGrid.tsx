import React from "react";
import { View, Text, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { StepsSparkline } from "./StepsSparkline";
import { ActivityBarChart } from "./ActivityBarChart";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface StepsData {
  count: number;
  trend: number;
  sparkline: number[];
}

interface SleepData {
  hours: number;
  minutes: number;
  quality: "Excellent" | "Good" | "Fair" | "Poor";
}

interface ScreenTimeData {
  hours: number;
  minutes: number;
  status: "Low" | "Moderate" | "High Usage";
}

interface ActivityBar {
  h: number;
  active: boolean;
}

interface MetricsGridProps {
  steps: StepsData;
  sleep: SleepData;
  screenTime: ScreenTimeData;
  activityBars: ActivityBar[];
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function formatDuration(hours: number, minutes: number): string {
  return `${hours}h ${minutes}m`;
}

function getSleepQualityColor(quality: SleepData["quality"]): string {
  switch (quality) {
    case "Excellent":
      return "#10b981";
    case "Good":
      return "#10b981";
    case "Fair":
      return "#F59E0B";
    case "Poor":
      return colors.error;
  }
}

function getScreenTimeColor(status: ScreenTimeData["status"]): string {
  switch (status) {
    case "Low":
      return "#10b981";
    case "Moderate":
      return "#F59E0B";
    case "High Usage":
      return colors.error;
  }
}

export function MetricsGrid({
  steps,
  sleep,
  screenTime,
  activityBars,
}: MetricsGridProps) {
  const cardW = (SCREEN_WIDTH - 52) / 2;
  const stepsTrendPositive = steps.trend >= 0;
  const sleepColor = getSleepQualityColor(sleep.quality);
  const screenColor = getScreenTimeColor(screenTime.status);

  return (
    <View style={{ marginBottom: 24 }}>
      {/* First Row: Steps + Sleep */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        {/* Steps Card */}
        <View
          style={{
            width: cardW,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons
              name="footsteps-outline"
              size={18}
              color={colors.primary}
            />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textSecondary,
              }}
            >
              Steps
            </Text>
          </View>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 32,
              color: colors.textPrimary,
              marginTop: 10,
            }}
          >
            {formatNumber(steps.count)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Ionicons
              name={stepsTrendPositive ? "trending-up" : "trending-down"}
              size={16}
              color={stepsTrendPositive ? "#10b981" : colors.error}
            />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.caption,
                color: stepsTrendPositive ? "#10b981" : colors.error,
              }}
            >
              {stepsTrendPositive ? "+" : ""}
              {steps.trend}% vs avg
            </Text>
          </View>
          <StepsSparkline data={steps.sparkline} />
        </View>

        {/* Sleep Card */}
        <View
          style={{
            width: cardW,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="moon-outline" size={18} color="#7C3AED" />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textSecondary,
              }}
            >
              Sleep
            </Text>
          </View>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 32,
              color: colors.textPrimary,
              marginTop: 24,
            }}
          >
            {formatDuration(sleep.hours, sleep.minutes)}
          </Text>
          <View
            style={{
              backgroundColor: sleep.quality === "Poor" ? "#FEF2F2" : "#E8F5E9",
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.caption,
                color: sleepColor,
              }}
            >
              {sleep.quality}
            </Text>
          </View>
        </View>
      </View>

      {/* Second Row: Screen Time + Activity */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Screen Time Card */}
        <View
          style={{
            width: cardW,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons
              name="phone-portrait-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textSecondary,
              }}
            >
              Screen Time
            </Text>
          </View>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 32,
              color: colors.textPrimary,
              marginTop: 10,
            }}
          >
            {formatDuration(screenTime.hours, screenTime.minutes)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 8,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: screenColor,
              }}
            />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.caption,
                color: screenColor,
              }}
            >
              {screenTime.status}
            </Text>
          </View>
        </View>

        {/* Activity Card */}
        <View
          style={{
            width: cardW,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="flame-outline" size={18} color="#F97316" />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textSecondary,
              }}
            >
              Activity
            </Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <ActivityBarChart bars={activityBars} />
          </View>
        </View>
      </View>
    </View>
  );
}
