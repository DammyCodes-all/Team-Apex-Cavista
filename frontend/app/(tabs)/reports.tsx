import React, { useState, useRef, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Circle,
} from "react-native-svg";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const SCREEN_WIDTH = Dimensions.get("window").width;

// ─── Top Header ─────────────────────────────────────────────────────
function TopHeader() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 30,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: typo.family.semiBold,
            fontSize: typo.size.subheadline,
            lineHeight: typo.lineHeight.subheadline,
            color: colors.textPrimary,
          }}
        >
          Report Preview
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <TouchableOpacity>
          <Ionicons name="print-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="share-social-outline"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Report Header ──────────────────────────────────────────────────
function ReportHeader() {
  return (
    <View style={{ marginBottom: 20 }}>
      {/* Brand + Date */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: typo.size.subheadlineLg,
              lineHeight: typo.lineHeight.subheadlineLg,
              color: colors.primary,
            }}
          >
            Prevention AI
          </Text>
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: 10,
              color: colors.textSecondary,
              letterSpacing: 1.5,
              marginTop: 2,
            }}
          >
            HEALTH INTELLIGENCE UNIT
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: typo.family.body,
              fontSize: typo.size.caption,
              lineHeight: typo.lineHeight.caption,
              color: colors.textSecondary,
            }}
          >
            Generated
          </Text>
          <Text
            style={{
              fontFamily: typo.family.semiBold,
              fontSize: typo.size.body,
              lineHeight: typo.lineHeight.body,
              color: colors.textPrimary,
            }}
          >
            Oct 24, 2023
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: 22,
          lineHeight: 28,
          color: colors.textPrimary,
          marginBottom: 14,
        }}
      >
        PERSONAL HEALTH{"\n"}BEHAVIOR INTELLIGENCE{"\n"}REPORT
      </Text>

      {/* Status */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.body,
            lineHeight: typo.lineHeight.body,
            color: colors.textSecondary,
          }}
        >
          Current Status:
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#E8F5E9",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 14,
          }}
        >
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text
            style={{
              fontFamily: typo.family.semiBold,
              fontSize: typo.size.caption,
              lineHeight: typo.lineHeight.caption,
              color: "#10b981",
            }}
          >
            LOW RISK
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: colors.inputBorder,
          marginTop: 20,
        }}
      />
    </View>
  );
}

// ─── Executive Summary ──────────────────────────────────────────────
function ExecutiveSummary() {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.primary,
          letterSpacing: 1.5,
          marginBottom: 14,
        }}
      >
        EXECUTIVE SUMMARY
      </Text>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.bodyLg,
          lineHeight: 26,
          color: colors.textPrimary,
        }}
      >
        Your health behaviors have shown a positive trend over the last 30 days
        based on biometric analysis. Sleep consistency and stress management
        markers have improved significantly, contributing to an overall
        reduction in health risk factors.
      </Text>
    </View>
  );
}

// ─── Metric Cards ───────────────────────────────────────────────────
function MetricCards() {
  const cardW = (SCREEN_WIDTH - 56) / 2;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        marginBottom: 28,
      }}
    >
      {/* Stress Markers */}
      <View
        style={{
          width: cardW,
          backgroundColor: "#F0F9FF",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#D6EAF8",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={14}
            color={colors.primary}
          />
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 10,
              color: colors.primary,
              letterSpacing: 1,
            }}
          >
            STRESS{"\n"}MARKERS
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 36,
              color: colors.textPrimary,
            }}
          >
            22
          </Text>
          <Text
            style={{
              fontFamily: typo.family.body,
              fontSize: typo.size.subheadlineLg,
              color: colors.textPrimary,
            }}
          >
            %
          </Text>
          <Ionicons
            name="arrow-down"
            size={16}
            color={colors.primary}
            style={{ marginLeft: 4 }}
          />
        </View>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.caption,
            lineHeight: typo.lineHeight.caption,
            color: colors.textSecondary,
            marginTop: 6,
          }}
        >
          Reduction vs last{"\n"}month
        </Text>
      </View>

      {/* Sleep Quality */}
      <View
        style={{
          width: cardW,
          backgroundColor: colors.card,
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <Ionicons name="moon-outline" size={14} color="#7C3AED" />
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 10,
              color: colors.textSecondary,
              letterSpacing: 1,
            }}
          >
            SLEEP QUALITY
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 36,
              color: colors.textPrimary,
            }}
          >
            8.2
          </Text>
          <Text
            style={{
              fontFamily: typo.family.body,
              fontSize: typo.size.body,
              color: colors.textSecondary,
              marginLeft: 4,
            }}
          >
            hrs
          </Text>
        </View>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.caption,
            lineHeight: typo.lineHeight.caption,
            color: colors.textSecondary,
            marginTop: 6,
          }}
        >
          Avg nightly duration
        </Text>
      </View>
    </View>
  );
}

// ─── Daily Activity Chart ───────────────────────────────────────────
function DailyActivityChart() {
  const data = [28, 25, 32, 38, 35, 42, 40, 45, 43, 48, 50, 46];
  const labels = [
    "Mon",
    "",
    "Wed",
    "",
    "Fri",
    "",
    "Sun",
    "",
    "Tue",
    "",
    "Thu",
    "Sat",
  ];
  const chartW = SCREEN_WIDTH - 72;
  const chartH = 140;
  const tooltipAreaH = 30;
  const svgH = chartH + tooltipAreaH;
  const maxVal = 60;
  const minVal = 10;
  const range = maxVal - minVal;

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * chartW,
    y: tooltipAreaH + (chartH - ((v - minVal) / range) * chartH),
  }));

  // Build smooth curve
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpx1 = (points[i - 1].x + points[i].x) / 2;
    const cpy1 = points[i - 1].y;
    const cpx2 = (points[i - 1].x + points[i].x) / 2;
    const cpy2 = points[i].y;
    linePath += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${points[i].x} ${points[i].y}`;
  }

  // Area fill path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgH} L ${points[0].x} ${svgH} Z`;

  const findNearest = useCallback(
    (touchX: number) => {
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < points.length; i++) {
        const dist = Math.abs(points[i].x - touchX);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      return closest;
    },
    [points],
  );

  const chartRef = useRef<View>(null);
  const chartLayoutX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const touchX = evt.nativeEvent.locationX - 16; // account for padding
        setActiveIdx(findNearest(touchX));
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const touchX = evt.nativeEvent.locationX - 16;
        setActiveIdx(findNearest(touchX));
      },
      onPanResponderRelease: () => {
        // Keep the tooltip visible for a moment then hide
        setTimeout(() => setActiveIdx(null), 1500);
      },
    }),
  ).current;

  const activePoint = activeIdx !== null ? points[activeIdx] : null;
  const activeValue = activeIdx !== null ? data[activeIdx] : null;

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
            fontSize: typo.size.bodyLg,
            lineHeight: typo.lineHeight.bodyLg,
            color: colors.textPrimary,
          }}
        >
          Daily Activity vs. Rest
        </Text>
        <View
          style={{
            backgroundColor: "#FEF2F2",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: typo.size.caption,
              lineHeight: typo.lineHeight.caption,
              color: colors.error,
            }}
          >
            Last 7 Days
          </Text>
        </View>
      </View>

      {/* Chart Card */}
      <View
        ref={chartRef}
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        }}
        {...panResponder.panHandlers}
      >
        <Svg width={chartW} height={svgH}>
          <Defs>
            <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity={0.2} />
              <Stop offset="1" stopColor={colors.primary} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#areaGrad)" />
          <Path
            d={linePath}
            fill="none"
            stroke={colors.primary}
            strokeWidth={2.5}
          />
          {/* Static dots */}
          {points.map((pt, idx) => (
            <Circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={activeIdx === idx ? 6 : 3.5}
              fill={activeIdx === idx ? colors.primary : colors.card}
              stroke={colors.primary}
              strokeWidth={activeIdx === idx ? 2.5 : 1.5}
            />
          ))}
          {/* Vertical guide line on active */}
          {activePoint && (
            <Line
              x1={activePoint.x}
              y1={tooltipAreaH}
              x2={activePoint.x}
              y2={svgH}
              stroke={colors.primary}
              strokeWidth={1}
              strokeDasharray="4,3"
              opacity={0.5}
            />
          )}
        </Svg>

        {/* Tooltip overlay */}
        {activePoint && activeValue !== null && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: Math.min(Math.max(activePoint.x + 16 - 28, 8), chartW - 40),
              top: 10,
              backgroundColor: colors.textPrimary,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.semiBold,
                fontSize: typo.size.caption,
                color: "#FFFFFF",
              }}
            >
              {activeValue} min
            </Text>
            {labels[activeIdx!] ? (
              <Text
                style={{
                  fontFamily: typo.family.body,
                  fontSize: 10,
                  color: "#FFFFFFAA",
                  marginTop: 1,
                }}
              >
                {labels[activeIdx!]}
              </Text>
            ) : null}
          </View>
        )}

        {/* Tap hint text */}
        {activeIdx === null && (
          <Text
            style={{
              textAlign: "center",
              fontFamily: typo.family.body,
              fontSize: 10,
              color: colors.textSecondary,
              marginTop: 6,
              opacity: 0.6,
            }}
          >
            Tap or drag to explore
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Actionable Insights ────────────────────────────────────────────
function ActionableInsights() {
  const insights = [
    {
      number: 1,
      title: "Maintain consistent sleep schedule",
      description:
        "Your circadian rhythm is stabilizing. Try to go to bed within the same 30-minute window.",
    },
    {
      number: 2,
      title: "Increase hydration by 10%",
      description:
        "Daily water intake is slightly below optimal levels for your activity intensity.",
    },
    {
      number: 3,
      title: "Post-activity cooldown",
      description:
        "Heart rate recovery could be improved with 5 minutes of guided breathing.",
    },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
          letterSpacing: 1.5,
          marginBottom: 16,
        }}
      >
        ACTIONABLE INSIGHTS
      </Text>

      {insights.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: colors.card,
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            gap: 14,
          }}
        >
          {/* Number badge */}
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#EAF6FC",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.semiBold,
                fontSize: typo.size.body,
                color: colors.primary,
              }}
            >
              {item.number}
            </Text>
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

// ─── Download Button ────────────────────────────────────────────────
function DownloadButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 35,
      }}
    >
      <Ionicons name="download-outline" size={20} color="#FFFFFF" />
      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.bodyLg,
          lineHeight: typo.lineHeight.bodyLg,
          color: "#FFFFFF",
        }}
      >
        Download Full PDF
      </Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function ReportsTabScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TopHeader />
        <ReportHeader />
        <ExecutiveSummary />
        <MetricCards />
        <DailyActivityChart />
        <ActionableInsights />
        <DownloadButton />
      </ScrollView>
    </SafeAreaView>
  );
}
