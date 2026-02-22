import React from "react";
import { View, Text, Switch } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface PreferencesProps {
  trackingSleep: boolean;
  trackingSteps: boolean;
  trackingScreenTime: boolean;
  trackingVoiceStress: boolean;
  onToggle: (key: "sleep" | "steps" | "screenTime" | "voiceStress") => void;
}

export function Preferences({
  trackingSleep,
  trackingSteps,
  trackingScreenTime,
  trackingVoiceStress,
  onToggle,
}: PreferencesProps) {
  const toggles = [
    {
      label: "AI Daily Analysis",
      value: trackingSleep,
      onPress: () => onToggle("sleep"),
    },
    {
      label: "HealthKit Sync",
      value: trackingSteps,
      onPress: () => onToggle("steps"),
    },
    {
      label: "Share Anonymous Data",
      value: trackingScreenTime,
      onPress: () => onToggle("screenTime"),
    },
    {
      label: "Voice Stress Insights",
      value: trackingVoiceStress,
      onPress: () => onToggle("voiceStress"),
    },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        Preferences
      </Text>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
          marginBottom: 14,
        }}
      >
        These settings help AI generate your daily risk score.
      </Text>

      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          overflow: "hidden",
        }}
      >
        {toggles.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: index < toggles.length - 1 ? 1 : 0,
              borderBottomColor: colors.inputBorder,
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.body,
                lineHeight: typo.lineHeight.body,
                color: colors.textPrimary,
              }}
            >
              {item.label}
            </Text>
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: "#E0E0E0", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
