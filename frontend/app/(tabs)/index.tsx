import React, { useEffect, useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { useGet } from "@/hooks/use-api-methods";
import {
  Header,
  DailyInsightCard,
  MetricsGrid,
  WeeklyGoals,
  MetricsGridSkeleton,
  DailyInsightSkeleton,
  WeeklyGoalsSkeleton,
} from "@/components/home";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

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

interface InsightAction {
  [key: string]: any;
}

interface DashboardInsight {
  actions: InsightAction[];
  risk_score: number;
  summary: string;
}

interface DashboardResponse {
  activityBars: number[];
  goals: Record<string, any>;
  insight: DashboardInsight | null;
  risk_score: number;
  screenTime: number;
  sleep: string;
  steps: number;
  userName: string | null;
}

// Parse sleep string like "7h 30m" → { hours: 7, minutes: 30 }
function parseSleepString(sleep: string): { hours: number; minutes: number } {
  const match = sleep.match(/(\d+)h\s*(\d+)m/);
  if (match) {
    return { hours: parseInt(match[1], 10), minutes: parseInt(match[2], 10) };
  }
  return { hours: 0, minutes: 0 };
}

function minutesToHoursAndMinutes(minutes: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours, minutes: mins };
}

// Main Screen
export default function HomeScreen() {
  const router = useRouter();
  const {
    data: dashboardData,
    loading,
    error,
    execute: fetchDashboard,
  } = useGet<DashboardResponse>("/dashboard");

  useEffect(() => {
    fetchDashboard()
      .then((res) => console.log("Dashboard response:", res))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, [fetchDashboard]);

  // Transform dashboard API data to UI format
  const { stepsData, sleepData, screenTimeData, activityBars, goals, insight } =
    useMemo(() => {
      if (!dashboardData) {
        // Default values while loading
        return {
          stepsData: { count: 0, trend: 0, sparkline: Array(12).fill(0) },
          sleepData: { hours: 0, minutes: 0, quality: "Fair" as const },
          screenTimeData: { hours: 0, minutes: 0, status: "Moderate" as const },
          activityBars: Array(7).fill({ h: 0, active: false }),
          goals: [] as GoalItem[],
          insight: {
            beforeHighlight: "Loading your daily insights...",
            highlight: "",
            afterHighlight: "",
            isNew: false,
          },
        };
      }

      const sleep = parseSleepString(dashboardData.sleep);
      const screenTime = minutesToHoursAndMinutes(dashboardData.screenTime);

      // Classify sleep quality based on hours
      const sleepQuality: "Excellent" | "Good" | "Fair" | "Poor" =
        sleep.hours >= 7
          ? "Excellent"
          : sleep.hours >= 6
            ? "Good"
            : sleep.hours >= 5
              ? "Fair"
              : "Poor";

      // Classify screen time status based on hours
      const screenStatus: "Low" | "Moderate" | "High Usage" =
        screenTime.hours < 3
          ? "Low"
          : screenTime.hours < 5
            ? "Moderate"
            : "High Usage";

      // Generate sparkline from steps
      const sparkline = Array.from(
        { length: 12 },
        () => Math.floor(Math.random() * 100) + dashboardData.steps / 100,
      );

      // Map goals from dashboard object, fall back to steps-based goal
      const goalEntries = Object.entries(dashboardData.goals ?? {});
      const mappedGoals: GoalItem[] =
        goalEntries.length > 0
          ? goalEntries.map(([label, value]: [string, any], i) => ({
              label,
              current: value?.current ?? 0,
              target: value?.target ?? 100,
              unit: value?.unit ?? "",
              color: i === 0 ? colors.primary : "#7C3AED",
            }))
          : [
              {
                label: "Steps",
                current: dashboardData.steps,
                target: 10000,
                unit: "steps",
                color: colors.primary,
              },
            ];

      // Transform raw number array into ActivityBar objects
      const rawBars = dashboardData.activityBars ?? [];
      const maxBar = Math.max(...rawBars, 1); // avoid division by zero
      const median =
        [...rawBars].sort((a, b) => a - b)[Math.floor(rawBars.length / 2)] ?? 0;
      const bars: ActivityBar[] =
        rawBars.length > 0
          ? rawBars.map((value) => ({
              h: Math.round((value / maxBar) * 100),
              active: value > median,
            }))
          : Array(7)
              .fill(null)
              .map((_, i) => ({
                h: Math.random() * 100,
                active: i % 2 === 0,
              }));

      // Build insight from dashboard insight object
      const di = dashboardData.insight;
      const insightObj = di
        ? {
            beforeHighlight: di.summary + " ",
            highlight: `Risk Score: ${di.risk_score}/100`,
            afterHighlight: "",
            isNew: true,
          }
        : {
            beforeHighlight: "Your risk score is ",
            highlight: `${dashboardData.risk_score}/100`,
            afterHighlight:
              dashboardData.risk_score < 30
                ? ". Great job maintaining healthy habits!"
                : ". Consider increasing activity and improving sleep quality.",
            isNew: true,
          };

      return {
        stepsData: {
          count: dashboardData.steps,
          trend: dashboardData.risk_score > 50 ? -10 : 12,
          sparkline,
        },
        sleepData: {
          hours: sleep.hours,
          minutes: sleep.minutes,
          quality: sleepQuality,
        },
        screenTimeData: {
          hours: screenTime.hours,
          minutes: screenTime.minutes,
          status: screenStatus,
        },
        activityBars: bars,
        goals: mappedGoals,
        insight: insightObj,
      };
    }, [dashboardData]);

  const renderDailyInsight = () => {
    if (loading) return <DailyInsightSkeleton />;
    if (error || !dashboardData) {
      return (
        <DailyInsightCard
          insight={{
            beforeHighlight: "Welcome! ",
            highlight: "Track your health",
            afterHighlight: " to reduce diabetes risk.",
            isNew: false,
          }}
        />
      );
    }
    return <DailyInsightCard insight={insight} />;
  };

  const renderMetricsGrid = () => {
    if (loading) return <MetricsGridSkeleton />;
    if (error || !dashboardData) {
      return (
        <MetricsGrid
          steps={{ count: 0, trend: 0, sparkline: Array(12).fill(0) }}
          sleep={{ hours: 0, minutes: 0, quality: "Fair" }}
          screenTime={{ hours: 0, minutes: 0, status: "Moderate" }}
          activityBars={Array(7).fill({ h: 30, active: false })}
        />
      );
    }
    return (
      <MetricsGrid
        steps={stepsData}
        sleep={sleepData}
        screenTime={screenTimeData}
        activityBars={activityBars}
      />
    );
  };

  const renderWeeklyGoals = () => {
    if (loading) return <WeeklyGoalsSkeleton />;
    if (error || !dashboardData) {
      return (
        <WeeklyGoals
          goals={[
            {
              label: "Steps",
              current: 0,
              target: 10000,
              unit: "steps",
              color: colors.primary,
            },
          ]}
        />
      );
    }
    return <WeeklyGoals goals={goals} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {/* Show error banner if there's an error */}
        {error && (
          <View
            style={{
              backgroundColor: colors.error + "15",
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.error}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                color: colors.error,
                flex: 1,
              }}
            >
              Unable to load latest metrics. Showing fallback data.
            </Text>
          </View>
        )}

        {renderDailyInsight()}
        {renderMetricsGrid()}
        {renderWeeklyGoals()}
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
