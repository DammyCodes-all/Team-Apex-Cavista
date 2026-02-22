import { Link } from "expo-router";
import { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { PermissionCard } from "@/components/permission-card";
import type { PermissionKey } from "@/constants/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { preventionTheme } from "@/constants/tokens";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function OnboardingStepTwo() {
  const colors = preventionTheme.colors.light;

  const permissions = useOnboardingStore((state) => state.permissions);
  const setPermissions = useOnboardingStore((state) => state.setPermissions);

  const enabledCount = useMemo(
    () => Object.values(permissions).filter(Boolean).length,
    [permissions],
  );

  const togglePermission = (key: PermissionKey, value: boolean) => {
    setPermissions({ ...permissions, [key]: value });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
      <OnboardingSwipeView step={2} totalSteps={5}>
        <ScrollView
          className="flex-1 px-4"
          style={{
            paddingTop: 25,
            backgroundColor: "#F5F8FB",
          }}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
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

          <View className="mt-m px-1">
            <Text
              className="text-center"
              style={{
                color: "#2D3449",
                fontSize: 26,
                lineHeight: 42,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Monitor Your Trends
            </Text>

            <Text
              className="mt-sm text-center"
              style={{
                color: "#45566A",
                fontSize: 16,
                lineHeight: 22,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              We track your steps, sleep, screen time, location, and optional
              voice stress to provide personalized prevention tips.
            </Text>
          </View>

          <View className="mt-l" style={{ gap: 12 }}>
            {PERMISSIONS.map((permission) => (
              <PermissionCard
                key={permission.key}
                permission={permission}
                isEnabled={permissions[permission.key]}
                onToggle={(value) => togglePermission(permission.key, value)}
                activeColor={colors.primary}
              />
            ))}
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
        </ScrollView>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
