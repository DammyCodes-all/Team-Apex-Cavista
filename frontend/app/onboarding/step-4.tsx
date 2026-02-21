import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";
import { useOnboardingStore } from "@/stores/onboarding-store";

type GoalId = "sleep" | "active" | "stress" | "focus" | "health" | "custom";

const GOALS: {
  id: GoalId;
  icon: string;
  emoji: string;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "sleep",
    icon: "🌙",
    emoji: "😴",
    title: "Better Sleep",
    subtitle: "Track sleep patterns and get rest recommendations",
  },
  {
    id: "active",
    icon: "🏃",
    emoji: "🏃",
    title: "More Active",
    subtitle: "Increase daily movement and energy levels",
  },
  {
    id: "stress",
    icon: "🧘",
    emoji: "🧘",
    title: "Stress Less",
    subtitle: "Monitor stress triggers and find balance",
  },
  {
    id: "focus",
    icon: "🎯",
    emoji: "🎯",
    title: "Focus Better",
    subtitle: "Reduce distractions and improve concentration",
  },
  {
    id: "health",
    icon: "⚡",
    emoji: "⚡",
    title: "Overall Health",
    subtitle: "Get comprehensive health insights",
  },
  {
    id: "custom",
    icon: "✚",
    emoji: "✚",
    title: "Custom Goal",
    subtitle: "Tell us your specific priority",
  },
];

interface GoalCardProps {
  goal: (typeof GOALS)[0];
  isSelected: boolean;
  customGoalText: string;
  primaryColor: string;
  onPress: () => void;
}

function GoalCard({
  goal,
  isSelected,
  customGoalText,
  primaryColor,
  onPress,
}: GoalCardProps) {
  const isCustomGoal = goal.id === "custom" && customGoalText;
  const displayTitle = isCustomGoal ? customGoalText : goal.title;
  const displaySubtitle = isCustomGoal ? "Your custom priority" : goal.subtitle;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 rounded-3xl"
      style={{
        backgroundColor: isSelected ? "#E8F4F9" : "#FFFFFF",
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? primaryColor : "#D8E4EC",
        paddingHorizontal: 12,
        paddingVertical: 16,
      }}
    >
      <Text style={{ fontSize: 42, marginBottom: 8 }}>{goal.emoji}</Text>
      <Text
        style={{
          color: "#2D3449",
          fontSize: 18,
          fontFamily: preventionTheme.typography.family.semiBold,
        }}
      >
        {displayTitle}
      </Text>
      <Text
        style={{
          color: "#60718A",
          fontSize: 12,
          fontFamily: preventionTheme.typography.family.body,
          marginTop: 6,
        }}
      >
        {displaySubtitle}
      </Text>

      {isSelected && (
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: primaryColor,
            borderRadius: 12,
            padding: 2,
          }}
        >
          <MaterialIcons name="check" size={16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

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

  const toggleGoal = (goalId: GoalId) => {
    if (goalId === "custom") {
      setShowCustomGoalModal(true);
      return;
    }
    setSelectedGoals(
      selectedGoals.includes(goalId)
        ? selectedGoals.filter((id) => id !== goalId)
        : [...selectedGoals, goalId],
    );
  };

  const saveCustomGoal = () => {
    if (customGoalText.trim()) {
      setSelectedGoals(
        selectedGoals.includes("custom")
          ? selectedGoals
          : [...selectedGoals, "custom"],
      );
      setShowCustomGoalModal(false);
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C9DCE8" }}>
      <OnboardingSwipeView step={4} totalSteps={5}>
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 60,
            backgroundColor: "#C9DCE8",
          }}
        >
          <View className="items-center pt-l">
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

          <View className="mt-xl items-center px-l">
            <Text
              style={{
                color: "#2D3449",
                fontSize: 42 / 2,
                lineHeight: 50 / 2,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              What Matters Most to You?
            </Text>

            <Text
              className="mt-s text-center"
              style={{
                color: "#4E6177",
                fontSize: 16,
                lineHeight: 26,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Help us prioritize the insights you&apos;ll see first
            </Text>
          </View>

          <View className="mt-l" style={{ gap: 12 }}>
            {renderGoalRows()}
          </View>

          <View className="mt-auto pt-l">
            <Text
              className="text-center"
              style={{
                color: "#5B6D82",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.medium,
                marginBottom: 14,
              }}
            >
              Select at least 1 goal
            </Text>

            <Link href="/onboarding/step-5" asChild>
              <TouchableOpacity
                className="h-14 items-center justify-center rounded-button"
                style={{
                  backgroundColor: colors.primary,
                  opacity: selectedGoals.length > 0 ? 1 : 0.5,
                }}
                disabled={selectedGoals.length === 0}
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
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </OnboardingSwipeView>

      <Modal
        visible={showCustomGoalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomGoalModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowCustomGoalModal(false)}
            activeOpacity={1}
          />

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 32,
            }}
          >
            <View
              className="flex-row items-center justify-between"
              style={{ marginBottom: 16 }}
            >
              <Text
                style={{
                  color: "#2D3449",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.bold,
                }}
              >
                Custom Goal
              </Text>

              <TouchableOpacity
                onPress={() => setShowCustomGoalModal(false)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="#90A2B7" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: "#4E6177",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.body,
                marginBottom: 12,
              }}
            >
              Tell us what matters most to you for your health journey
            </Text>

            <View
              className="flex-row items-start rounded-2xl"
              style={{
                backgroundColor: "#F5F8FB",
                borderWidth: 1,
                borderColor: "#D3DEE8",
                paddingHorizontal: 14,
                paddingVertical: 12,
                minHeight: 100,
              }}
            >
              <TextInput
                placeholder="Enter your custom goal"
                placeholderTextColor="#8A9CB1"
                multiline
                maxLength={150}
                value={customGoalText}
                onChangeText={setCustomGoalText}
                style={{
                  flex: 1,
                  color: "#2D3449",
                  fontSize: 16,
                  fontFamily: preventionTheme.typography.family.body,
                }}
              />
            </View>

            <Text
              style={{
                color: "#8A9CB1",
                fontSize: 12,
                fontFamily: preventionTheme.typography.family.body,
                marginTop: 8,
                textAlign: "right",
              }}
            >
              {customGoalText.length}/150
            </Text>

            <TouchableOpacity
              onPress={saveCustomGoal}
              activeOpacity={0.85}
              className="h-12 items-center justify-center rounded-2xl mt-4"
              style={{
                backgroundColor: colors.primary,
                opacity: customGoalText.trim() ? 1 : 0.5,
              }}
              disabled={!customGoalText.trim()}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Save Goal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCustomGoalModal(false)}
              activeOpacity={0.85}
              className="h-12 items-center justify-center rounded-2xl mt-2"
              style={{
                backgroundColor: "#DCE8EF",
              }}
            >
              <Text
                style={{
                  color: "#2F80ED",
                  fontSize: 16,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
