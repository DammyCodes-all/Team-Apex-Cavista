import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";
import { useAuth } from "@/contexts/auth-context";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return `${day}, ${date}`;
}

export function Header() {
  const dateStr = useMemo(() => getFormattedDate(), []);
  const greeting = useMemo(() => getGreeting(), []);
  const { user } = useAuth();
  const displayName = user?.fullName || "User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      {/* Left: date + greeting */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text
          style={{
            fontFamily: typo.family.body,
            fontSize: typo.size.caption,
            color: colors.textSecondary,
            marginBottom: 2,
          }}
        >
          {dateStr}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: typo.family.bold,
            fontSize: typo.size.headline,
            color: colors.textPrimary,
          }}
        >
          {greeting}, {displayName}!
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.textPrimary}
          />
        </View>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#FDEBD0",
            borderWidth: 2,
            borderColor: "#F5B041",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontFamily: typo.family.bold,
              fontSize: 16,
              color: "#7D6608",
            }}
          >
            {initials}
          </Text>
        </View>
      </View>
    </View>
  );
}
