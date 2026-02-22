import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface ActionButtonsProps {
  actions: { label: string; type: "confirm" | "dismiss" }[];
  onAction: (type: "confirm" | "dismiss") => void;
}

export function ActionButtons({ actions, onAction }: ActionButtonsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
        marginLeft: 48,
      }}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          activeOpacity={0.8}
          onPress={() => onAction(action.type)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 24,
            backgroundColor:
              action.type === "confirm" ? "#D5F5E3" : colors.card,
            borderWidth: action.type === "dismiss" ? 1 : 0,
            borderColor: colors.inputBorder,
          }}
        >
          <Ionicons
            name={action.type === "confirm" ? "checkmark" : "close"}
            size={18}
            color={action.type === "confirm" ? "#10b981" : colors.textSecondary}
          />
          <Text
            style={{
              fontFamily: typo.family.semiBold,
              fontSize: typo.size.body,
              color:
                action.type === "confirm"
                  ? colors.textPrimary
                  : colors.textSecondary,
            }}
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
