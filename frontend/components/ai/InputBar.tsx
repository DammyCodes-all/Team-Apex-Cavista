import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface InputBarProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function InputBar({
  value,
  onChange,
  onSend,
  disabled = false,
}: InputBarProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const attachOptions: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    bg: string;
  }[] = [
    { icon: "image-outline", label: "Photo", color: "#7C3AED", bg: "#EDE9FE" },
    {
      icon: "camera-outline",
      label: "Camera",
      color: "#0EA5E9",
      bg: "#E0F2FE",
    },
    {
      icon: "document-outline",
      label: "Document",
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
    {
      icon: "location-outline",
      label: "Location",
      color: "#10b981",
      bg: "#D1FAE5",
    },
  ];

  return (
    <View>
      {/* Attachment menu popup */}
      {showAttachMenu && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.inputBorder,
          }}
        >
          {attachOptions.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              activeOpacity={0.7}
              onPress={() => setShowAttachMenu(false)}
              style={{ alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: opt.bg,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={opt.icon} size={24} color={opt.color} />
              </View>
              <Text
                style={{
                  fontFamily: typo.family.medium,
                  fontSize: 11,
                  color: colors.textSecondary,
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: keyboardVisible ? 12 : 80,
          gap: 10,
          borderTopWidth: 1,
          borderTopColor: colors.inputBorder,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowAttachMenu((prev) => !prev)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name={showAttachMenu ? "close" : "add"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === "ios" ? 10 : 4,
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            style={{
              flex: 1,
              fontFamily: typo.family.body,
              fontSize: typo.size.body,
              color: colors.textPrimary,
              opacity: disabled ? 0.5 : 1,
            }}
            returnKeyType="send"
            onSubmitEditing={onSend}
            editable={!disabled}
          />
          <TouchableOpacity onPress={onSend} disabled={disabled || !value.trim()}>
            <Ionicons
              name="send"
              size={20}
              color={
                value.trim() && !disabled
                  ? colors.primary
                  : colors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
