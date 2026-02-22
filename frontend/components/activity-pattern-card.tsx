import React from "react";
import { Text, View } from "react-native";
import { preventionTheme } from "@/constants/tokens";

interface ActivityPatternCardProps {
  label: string;
  subLabel?: string;
  icon: string;
  activityData: {
    day: string;
    activity: number; // 0-100
  }[];
}

export function ActivityPatternCard({
  label,
  subLabel,
  icon,
  activityData,
}: ActivityPatternCardProps) {
  const colors = preventionTheme.colors.light;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.inputBorder,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor: "#d1d5db",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              fontFamily: preventionTheme.typography.family.body,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Text>
          {subLabel && (
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              {subLabel}
            </Text>
          )}
        </View>
        <Text style={{ fontSize: 32 }}>{icon}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          height: 80,
          gap: 6,
        }}
      >
        {activityData.map((item, index) => {
          const heightPercentage = item.activity;
          const baseColor = "#d1d5db";
          const activeColor = "#86efac";

          return (
            <View
              key={index}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: (heightPercentage / 100) * 80,
                  backgroundColor:
                    heightPercentage > 0 ? activeColor : baseColor,
                  borderRadius: 4,
                  minHeight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textSecondary,
                  fontFamily: preventionTheme.typography.family.body,
                  marginTop: 6,
                }}
              >
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
