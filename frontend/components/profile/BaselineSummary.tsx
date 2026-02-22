import React from "react";
import { ScrollView, View, Text, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { preventionTheme } from "@/constants/tokens";

const colors = preventionTheme.colors.light;
const typo = preventionTheme.typography;
const SCREEN_WIDTH = Dimensions.get("window").width;

export function BaselineSummary() {
  const cardW = (SCREEN_WIDTH - 64) / 2;

  const summaryCards = [
    {
      icon: "heart-outline" as const,
      iconColor: "#10b981",
      badgeText: "Low Risk",
      badgeBg: "#E8F5E9",
      badgeColor: "#10b981",
      value: "98",
      valueSuffix: "/100",
      label: "Cardio Score",
    },
    {
      icon: "body-outline" as const,
      iconColor: colors.primary,
      badgeText: "Steady",
      badgeBg: "#E8F5E9",
      badgeColor: "#10b981",
      value: "Low",
      valueSuffix: "",
      label: "Stress Baseline",
    },
  ];

  return (
    <View style={{ marginBottom: 28 }}>
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontFamily: typo.family.semiBold,
            fontSize: typo.size.subheadline,
            lineHeight: typo.lineHeight.subheadline,
            color: colors.textPrimary,
          }}
        >
          Baseline Summary
        </Text>
        <Text
          style={{
            fontFamily: typo.family.medium,
            fontSize: typo.size.caption,
            lineHeight: typo.lineHeight.caption,
            color: colors.textSecondary,
            letterSpacing: 1.5,
          }}
        >
          AI ANALYSIS
        </Text>
      </View>

      {/* Cards row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {summaryCards.map((card, index) => (
          <View
            key={index}
            style={{
              width: cardW,
              backgroundColor: "#F0FAF5",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#D5EFE6",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.card,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={card.icon} size={18} color={card.iconColor} />
              </View>
              <View
                style={{
                  backgroundColor: card.badgeBg,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: typo.family.medium,
                    fontSize: typo.size.caption,
                    lineHeight: typo.lineHeight.caption,
                    color: card.badgeColor,
                  }}
                >
                  {card.badgeText}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 4 }}>
              <Text
                style={{
                  fontFamily: typo.family.bold,
                  fontSize: typo.size.headline,
                  lineHeight: typo.lineHeight.headline,
                  color: colors.textPrimary,
                }}
              >
                {card.value}
                {card.valueSuffix ? (
                  <Text
                    style={{
                      fontFamily: typo.family.body,
                      fontSize: typo.size.body,
                      lineHeight: typo.lineHeight.body,
                      color: colors.textSecondary,
                    }}
                  >
                    {card.valueSuffix}
                  </Text>
                ) : null}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: typo.family.body,
                fontSize: typo.size.caption,
                lineHeight: typo.lineHeight.caption,
                color: colors.textSecondary,
              }}
            >
              {card.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
