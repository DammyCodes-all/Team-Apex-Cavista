import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Inline error message displayed in the chat area.
 * Styled as a system message with optional retry button.
 */
export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <View
      style={{
        marginBottom: 16,
        marginHorizontal: 8,
        backgroundColor: "#FEF2F2",
        borderRadius: 12,
        padding: 14,
        borderLeftWidth: 3,
        borderLeftColor: colors.error,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#FECACA",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="alert-circle" size={18} color={colors.error} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.body,
            color: "#991B1B",
            lineHeight: typo.lineHeight.body,
          }}
        >
          {message}
        </Text>
      </View>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 16,
            backgroundColor: colors.error,
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.semiBold,
              fontSize: typo.size.caption,
              color: "#FFFFFF",
            }}
          >
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
