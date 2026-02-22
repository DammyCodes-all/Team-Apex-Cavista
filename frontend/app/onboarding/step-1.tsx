import { Link } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { ShieldIcon } from "@/components/shield-icon";
import { preventionTheme } from "@/constants/tokens";

export default function OnboardingStepOne() {
  const colors = preventionTheme.colors.light;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
      <OnboardingSwipeView step={1} totalSteps={5}>
        <View
          className="flex-1 px-5 py-10 mt-15"
          style={{
            backgroundColor: "#F5F8FB",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <View className="items-center pt-l">
            <OnboardingStepDots
              step={1}
              totalSteps={5}
              labelColor="#5C6875"
              labelFontSize={16}
              labelFontFamily={preventionTheme.typography.family.medium}
              activeColor={colors.primary}
              inactiveColor="#90A5B5"
              activeSize={16}
              inactiveSize={8}
              gap={10}
            />
          </View>

          <View
            className="flex-1 items-center justify-center px-l"
            style={{ paddingVertical: 28 }}
          >
            <View style={{ marginBottom: 32 }}>
              <ShieldIcon size={140} />
            </View>

            <Text
              className="text-center"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              ellipsizeMode="tail"
              style={{
                color: "#2D3449",
                fontSize: 40,
                lineHeight: 44,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Your Health, Forecasted
            </Text>

            <Text
              className="mt-m text-center"
              style={{
                color: "#45566A",
                fontSize: 15,
                lineHeight: 26,
                fontFamily: preventionTheme.typography.family.body,
                maxWidth: 360,
              }}
            >
              Our AI silently tracks your habits and gives personalized
              prevention insights.{"\n"}No daily input required.
            </Text>
          </View>

          <View className="gap-m" style={{ paddingBottom: 25 }}>
            <Link href="/onboarding/step-2" asChild>
              <TouchableOpacity
                className="h-14 items-center justify-center rounded-button"
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
