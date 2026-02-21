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
import Svg, { Path } from "react-native-svg";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Header ─────────────────────────────────────────────────────────
function Header() {
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
      <View>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.caption,
            color: colors.textSecondary,
            marginBottom: 2,
          }}
        >
          Tuesday, 24 Oct
        </Text>
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.headline,
            color: colors.textPrimary,
          }}
        >
          Good Morning, Alex
        </Text>
      </View>

      {/* Right: bell + avatar */}
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
          <Ionicons name="person" size={24} color="#7D6608" />
        </View>
      </View>
    </View>
  );
}

// ─── Daily Insight Card ─────────────────────────────────────────────
function DailyInsightCard() {
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
        </View>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.body,
            color: colors.textSecondary,
            lineHeight: 21,
          }}
        >
          Based on your sleep pattern, try to get{" "}
          <Text
            style={{ fontFamily: typo.family.bold, color: colors.textPrimary }}
          >
            15 mins of sunlight
          </Text>{" "}
          within the next hour to boost your circadian rhythm.
        </Text>
      </View>
    </View>
  );
}

// ─── Mini sparkline for Steps card ──────────────────────────────────
function StepsSparkline() {
  const data = [30, 45, 38, 52, 48, 60, 55, 70, 62, 78, 72, 85];
  const W = (SCREEN_WIDTH - 72) / 2 - 24; // card inner width roughly
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
function ActivityBarChart() {
  const bars = [
    { h: 30, active: false },
    { h: 45, active: false },
    { h: 55, active: true },
    { h: 75, active: true },
    { h: 90, active: true },
    { h: 65, active: true },
    { h: 50, active: true },
  ];
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
function MetricsGrid() {
  const cardW = (SCREEN_WIDTH - 52) / 2; // 20px padding each side + 12 gap

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
            8,240
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Ionicons name="trending-up" size={16} color="#10b981" />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.caption,
                color: "#10b981",
              }}
            >
              +12% vs avg
            </Text>
          </View>
          <StepsSparkline />
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
            7h 20m
          </Text>
          <View
            style={{
              backgroundColor: "#E8F5E9",
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
                color: "#10b981",
              }}
            >
              Excellent
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
            5h 12m
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
                backgroundColor: colors.error,
              }}
            />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.caption,
                color: colors.error,
              }}
            >
              High Usage
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
            <ActivityBarChart />
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
function WeeklyGoals() {
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

      {/* Cardio */}
      <View style={{ marginBottom: 16 }}>
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
            Cardio
          </Text>
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: typo.size.body,
              color: colors.textSecondary,
            }}
          >
            3/5 days
          </Text>
        </View>
        <ProgressBar progress={3 / 5} color={colors.primary} />
      </View>

      {/* Meditation */}
      <View>
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
            Meditation
          </Text>
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: typo.size.body,
              color: colors.textSecondary,
            }}
          >
            105/120 mins
          </Text>
        </View>
        <ProgressBar progress={105 / 120} color="#7C3AED" />
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <DailyInsightCard />
        <MetricsGrid />
        <WeeklyGoals />
      </ScrollView>

      {/* AI Chat FAB */}
      <TouchableOpacity
        activeOpacity={0.85}
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
