import React from "react";
import { View, Text } from "react-native";

import { preventionTheme } from "@/constants/tokens";
import { SignalCard } from "./SignalCard";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

export function SignalDeviations() {
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
