import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import type { Goal } from "@/constants/goals";
import { preventionTheme } from "@/constants/tokens";

interface GoalCardProps {
  goal: Goal;
  isSelected: boolean;
  customGoalText: string;
  primaryColor: string;
  onPress: () => void;
}

export function GoalCard({
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
      style={{
        flex: 1,
        backgroundColor: isSelected ? "#EAF6FC" : "#FFFFFF",
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? primaryColor : "#E2EAF0",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isSelected ? 0.08 : 0.04,
        shadowRadius: 4,
        elevation: isSelected ? 3 : 1,
      }}
    >
      <Text style={{ fontSize: 36, marginBottom: 10 }}>{goal.emoji}</Text>
      <Text
        numberOfLines={1}
        style={{
          color: "#2D3449",
          fontSize: 16,
          fontFamily: preventionTheme.typography.family.semiBold,
        }}
      >
        {displayTitle}
      </Text>
      <Text
        numberOfLines={2}
        style={{
          color: "#7A8DA0",
          fontSize: 12,
          lineHeight: 17,
          fontFamily: preventionTheme.typography.family.body,
          marginTop: 4,
        }}
      >
        {displaySubtitle}
      </Text>

      {isSelected && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: primaryColor,
            borderRadius: 12,
            padding: 2,
          }}
        >
          <MaterialIcons name="check" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}
