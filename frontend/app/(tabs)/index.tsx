import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Path } from "react-native-svg";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Types ──────────────────────────────────────────────────────────
interface StepsData {
  count: number;
  trend: number; // percentage vs avg, e.g. 12 = +12%
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

interface GoalItem {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface InsightData {
  highlight: string;
  beforeHighlight: string;
  afterHighlight: string;
  isNew: boolean;
}

interface DashboardData {
  userName: string;
  steps: StepsData;
  sleep: SleepData;
  screenTime: ScreenTimeData;
  activityBars: ActivityBar[];
  goals: GoalItem[];
  insight: InsightData;
}

// ─── Helpers ────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return `${day}, ${date}`;
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

// ─── Mock data (swap with API later) ────────────────────────────────
function useDashboardData(): DashboardData {
  // In the future, replace this with a real API call:
  // const { data } = useApiRequest<DashboardData>('/dashboard');
  const [data] = useState<DashboardData>({
    userName: "Alex",
    steps: {
      count: 8240,
      trend: 12,
      sparkline: [30, 45, 38, 52, 48, 60, 55, 70, 62, 78, 72, 85],
    },
    sleep: {
      hours: 7,
      minutes: 20,
      quality: "Excellent",
    },
    screenTime: {
      hours: 5,
      minutes: 12,
      status: "High Usage",
    },
    activityBars: [
      { h: 30, active: false },
      { h: 45, active: false },
      { h: 55, active: true },
      { h: 75, active: true },
      { h: 90, active: true },
      { h: 65, active: true },
      { h: 50, active: true },
    ],
    goals: [
      {
        label: "Cardio",
        current: 3,
        target: 5,
        unit: "days",
        color: colors.primary,
      },
      {
        label: "Meditation",
        current: 105,
        target: 120,
        unit: "mins",
        color: "#7C3AED",
      },
    ],
    insight: {
      beforeHighlight: "Based on your sleep pattern, try to get ",
      highlight: "15 mins of sunlight",
      afterHighlight: " within the next hour to boost your circadian rhythm.",
      isNew: true,
    },
  });

  return data;
}

// ─── Header ─────────────────────────────────────────────────────────
function Header() {
  const dateStr = useMemo(() => getFormattedDate(), []);
  const greeting = useMemo(() => getGreeting(), []);
  const { user } = useAuth();
  const displayName = user?.fullName || "User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      {/* Left: date + greeting */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.caption,
            color: colors.textSecondary,
            marginBottom: 2,
          }}
        >
          {dateStr}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.headline,
            color: colors.textPrimary,
          }}
        >
          {greeting}, {displayName}!
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#FDEBD0",
            borderWidth: 2,
            borderColor: "#F5B041",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 16,
              color: "#7D6608",
            }}
          >
            {initials}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Daily Insight Card ─────────────────────────────────────────────
function DailyInsightCard({ insight }: { insight: InsightData }) {
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

// ─── Mini sparkline for Steps card ──────────────────────────────────
function StepsSparkline({ data }: { data: number[] }) {
  const W = (SCREEN_WIDTH - 72) / 2 - 24;
  const H = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = (points[i - 1].x + points[i].x) / 2;
    const cp2y = points[i].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  return (
    <Svg width={W} height={H + 4} style={{ marginTop: 8 }}>
      <Path d={d} fill="none" stroke={colors.primary} strokeWidth={2.5} />
    </Svg>
  );
}

// ─── Activity mini bar chart ────────────────────────────────────────
function ActivityBarChart({ bars }: { bars: ActivityBar[] }) {
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

// ─── Metrics Grid (2×2) ────────────────────────────────────────────
function MetricsGrid({
  steps,
  sleep,
  screenTime,
  activityBars,
}: {
  steps: StepsData;
  sleep: SleepData;
  screenTime: ScreenTimeData;
  activityBars: ActivityBar[];
}) {
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

// ─── Progress Bar ──────────────────────────────────────────────────
function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <View
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: "#E8E8E8",
        marginTop: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(progress * 100, 100)}%`,
          height: "100%",
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

// ─── Weekly Goals ──────────────────────────────────────────────────
function WeeklyGoals({ goals }: { goals: GoalItem[] }) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginBottom: 24,
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.subheadline,
            color: colors.textPrimary,
          }}
        >
          Weekly Goals
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: typo.size.body,
              color: colors.primary,
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {goals.map((goal, index) => (
        <View
          key={goal.label}
          style={{ marginBottom: index < goals.length - 1 ? 16 : 0 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textPrimary,
              }}
            >
              {goal.label}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textSecondary,
              }}
            >
              {goal.current}/{goal.target} {goal.unit}
            </Text>
          </View>
          <ProgressBar
            progress={goal.current / goal.target}
            color={goal.color}
          />
        </View>
      ))}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function HomeScreen() {
  const data = useDashboardData();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <DailyInsightCard insight={data.insight} />
        <MetricsGrid
          steps={data.steps}
          sleep={data.sleep}
          screenTime={data.screenTime}
          activityBars={data.activityBars}
        />
        <WeeklyGoals goals={data.goals} />
      </ScrollView>

      {/* AI Chat FAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(tabs)/aiPage")}
        style={{
          position: "absolute",
          bottom: 90,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
