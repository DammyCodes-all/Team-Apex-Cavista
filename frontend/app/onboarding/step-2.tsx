import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";

type PermissionKey =
  | "steps"
  | "sleep"
  | "screenTime"
  | "location"
  | "voiceStress";

const PERMISSIONS: {
  key: PermissionKey;
  icon: string;
  title: string;
  subtitle: string;
  optional?: boolean;
}[] = [
  {
    key: "steps",
    icon: "🚶",
    title: "Steps & Activity",
    subtitle: "Track daily movement patterns",
  },
  {
    key: "sleep",
    icon: "😴",
    title: "Sleep Tracking",
    subtitle: "Monitor sleep quality and duration",
  },
  {
    key: "screenTime",
    icon: "📱",
    title: "Screen Time",
    subtitle: "Understand digital habits impact",
  },
  {
    key: "location",
    icon: "📍",
    title: "Location Patterns",
    subtitle: "Identify routine and stress triggers",
  },
  {
    key: "voiceStress",
    icon: "🎙️",
    title: "Voice Stress Analysis",
    subtitle: "Detect stress in voice patterns",
    optional: true,
  },
];

export default function OnboardingStepTwo() {
  const colors = preventionTheme.colors.light;

  const [permissions, setPermissions] = useState<
    Record<PermissionKey, boolean>
  >({
    steps: true,
    sleep: true,
    screenTime: true,
    location: true,
    voiceStress: false,
  });

  const enabledCount = useMemo(
    () => Object.values(permissions).filter(Boolean).length,
    [permissions],
  );

  const togglePermission = (key: PermissionKey, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C9DCE8" }}>
      <OnboardingSwipeView step={2} totalSteps={5}>
        <View
          className="flex-1 px-4"
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            backgroundColor: "#C9DCE8",
          }}
        >
          <View className="items-center pt-l">
            <OnboardingStepDots
              step={2}
              totalSteps={5}
              labelColor="#5C6875"
              labelFontSize={32 / 2}
              labelFontFamily={preventionTheme.typography.family.medium}
              activeColor={colors.primary}
              inactiveColor="#90A5B5"
              activeSize={16}
              inactiveSize={8}
              gap={10}
            />
          </View>

          <View className="mt-l px-1">
            <Text
              style={{
                color: "#2D3449",
                fontSize: 44 / 2,
                lineHeight: 52 / 2,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Your AI Needs Permission to{"\n"}Monitor Trends
            </Text>

            <Text
              className="mt-m"
              style={{
                color: "#45566A",
                fontSize: 16,
                lineHeight: 26,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              We track your steps, sleep, screen time, location, and optional
              voice stress to provide personalized prevention tips.
            </Text>
          </View>

          <View className="mt-l" style={{ gap: 12 }}>
            {PERMISSIONS.map((permission) => {
              const isEnabled = permissions[permission.key];

              return (
                <View
                  key={permission.key}
                  className="flex-row items-center rounded-2xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#D8E4EC",
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                  }}
                >
                  <Text style={{ fontSize: 30, marginRight: 12 }}>
                    {permission.icon}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <View className="flex-row items-center" style={{ gap: 8 }}>
                      <Text
                        style={{
                          color: "#2D3449",
                          fontSize: 30 / 2,
                          lineHeight: 36 / 2,
                          fontFamily:
                            preventionTheme.typography.family.semiBold,
                          flexShrink: 1,
                        }}
                      >
                        {permission.title}
                      </Text>

                      {permission.optional ? (
                        <View
                          className="rounded-md"
                          style={{
                            backgroundColor: "#FDECC8",
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              color: "#DD8B00",
                              fontSize: 11,
                              fontFamily:
                                preventionTheme.typography.family.medium,
                            }}
                          >
                            OPTIONAL
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text
                      style={{
                        color: "#60718A",
                        fontSize: 24 / 2,
                        lineHeight: 30 / 2,
                        fontFamily: preventionTheme.typography.family.body,
                        marginTop: 4,
                      }}
                    >
                      {permission.subtitle}
                    </Text>
                  </View>

                  <Switch
                    value={isEnabled}
                    onValueChange={(value) =>
                      togglePermission(permission.key, value)
                    }
                    trackColor={{ false: "#D3DCE6", true: colors.primary }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D3DCE6"
                  />
                </View>
              );
            })}
          </View>

          <View className="mt-auto pt-l">
            <Text
              className="text-center"
              style={{
                color: "#56687F",
                fontSize: 28 / 2,
                fontFamily: preventionTheme.typography.family.medium,
                marginBottom: 14,
              }}
            >
              {enabledCount} of 5 enabled
            </Text>

            <Link href="/onboarding/step-3" asChild>
              <TouchableOpacity
                className="h-14 items-center justify-center rounded-button"
                style={{ backgroundColor: colors.primary }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Allow & Continue
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
