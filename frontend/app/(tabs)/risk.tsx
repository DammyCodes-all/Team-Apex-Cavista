import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle, Path, Line, Text as SvgText } from "react-native-svg";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const SCREEN_WIDTH = Dimensions.get("window").width;

// ─── Header ─────────────────────────────────────────────────────────
function Header() {
  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.headline,
            lineHeight: typo.lineHeight.headline,
            color: colors.textPrimary,
          }}
        >
          Your Health Risk Trends
        </Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.body,
          lineHeight: typo.lineHeight.body,
          color: colors.textSecondary,
        }}
      >
        AI predicts potential lifestyle risks and suggests preventive actions.
      </Text>
    </View>
  );
}

// ─── Wellness Risk Score (Donut) ────────────────────────────────────
function WellnessRiskScore() {
  const score = 78;
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

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
          backgroundColor: "#E8F5E9",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons name="trending-up" size={16} color="#10b981" />
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.body,
            lineHeight: typo.lineHeight.body,
            color: "#10b981",
          }}
        >
          +5% vs weekly baseline
        </Text>
      </View>
    </View>
  );
}

// ─── Signal Deviation Card ──────────────────────────────────────────
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

function SignalCard({
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

// ─── Signal Deviations Grid ─────────────────────────────────────────
function SignalDeviations() {
  return (
    <View style={{ marginBottom: 28 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.subheadline,
            lineHeight: typo.lineHeight.subheadline,
            color: colors.textPrimary,
          }}
        >
          Signal Deviations
        </Text>
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.caption,
            lineHeight: typo.lineHeight.caption,
            color: colors.textSecondary,
          }}
        >
          Live Updates
        </Text>
      </View>

      {/* Row 1 */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <SignalCard
          icon="moon-outline"
          iconColor="#7C3AED"
          iconBg="#EDE9FE"
          score={85}
          riskLabel="LOW RISK"
          title="Sleep Quality"
          trend="+2% vs baseline"
          trendColor="#10b981"
          actionLabel="Maintain"
          actionIcon="checkmark-circle-outline"
        />
        <SignalCard
          icon="flame-outline"
          iconColor="#F97316"
          iconBg="#FFF7ED"
          score={45}
          riskLabel="MOD RISK"
          title="Stress"
          trend="+12% vs baseline"
          trendColor="#F59E0B"
          actionLabel="Breathe"
          actionIcon="leaf-outline"
        />
      </View>

      {/* Row 2 */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <SignalCard
          icon="walk-outline"
          iconColor={colors.primary}
          iconBg="#EAF6FC"
          score={92}
          riskLabel="LOW RISK"
          title="Activity"
          trend="-15% vs baseline"
          trendColor="#10b981"
          actionLabel="Workout"
          actionIcon="barbell-outline"
        />
        <SignalCard
          icon="phone-portrait-outline"
          iconColor={colors.error}
          iconBg="#FEF2F2"
          score={30}
          riskLabel="HIGH RISK"
          title="Screen Time"
          trend="+45% vs baseline"
          trendColor={colors.error}
          actionLabel="Downtime"
          actionIcon="time-outline"
        />
      </View>
    </View>
  );
}

// ─── AI Prevention Insights ─────────────────────────────────────────
function AiInsights() {
  const insights = [
    {
      icon: "trending-down-outline" as keyof typeof Ionicons.glyphMap,
      iconColor: "#7C3AED",
      iconBg: "#EDE9FE",
      title: "Activity Drop Detected",
      description:
        "Steps have decreased 30% this week. Consider a short 10-min walk each afternoon to reset.",
    },
    {
      icon: "moon-outline" as keyof typeof Ionicons.glyphMap,
      iconColor: colors.error,
      iconBg: "#FEF2F2",
      title: "Late Night Screen Usage",
      description:
        "Screen time peaks at 11 PM. This correlates with your lower sleep scores.",
    },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.subheadline,
            lineHeight: typo.lineHeight.subheadline,
            color: colors.textPrimary,
          }}
        >
          AI Prevention Insights
        </Text>
      </View>

      {insights.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: item.iconBg,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Ionicons name={item.icon} size={18} color={item.iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typo.family.semiBold,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textPrimary,
                marginBottom: 4,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                lineHeight: 18,
                color: colors.textSecondary,
              }}
            >
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── 7-Day Risk Forecast Chart ──────────────────────────────────────
function RiskForecastChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const blueData = [42, 38, 44, 40, 46, 43, 40];
  const redData = [30, 28, 34, 30, 32, 35, 38];
  const chartW = SCREEN_WIDTH - 80;
  const chartH = 100;
  const maxVal = 60;

  const toPoint = (data: number[], i: number) => ({
    x: (i / (data.length - 1)) * chartW,
    y: chartH - (data[i] / maxVal) * chartH,
  });

  const buildPath = (data: number[]) => {
    const pts = data.map((_, i) => toPoint(data, i));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx1 = (pts[i - 1].x + pts[i].x) / 2;
      const cpy1 = pts[i - 1].y;
      const cpx2 = (pts[i - 1].x + pts[i].x) / 2;
      const cpy2 = pts[i].y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: colors.inputBorder,
      }}
    >
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.bodyLg,
          lineHeight: typo.lineHeight.bodyLg,
          color: colors.textPrimary,
          marginBottom: 16,
        }}
      >
        7-Day Risk Forecast
      </Text>

      <Svg width={chartW} height={chartH + 30}>
        {/* Grid lines */}
        {[0, 1, 2, 3].map((i) => (
          <Line
            key={i}
            x1={0}
            y1={(i / 3) * chartH}
            x2={chartW}
            y2={(i / 3) * chartH}
            stroke="#F0F0F0"
            strokeWidth={1}
          />
        ))}
        {/* Blue line */}
        <Path
          d={buildPath(blueData)}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2.5}
        />
        {/* Red line */}
        <Path
          d={buildPath(redData)}
          fill="none"
          stroke={colors.error}
          strokeWidth={2.5}
          strokeDasharray="6 4"
        />
        {/* Day labels */}
        {days.map((day, i) => (
          <SvgText
            key={day}
            x={(i / (days.length - 1)) * chartW}
            y={chartH + 22}
            textAnchor="middle"
            fill={colors.textSecondary}
            fontSize={11}
            fontFamily={typo.family.body}
          >
            {day}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

// ─── Suggested Micro-Actions ────────────────────────────────────────
function MicroActions() {
  const actions = [
    { title: "Stretch every hour", subtitle: "Reduces sedentary risk" },
    {
      title: "Wind down 30 mins before bed",
      subtitle: "Improves sleep latency",
    },
    { title: "Drink water now", subtitle: "Hydration check" },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
          marginBottom: 14,
        }}
      >
        Suggested Micro-Actions
      </Text>

      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: colors.inputBorder,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textPrimary,
                marginBottom: 2,
              }}
            >
              {action.title}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                lineHeight: typo.lineHeight.caption,
                color: colors.textSecondary,
              }}
            >
              {action.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function RiskTabScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <WellnessRiskScore />
        <SignalDeviations />
        <AiInsights />
        <RiskForecastChart />
        <MicroActions />
      </ScrollView>
    </SafeAreaView>
  );
}
