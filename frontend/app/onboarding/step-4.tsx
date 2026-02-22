import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomGoalModal } from "@/components/custom-goal-modal";
import { GoalCard } from "@/components/goal-card";
import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import type { GoalId } from "@/constants/goals";
import { GOALS } from "@/constants/goals";
import { preventionTheme } from "@/constants/tokens";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function OnboardingStepFour() {
  const colors = preventionTheme.colors.light;

  const selectedGoals = useOnboardingStore((state) => state.selectedGoals);
  const setSelectedGoals = useOnboardingStore(
    (state) => state.setSelectedGoals,
  );
  const customGoalText = useOnboardingStore((state) => state.customGoalText);
  const setCustomGoalText = useOnboardingStore(
    (state) => state.setCustomGoalText,
  );

  const [showCustomGoalModal, setShowCustomGoalModal] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);

  const toggleGoal = (goalId: GoalId) => {
    if (goalId === "custom") {
      setShowCustomGoalModal(true);
      return;
    }
    if (goalError) {
      setGoalError(null);
    }
    setSelectedGoals(
      selectedGoals.includes(goalId)
        ? selectedGoals.filter((id) => id !== goalId)
        : [...selectedGoals, goalId],
    );
  };

  const saveCustomGoal = () => {
    if (customGoalText.trim()) {
      if (goalError) {
        setGoalError(null);
      }
      setSelectedGoals(
        selectedGoals.includes("custom")
          ? selectedGoals
          : [...selectedGoals, "custom"],
      );
      setShowCustomGoalModal(false);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      setGoalError("Please select at least one goal to continue");
      return;
    }

    setGoalError(null);
    router.push("/onboarding/step-5");
  };

  const renderGoalRows = () => {
    const rows = [];
    for (let i = 0; i < GOALS.length; i += 2) {
      rows.push(
        <View key={`row-${i}`} style={{ flexDirection: "row", gap: 12 }}>
          {GOALS.slice(i, i + 2).map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isSelected={selectedGoals.includes(goal.id)}
              customGoalText={customGoalText}
              primaryColor={colors.primary}
              onPress={() => toggleGoal(goal.id)}
            />
          ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
      <OnboardingSwipeView step={4} totalSteps={5}>
        <View style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 55,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Step dots */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <OnboardingStepDots
                step={4}
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

            {/* Heading */}
            <Text
              style={{
                color: "#2D3449",
                fontSize: 26,
                lineHeight: 36,
                fontFamily: preventionTheme.typography.family.bold,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              What Matters Most to You?
            </Text>
            <Text
              style={{
                color: "#4E6177",
                fontSize: 15,
                lineHeight: 22,
                fontFamily: preventionTheme.typography.family.body,
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              Help us prioritize the insights you'll see first
            </Text>

            {/* Goal grid */}
            <View style={{ gap: 12 }}>{renderGoalRows()}</View>

            {/* Counter */}
            <Text
              style={{
                color: selectedGoals.length > 0 ? colors.primary : "#7A8DA0",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.medium,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              {selectedGoals.length > 0
                ? `${selectedGoals.length} goal${selectedGoals.length > 1 ? "s" : ""} selected`
                : "Select at least 1 goal"}
            </Text>

            {goalError ? (
              <Text
                style={{
                  color: colors.error,
                  fontSize: 12,
                  fontFamily: preventionTheme.typography.family.body,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {goalError}
              </Text>
            ) : null}
          </ScrollView>

          {/* Fixed bottom button */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 24,
              backgroundColor: "#F5F8FB",
              borderTopWidth: 1,
              borderTopColor: "#E8EEF4",
            }}
          >
            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.85}
              style={{
                height: 56,
                backgroundColor: colors.primary,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: selectedGoals.length > 0 ? 1 : 0.5,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Continue
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </OnboardingSwipeView>

      <CustomGoalModal
        visible={showCustomGoalModal}
        value={customGoalText}
        primaryColor={colors.primary}
        onChangeText={setCustomGoalText}
        onSave={saveCustomGoal}
        onClose={() => setShowCustomGoalModal(false)}
      />
    </SafeAreaView>
  );
}
