import React from "react";
import { View, Text } from "react-native";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

interface AvatarSectionProps {
  name: string;
  subtitle: string;
}

export function AvatarSection({ name, subtitle }: AvatarSectionProps) {
  const avatarInitial =
    name.trim().charAt(0).toUpperCase() ||
    subtitle.trim().charAt(0).toUpperCase() ||
    "U";

  return (
    <View style={{ alignItems: "center", marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.subheadline,
          lineHeight: typo.lineHeight.subheadline,
          color: colors.textPrimary,
          alignSelf: "flex-start",
          marginBottom: 16,
          marginTop: 12,
        }}
      >
        Your Profile & Preferences
      </Text>

      {/* Avatar circle */}
      <View style={{ position: "relative", marginBottom: 12 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#D5EFE6",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 44,
              lineHeight: 52,
              color: "#5BA68A",
            }}
          >
            {avatarInitial}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontFamily: typo.family.semiBold,
          fontSize: typo.size.body,
          lineHeight: typo.lineHeight.body,
          color: colors.textPrimary,
          marginBottom: 2,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontFamily: typo.family.body,
          fontSize: typo.size.caption,
          lineHeight: typo.lineHeight.caption,
          color: colors.textSecondary,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
