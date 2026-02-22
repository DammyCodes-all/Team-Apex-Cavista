import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { MarkdownBubble } from "@/components/ai/MarkdownBubble";
import type { ChatMessage } from "@/stores/chat-store";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface AiMessageBubbleProps {
  message: ChatMessage;
  onAnimationComplete?: () => void;
}

export function AiMessageBubble({
  message,
  onAnimationComplete,
}: AiMessageBubbleProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      <Text
        style={{
          fontFamily: typo.family.medium,
          fontSize: typo.size.caption,
          color: colors.primary,
          marginLeft: 48,
          marginBottom: 6,
        }}
      >
        Kin AI
      </Text>

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {/* Avatar */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#D5D8DC",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <Ionicons name="sparkles" size={18} color="#5D6D7E" />
        </View>

        {/* Bubble */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 16,
            borderTopLeftRadius: 4,
            padding: 16,
            borderLeftWidth: 3,
            borderLeftColor: "#B9A8D6",
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <MarkdownBubble
            text={message.text}
            isNew={message.isNew}
            onAnimationComplete={onAnimationComplete}
          />
        </View>
      </View>

      {/* Provider badge (subtle) */}
      {message.provider && (
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: 10,
            color: colors.textSecondary,
            marginLeft: 48,
            marginTop: 4,
            opacity: 0.6,
          }}
        >
          via {message.provider}
        </Text>
      )}
    </View>
  );
}
