import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface ChatHeaderProps {
  onNewChat?: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        position: "relative",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", left: 20 }}
      >
        <Ionicons name="chevron-down" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: typo.family.bold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
        }}
      >
        Kin AI
      </Text>

      {onNewChat && (
        <TouchableOpacity
          onPress={onNewChat}
          style={{ position: "absolute", right: 20 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
