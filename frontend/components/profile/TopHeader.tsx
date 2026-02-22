import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface TopHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onToggleEdit: () => void;
}

export function TopHeader({
  isEditing,
  isSaving,
  onToggleEdit,
}: TopHeaderProps) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
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
}
