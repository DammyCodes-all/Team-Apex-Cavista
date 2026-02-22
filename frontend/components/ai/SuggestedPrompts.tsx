import React, { useRef, useEffect } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

// ─── Prompt Suggestions ─────────────────────────────────────────────

const SUGGESTED_PROMPTS: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: "How's my sleep this week?", icon: "moon-outline" },
  { text: "Plan a walk for me", icon: "walk-outline" },
  { text: "Summarize my health trends", icon: "trending-up-outline" },
  { text: "Tips to reduce screen time", icon: "phone-portrait-outline" },
  { text: "What's my risk score?", icon: "shield-checkmark-outline" },
  { text: "How can I be more active?", icon: "fitness-outline" },
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  visible: boolean;
}

export function SuggestedPrompts({ onSelect, visible }: SuggestedPromptsProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={{ opacity, marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: typo.family.medium,
          fontSize: typo.size.caption,
          color: colors.textSecondary,
          marginBottom: 10,
          marginLeft: 4,
        }}
      >
        Suggested topics
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      >
        {SUGGESTED_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt.text}
            activeOpacity={0.7}
            onPress={() => onSelect(prompt.text)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: colors.card,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: colors.accent,
            }}
          >
            <Ionicons name={prompt.icon} size={16} color={colors.primary} />
            <Text
              style={{
                fontFamily: typo.family.medium,
                fontSize: typo.size.body,
                color: colors.textPrimary,
              }}
            >
              {prompt.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}
