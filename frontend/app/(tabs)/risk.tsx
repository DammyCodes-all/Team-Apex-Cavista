import React, { useEffect, useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { useGet } from "@/hooks/use-api-methods";
import {
  Header,
  WellnessRiskScore,
  SignalDeviations,
  AiInsights,
  RiskForecastChart,
  MicroActions,
} from "../../components/risk";
import {
  flattenRecommendedActions,
  normalizeRiskScore,
  normalizeWellnessScore,
} from "../../components/risk/utils";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const fallbackSummaryMessage =
  "No new AI insight yet. Keep tracking your daily habits.";

interface DeviationFlags {
  active_minutes?: boolean;
  location?: boolean;
  sedentary?: boolean;
  sleep?: boolean;
  steps?: boolean;
}

interface InsightRecord {
  _id: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  risk_score: number;
  risk_level?: string;
  summary_message?: string;
  deviation_flags?: DeviationFlags;
  recommended_actions?: unknown[];
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function RiskTabScreen() {
  const {
    data: insights,
    loading,
    error,
    execute: fetchInsights,
  } = useGet<InsightRecord[]>("/ai/insights");

  useEffect(() => {
    fetchInsights().catch(() => undefined);
  }, [fetchInsights]);

  const handleRetryInsights = () => {
    fetchInsights().catch(() => undefined);
  };

  const {
    wellnessScore,
    wellnessDelta,
    summaryMessage,
    actionList,
    last7Risk,
  } = useMemo(() => {
    const fallback = {
      wellnessScore: 0,
      wellnessDelta: 0,
      summaryMessage: fallbackSummaryMessage,
      actionList: [] as string[],
      last7Risk: [] as number[],
    };

    if (!Array.isArray(insights)) {
      console.error("Expected array but got:", insights);
    }

    const source = Array.isArray(insights) ? insights : [];
    if (source.length === 0) {
      return fallback;
    }

    const sorted = [...source].sort((a, b) => {
      const left = new Date(a.created_at ?? a.date ?? 0).getTime();
      const right = new Date(b.created_at ?? b.date ?? 0).getTime();
      return right - left;
    });

    const latest = sorted[0];
    const previous = sorted[1];

    const latestRisk = normalizeRiskScore(latest?.risk_score);
    const previousRisk = normalizeRiskScore(previous?.risk_score);

    const recommendedActions = flattenRecommendedActions(
      latest?.recommended_actions,
    );

    const riskSeries = sorted
      .slice(0, 7)
      .map((item) => normalizeRiskScore(item.risk_score))
      .reverse();

    return {
      wellnessScore: normalizeWellnessScore(latestRisk),
      wellnessDelta: previous ? previousRisk - latestRisk : 0,
      summaryMessage: latest?.summary_message ?? fallbackSummaryMessage,
      actionList: recommendedActions,
      last7Risk: riskSeries,
    };
  }, [insights]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {error && (
          <View
            style={{
              backgroundColor: colors.error + "15",
              borderColor: colors.error + "30",
              borderWidth: 1,
              padding: 12,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
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
                {error ||
                  "Unable to load AI insights. Showing fallback trend data."}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleRetryInsights}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontFamily: typo.family.semiBold,
                  fontSize: typo.size.body,
                  lineHeight: typo.lineHeight.body,
                  color: colors.error,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Retrying..." : "Retry"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <WellnessRiskScore score={wellnessScore} delta={wellnessDelta} />
        <SignalDeviations />
        <AiInsights
          summaryMessage={
            loading ? "Loading latest AI summary..." : summaryMessage
          }
        />
        <RiskForecastChart riskData={last7Risk} />
        <MicroActions actions={actionList} />
      </ScrollView>
    </SafeAreaView>
  );
}
