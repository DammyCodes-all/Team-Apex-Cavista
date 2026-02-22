import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/profile";
import { useOnboardingStore } from "@/stores/onboarding-store";

interface SetupItem {
  label: string;
  suffix?: string;
}

interface TimelineItem {
  dayRange: string;
  title: string;
  description: string;
}

const SETUP_ITEMS: SetupItem[] = [
  { label: "4 data sources connected (📞, 📱, 📍)" },
  { label: "Health profile created" },
  { label: "Personal goals selected" },
  { label: "Privacy preferences saved 🔒" },
];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    dayRange: "1-3",
    title: "AI learns your patterns",
    description: "No action needed, just live normally",
  },
  {
    dayRange: "4-7",
    title: "First insights arrive",
    description: "You'll start seeing personalized recommendations",
  },
  {
    dayRange: "7+",
    title: "Full personalization",
    description: "Recommendations become more personalized and actionable",
  },
];

function SetupItemRow({ item }: { item: SetupItem }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
      <Text
        style={{
          marginLeft: 12,
          color: "#2D3449",
          fontSize: 15,
          fontFamily: preventionTheme.typography.family.medium,
          flex: 1,
        }}
      >
        {item.label}
      </Text>
    </View>
  );
}

function TimelineSection() {
  const colors = preventionTheme.colors.light;

  return (
    <View style={{ paddingTop: 4 }}>
      {TIMELINE_ITEMS.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", minHeight: 80 }}>
          {/* Left column: circle + connector line */}
          <View style={{ alignItems: "center", width: 48 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontFamily: preventionTheme.typography.family.bold,
                }}
              >
                {item.dayRange}
              </Text>
            </View>
            {index < TIMELINE_ITEMS.length - 1 && (
              <View
                style={{
                  width: 3,
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 2,
                  marginVertical: -2,
                }}
              />
            )}
          </View>

          {/* Right column: text */}
          <View style={{ flex: 1, marginLeft: 14, paddingBottom: 18 }}>
            <Text
              style={{
                color: "#2D3449",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.semiBold,
                marginBottom: 3,
                marginTop: 2,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: "#7A8DA0",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.body,
                lineHeight: 20,
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

export default function OnboardingStepFive() {
  const colors = preventionTheme.colors.light;
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get all collected data from the store
  const getOnboardingData = useOnboardingStore(
    (state) => state.getOnboardingData,
  );
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  const submitProfile = useCallback(async () => {
    const onboardingData = getOnboardingData();
    const resolvedName =
      onboardingData.personalInfo.name.trim() || user?.fullName || "";

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log({
        name: resolvedName,
        age: onboardingData.personalInfo.age,
        gender: onboardingData.personalInfo.gender ?? "",
        height_cm: onboardingData.personalInfo.height,
        weight_kg: onboardingData.personalInfo.weight,
        tracking_sleep: onboardingData.permissions.sleep,
        tracking_steps: onboardingData.permissions.steps,
        tracking_screen_time: onboardingData.permissions.screenTime,
        tracking_voice_stress: onboardingData.permissions.voiceStress,
      });
      await updateProfile({
        name: resolvedName,
        age: onboardingData.personalInfo.age,
        gender: onboardingData.personalInfo.gender ?? "",
        height_cm: onboardingData.personalInfo.height,
        weight_kg: onboardingData.personalInfo.weight,
        tracking_sleep: onboardingData.permissions.sleep,
        tracking_steps: onboardingData.permissions.steps,
        tracking_screen_time: onboardingData.permissions.screenTime,
        tracking_voice_stress: onboardingData.permissions.voiceStress,
        goals_selected: onboardingData.goals.selected,
        goals_custom: onboardingData.goals.custom,
      });

      setIsSaved(true);
      resetOnboarding();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [getOnboardingData, resetOnboarding, user?.fullName]);

  useEffect(() => {
    void submitProfile();
  }, [submitProfile]);

  if (isSubmitting) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
        <OnboardingSwipeView step={5} totalSteps={5}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={{
                color: "#2D3449",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.medium,
                marginTop: 14,
                textAlign: "center",
              }}
            >
              Saving your profile...
            </Text>
          </View>
        </OnboardingSwipeView>
      </SafeAreaView>
    );
  }

  if (submitError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
        <OnboardingSwipeView step={5} totalSteps={5}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                color: colors.error,
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.body,
                textAlign: "center",
                marginBottom: 14,
              }}
            >
              {submitError}
            </Text>
            <TouchableOpacity
              onPress={() => {
                void submitProfile();
              }}
              className="h-12 items-center justify-center rounded-button"
              style={{ backgroundColor: colors.primary, paddingHorizontal: 16 }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </OnboardingSwipeView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
      <OnboardingSwipeView step={5} totalSteps={5}>
        <View style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 40,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Checkmark hero */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons name="checkmark" size={48} color="#FFFFFF" />
              </View>

              <Text
                style={{
                  color: "#2D3449",
                  fontSize: 32,
                  lineHeight: 40,
                  fontFamily: preventionTheme.typography.family.bold,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                You're All Set!
              </Text>
              <Text
                style={{
                  color: "#7A8DA0",
                  fontSize: 15,
                  lineHeight: 22,
                  fontFamily: preventionTheme.typography.family.body,
                  textAlign: "center",
                  maxWidth: 300,
                }}
              >
                Your AI health partner is ready to start{"\n"}learning about
                you.
              </Text>
            </View>

            {/* Setup summary card */}
            <View
              style={{
                backgroundColor: "#F0F4F7",
                borderRadius: 20,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "#2D3449",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.bold,
                  marginBottom: 8,
                }}
              >
                Here's what we've set up
              </Text>
              {SETUP_ITEMS.map((item, index) => (
                <SetupItemRow key={index} item={item} />
              ))}
            </View>

            {/* Timeline card */}
            <View
              style={{
                backgroundColor: "#F0F4F7",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <Text
                style={{
                  color: "#2D3449",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.bold,
                  marginBottom: 12,
                }}
              >
                Your First 7 Days
              </Text>
              <TimelineSection />
            </View>
          </ScrollView>

          {/* Fixed bottom button */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 24,
              backgroundColor: "#F5F8FB",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isSaved) {
                  router.replace("/");
                }
              }}
              activeOpacity={0.85}
              style={{
                height: 56,
                backgroundColor: colors.primary,
                borderRadius: 28,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Go to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
