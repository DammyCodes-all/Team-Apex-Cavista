import React from "react";
import { View, Dimensions, DimensionValue } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const SCREEN_WIDTH = Dimensions.get("window").width;

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
}: {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#E8E8E8",
        opacity: 0.6,
      }}
    />
  );
}

export function MetricsGridSkeleton() {
  const cardW = (SCREEN_WIDTH - 52) / 2;

  return (
    <View style={{ marginBottom: 24 }}>
      {/* First Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
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
          <SkeletonBox width={80} height={16} />
          <View style={{ marginTop: 10 }}>
            <SkeletonBox width={120} height={32} />
          </View>
          <View style={{ marginTop: 8 }}>
            <SkeletonBox width={100} height={14} />
          </View>
          <View style={{ marginTop: 8 }}>
            <SkeletonBox width="100%" height={40} />
          </View>
        </View>

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
          <SkeletonBox width={70} height={16} />
          <View style={{ marginTop: 24 }}>
            <SkeletonBox width={100} height={32} />
          </View>
          <View style={{ marginTop: 10 }}>
            <SkeletonBox width={80} height={24} borderRadius={10} />
          </View>
        </View>
      </View>

      {/* Second Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
          <SkeletonBox width={100} height={16} />
          <View style={{ marginTop: 10 }}>
            <SkeletonBox width={110} height={32} />
          </View>
          <View style={{ marginTop: 8 }}>
            <SkeletonBox width={90} height={14} />
          </View>
        </View>

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
          <SkeletonBox width={80} height={16} />
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <SkeletonBox width="90%" height={80} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function DailyInsightSkeleton() {
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
      <SkeletonBox width={48} height={48} borderRadius={14} />
      <View style={{ flex: 1 }}>
        <SkeletonBox width={120} height={12} />
        <View style={{ marginTop: 10 }}>
          <SkeletonBox width="100%" height={14} />
        </View>
        <View style={{ marginTop: 6 }}>
          <SkeletonBox width="90%" height={14} />
        </View>
        <View style={{ marginTop: 6 }}>
          <SkeletonBox width="70%" height={14} />
        </View>
      </View>
    </View>
  );
}

export function WeeklyGoalsSkeleton() {
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <SkeletonBox width={120} height={20} />
        <SkeletonBox width={60} height={16} />
      </View>
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <SkeletonBox width={80} height={16} />
          <SkeletonBox width={60} height={16} />
        </View>
        <SkeletonBox width="100%" height={6} borderRadius={3} />
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <SkeletonBox width={100} height={16} />
          <SkeletonBox width={70} height={16} />
        </View>
        <SkeletonBox width="100%" height={6} borderRadius={3} />
      </View>
    </View>
  );
}
