import { preventionTheme } from "@/constants/tokens";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const TopHeader = () => {
  const colors = preventionTheme.colors.light;
  const typo = preventionTheme.typography;
  return function TopHeader({
    isEditing,
    isSaving,
    onToggleEdit,
  }: {
    isEditing: boolean;
    isSaving: boolean;
    onToggleEdit: () => void;
  }) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          // marginTop: 10,
        }}
      >
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleEdit} disabled={isSaving}>
          <Text
            style={{
              fontFamily: typo.family.medium,
              fontSize: typo.size.bodyLg,
              lineHeight: typo.lineHeight.bodyLg,
              color: isEditing ? colors.success : colors.primary,
            }}
          >
            {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
};
