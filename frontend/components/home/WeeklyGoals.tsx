import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { preventionTheme } from "@/constants/tokens";
import { ProgressBar } from "./ProgressBar";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface GoalItem {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface WeeklyGoalsProps {
  goals: GoalItem[];
}

export function WeeklyGoals({ goals }: WeeklyGoalsProps) {
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
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.subheadline,
            color: colors.textPrimary,
          }}
        >
          Weekly Goals
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: typo.size.body,
              color: colors.primary,
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {goals.map((goal, index) => (
        <View
          key={goal.label}
          style={{ marginBottom: index < goals.length - 1 ? 16 : 0 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textPrimary,
              }}
            >
              {goal.label}
            </Text>
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textSecondary,
              }}
            >
              {goal.current}/{goal.target} {goal.unit}
            </Text>
          </View>
          <ProgressBar
            progress={goal.current / goal.target}
            color={goal.color}
          />
        </View>
      ))}
    </View>
  );
}
