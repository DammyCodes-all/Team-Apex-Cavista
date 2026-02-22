import React, { useEffect, useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { useGet } from "@/hooks/use-api-methods";
import { useStepCounter } from "@/hooks/use-step-counter";
import { useStepSparkline } from "@/hooks/use-step-sparkline";
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

interface AiInsightResponseItem {
  summary_message?: string;
  created_at?: string;
  date?: string;
}

interface ProfileResponse {
  name?: string;
  email?: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  tracking_sleep?: boolean;
  tracking_steps?: boolean;
  tracking_screen_time?: boolean;
  tracking_voice_stress?: boolean;
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
  const { data: aiInsightsData, execute: fetchAiInsights } =
    useGet<AiInsightResponseItem[]>("/ai/insights");
  const { data: profileData, execute: fetchProfile } =
    useGet<ProfileResponse>("/profile");

  // Real accelerometer-based step counting (works in Expo Go Android)
  const {
    totalSteps: deviceSteps,
    hourlyBuckets,
    isAvailable: accelAvailable,
  } = useStepCounter();
  const {
    sparkline: deviceSparkline,
    trend: deviceTrend,
    activityBars: deviceActivityBars,
  } = useStepSparkline(hourlyBuckets, deviceSteps);

  useEffect(() => {
    fetchDashboard();
    fetchAiInsights();
    fetchProfile();
  }, [fetchDashboard, fetchAiInsights, fetchProfile]);

  // Transform dashboard API data to UI format
  const {
    stepsData,
    sleepData,
    screenTimeData,
    activityBars,
    goals,
    insight,
    bmi,
  } = useMemo(() => {
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
        bmi: 0,
      };
    }

    const sleep = parseSleepString(dashboardData.sleep);
    const screenTime = minutesToHoursAndMinutes(dashboardData.screenTime);

    // Calculate BMI if height and weight are available
    let bmi = 0;
    if (profileData?.height_cm && profileData?.weight_kg) {
      const heightM = profileData.height_cm / 100;
      bmi = Math.round((profileData.weight_kg / (heightM * heightM)) * 10) / 10;
    }

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

    // Use real device sparkline when accelerometer is available, otherwise flat from API
    const sparkline = accelAvailable
      ? deviceSparkline
      : Array(12).fill(Math.round(dashboardData.steps / 12));

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

    // Use real device activity bars when accelerometer is available
    let bars: ActivityBar[];
    if (accelAvailable) {
      bars = deviceActivityBars;
    } else {
      const rawBars = dashboardData.activityBars ?? [];
      const maxBar = Math.max(...rawBars, 1);
      const median =
        [...rawBars].sort((a, b) => a - b)[Math.floor(rawBars.length / 2)] ?? 0;
      bars =
        rawBars.length > 0
          ? rawBars.map((value) => ({
              h: Math.round((value / maxBar) * 100),
              active: value > median,
            }))
          : Array(7).fill({ h: 0, active: false });
    }

    // Build insight from dashboard insight object
    const di = dashboardData.insight;
    const insightsArray = Array.isArray(aiInsightsData)
      ? aiInsightsData
      : (aiInsightsData as any)?.insights ?? [];
    const latestAiSummary = [...insightsArray]
      .sort((a, b) => {
        const left = new Date(a.created_at ?? a.date ?? 0).getTime();
        const right = new Date(b.created_at ?? b.date ?? 0).getTime();
        return right - left;
      })
      .find((item) => item.summary_message?.trim())?.summary_message;

    const insightObj = di
      ? {
          beforeHighlight: latestAiSummary ? latestAiSummary : di.summary + " ",
          highlight: latestAiSummary ? "" : `Risk Score: ${di.risk_score}/100`,
          afterHighlight: "",
          isNew: true,
        }
      : {
          beforeHighlight: latestAiSummary
            ? latestAiSummary
            : "Your risk score is ",
          highlight: latestAiSummary ? "" : `${dashboardData.risk_score}/100`,
          afterHighlight: latestAiSummary
            ? ""
            : dashboardData.risk_score < 30
              ? ". Great job maintaining healthy habits!"
              : ". Consider increasing activity and improving sleep quality.",
          isNew: true,
        };

    // When accelerometer is available, blend: show max of device vs API steps
    const stepCount = accelAvailable
      ? Math.max(deviceSteps, dashboardData.steps)
      : dashboardData.steps;
    const trend = accelAvailable
      ? deviceTrend
      : dashboardData.risk_score > 50
        ? -10
        : 12;

    return {
      stepsData: {
        count: stepCount,
        trend,
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
      bmi,
    };
  }, [
    dashboardData,
    accelAvailable,
    deviceSteps,
    deviceSparkline,
    deviceTrend,
    deviceActivityBars,
    aiInsightsData,
    profileData,
  ]);

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

        {/* BMI Card */}
        {profileData?.height_cm && profileData?.weight_kg && bmi > 0 && (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.primary + "15",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="person" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: typo.family.semiBold,
                    fontSize: typo.size.caption,
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Body Mass Index
                </Text>
                <Text
                  style={{
                    fontFamily: typo.family.body,
                    fontSize: 11,
                    color:
                      bmi < 25
                        ? colors.success
                        : bmi < 30
                          ? "#F59E0B"
                          : colors.error,
                    marginTop: 1,
                  }}
                >
                  {bmi < 18.5
                    ? "● Underweight"
                    : bmi < 25
                      ? "● Healthy weight"
                      : bmi < 30
                        ? "● Overweight"
                        : "● Obese"}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{
                  fontFamily: typo.family.bold,
                  fontSize: 42,
                  color: colors.textPrimary,
                  lineHeight: 48,
                }}
              >
                {bmi}
              </Text>
              <Text
                style={{
                  fontFamily: typo.family.body,
                  fontSize: typo.size.body,
                  color: colors.textSecondary,
                  marginLeft: 6,
                }}
              >
                kg/m²
              </Text>
            </View>

            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#E0E0E0",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: typo.family.body,
                    fontSize: 12,
                    color: colors.textSecondary,
                  }}
                >
                  Height: {profileData.height_cm} cm
                </Text>
                <Text
                  style={{
                    fontFamily: typo.family.body,
                    fontSize: 12,
                    color: colors.textSecondary,
                  }}
                >
                  Weight: {profileData.weight_kg} kg
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Live Step Counter — real accelerometer data */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: accelAvailable
                  ? colors.primary + "15"
                  : "#FEE2E2",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons
                name="footsteps"
                size={18}
                color={accelAvailable ? colors.primary : colors.error}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: typo.family.semiBold,
                  fontSize: typo.size.caption,
                  color: colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Live Step Counter
              </Text>
              <Text
                style={{
                  fontFamily: typo.family.body,
                  fontSize: 11,
                  color: accelAvailable ? colors.success : colors.error,
                  marginTop: 1,
                }}
              >
                {accelAvailable
                  ? "● Tracking via accelerometer"
                  : "● Sensor unavailable"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text
              style={{
                fontFamily: typo.family.bold,
                fontSize: 42,
                color: colors.textPrimary,
                lineHeight: 48,
              }}
            >
              {deviceSteps.toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.body,
                color: colors.textSecondary,
                marginLeft: 6,
              }}
            >
              steps today
            </Text>
          </View>

          {/* Mini hourly bar chart */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              height: 40,
              marginTop: 14,
              gap: 3,
            }}
          >
            {hourlyBuckets.slice(0, new Date().getHours() + 1).map((val, i) => {
              const maxVal = Math.max(...hourlyBuckets, 1);
              const barH = Math.max((val / maxVal) * 36, val > 0 ? 3 : 1);
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: barH,
                    backgroundColor:
                      val > 0 ? colors.primary : colors.primary + "20",
                    borderRadius: 2,
                  }}
                />
              );
            })}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: 10,
                color: colors.textSecondary,
              }}
            >
              12 AM
            </Text>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: 10,
                color: colors.textSecondary,
              }}
            >
              Now
            </Text>
          </View>
        </View>

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
