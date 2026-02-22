import React, { useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { useMetrics } from "@/hooks/use-metrics";
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

// Get today's date in YYYY-MM-DD format
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function minutesToHoursAndMinutes(minutes: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours, minutes: mins };
}

// Generate activity bars from sedentary and active minutes
function generateActivityBars(
  sedentaryMinutes: number,
  activeMinutes: number,
): ActivityBar[] {
  const bars: ActivityBar[] = [];

  // Create 7 bars representing the day roughly
  for (let i = 0; i < 7; i++) {
    const segmentActive = i * 2 <= Math.floor(activeMinutes) / 60;
    bars.push({
      h: Math.random() * 100,
      active: segmentActive,
    });
  }
  return bars;
}

// Main Screen
export default function HomeScreen() {
  const router = useRouter();
  const today = useMemo(() => getTodayDateString(), []);
  const { data: metricsData, loading, error } = useMetrics(today);

  // Transform API data to UI format
  const { stepsData, sleepData, screenTimeData, activityBars, goals, insight } =
    useMemo(() => {
      if (!metricsData) {
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

      const sleep = minutesToHoursAndMinutes(
        metricsData.sleep_duration_minutes,
      );
      const screenTime = minutesToHoursAndMinutes(
        metricsData.screen_time_minutes,
      );

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

      // Generate sparkline (mock for now - could be from weekly data)
      const sparkline = Array.from(
        { length: 12 },
        () => Math.floor(Math.random() * 100) + metricsData.steps / 100,
      );

      return {
        stepsData: {
          count: metricsData.steps,
          trend: metricsData.risk_score > 50 ? -10 : 12, // Mock trend
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
        activityBars: generateActivityBars(
          metricsData.sedentary_minutes,
          metricsData.active_minutes,
        ),
        goals: [
          {
            label: "Active Minutes",
            current: metricsData.active_minutes,
            target: 150,
            unit: "mins",
            color: colors.primary,
          },
          {
            label: "Location Diversity",
            current: Math.round(metricsData.location_diversity_score * 10),
            target: 10,
            unit: "score",
            color: "#7C3AED",
          },
        ] as GoalItem[],
        insight: {
          beforeHighlight: "Your risk score is ",
          highlight: `${metricsData.risk_score}/100`,
          afterHighlight:
            metricsData.risk_score < 30
              ? ". Great job maintaining healthy habits!"
              : ". Consider increasing activity and improving sleep quality.",
          isNew: true,
        },
      };
    }, [metricsData]);

  const renderDailyInsight = () => {
    if (loading) return <DailyInsightSkeleton />;
    if (error || !metricsData) {
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
    if (error || !metricsData) {
      // Fallback: Show zero metrics with message
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
    if (error || !metricsData) {
      // Fallback: Show placeholder goals
      return (
        <WeeklyGoals
          goals={[
            {
              label: "Active Minutes",
              current: 0,
              target: 150,
              unit: "mins",
              color: colors.primary,
            },
            {
              label: "Location Diversity",
              current: 0,
              target: 10,
              unit: "score",
              color: "#7C3AED",
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
