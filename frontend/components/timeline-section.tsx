import { Text, View } from "react-native";

import { preventionTheme } from "@/constants/tokens";

export interface TimelineItem {
  dayRange: string;
  title: string;
  description: string;
}

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    dayRange: "1-3",
    title: "AI learns your patterns",
    description: "No action needed, just live normally",
  },
  {
    dayRange: "4-7",
    title: "First insights arrive",
    description: "You'll start seeing personalized recommendations",
  },
  {
    dayRange: "7+",
    title: "Full personalization",
    description: "Recommendations become more personalized and actionable",
  },
];

export function TimelineSection() {
  const colors = preventionTheme.colors.light;

  return (
    <View style={{ paddingTop: 4 }}>
      {TIMELINE_ITEMS.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", minHeight: 80 }}>
          {/* Left column: circle + connector line */}
          <View style={{ alignItems: "center", width: 48 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontFamily: preventionTheme.typography.family.bold,
                }}
              >
                {item.dayRange}
              </Text>
            </View>
            {index < TIMELINE_ITEMS.length - 1 && (
              <View
                style={{
                  width: 3,
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 2,
                  marginVertical: -2,
                }}
              />
            )}
          </View>

          {/* Right column: text */}
          <View style={{ flex: 1, marginLeft: 14, paddingBottom: 18 }}>
            <Text
              style={{
                color: "#2D3449",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.semiBold,
                marginBottom: 3,
                marginTop: 2,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: "#7A8DA0",
                fontSize: 14,
                fontFamily: preventionTheme.typography.family.body,
                lineHeight: 20,
              }}
            >
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
