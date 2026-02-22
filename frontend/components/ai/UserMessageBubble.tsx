import React from "react";
import { View, Text } from "react-native";
import { preventionTheme } from "@/constants/tokens";
import type { ChatMessage } from "@/stores/chat-store";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface UserMessageBubbleProps {
  message: ChatMessage;
}

export function UserMessageBubble({ message }: UserMessageBubbleProps) {
  return (
    <View style={{ marginBottom: 16, alignItems: "flex-end" }}>
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 16,
          borderTopRightRadius: 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
          maxWidth: "80%",
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.bodyLg,
            lineHeight: typo.lineHeight.bodyLg,
            color: "#FFFFFF",
          }}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}
