import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";

/* ─── Branded shield icon matching design mockup ───────────────────── */
function ShieldIcon({ size = 140 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      {/* Shield body */}
      <Path
        d="M70 12C70 12 28 30 28 65C28 100 70 128 70 128C70 128 112 100 112 65C112 30 70 12 70 12Z"
        fill="#B5DCF0"
        stroke="#7EC8E3"
        strokeWidth={2.5}
      />
      {/* Inner shield highlight */}
      <Path
        d="M70 22C70 22 38 37 38 66C38 95 70 118 70 118C70 118 70 37 70 22Z"
        fill="#C9E8F5"
        opacity={0.6}
      />
      {/* Cross vertical */}
      <Rect x={64} y={52} width={12} height={40} rx={3} fill="#FFFFFF" />
      {/* Cross horizontal */}
      <Rect x={50} y={66} width={40} height={12} rx={3} fill="#FFFFFF" />
      {/* Dotted arc (right side) */}
      {[0, 25, 50, 75, 100, 125, 150, 175].map((angle, i) => {
        const rad = ((angle - 90 + 20) * Math.PI) / 180;
        const cx = 88 + 22 * Math.cos(rad);
        const cy = 68 + 22 * Math.sin(rad);
        return (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.2}
            fill="#7EC8E3"
            opacity={0.7 + i * 0.03}
          />
        );
      })}
    </Svg>
  );
}

export default function OnboardingStepOne() {
  const colors = preventionTheme.colors.light;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FB" }}>
      <OnboardingSwipeView step={1} totalSteps={5}>
        <View
          className="flex-1 px-5 py-10 mt-15"
          style={{
            backgroundColor: "#F5F8FB",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <View className="items-center pt-l">
            <OnboardingStepDots
              step={1}
              totalSteps={5}
              labelColor="#5C6875"
              labelFontSize={16}
              labelFontFamily={preventionTheme.typography.family.medium}
              activeColor={colors.primary}
              inactiveColor="#90A5B5"
              activeSize={16}
              inactiveSize={8}
              gap={10}
            />
          </View>

          <View
            className="flex-1 items-center justify-center px-l"
            style={{ paddingVertical: 28 }}
          >
            <View style={{ marginBottom: 32 }}>
              <ShieldIcon size={140} />
            </View>

            <Text
              className="text-center"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              ellipsizeMode="tail"
              style={{
                color: "#2D3449",
                fontSize: 40,
                lineHeight: 44,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Your Health, Forecasted
            </Text>

            <Text
              className="mt-m text-center"
              style={{
                color: "#45566A",
                fontSize: 15,
                lineHeight: 26,
                fontFamily: preventionTheme.typography.family.body,
                maxWidth: 360,
              }}
            >
              Our AI silently tracks your habits and gives personalized
              prevention insights.{"\n"}No daily input required.
            </Text>
          </View>

          <View className="gap-m" style={{ paddingBottom: 25 }}>
            <Link href="/onboarding/step-2" asChild>
              <TouchableOpacity
                className="h-14 items-center justify-center rounded-button"
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/onboarding/step-2" asChild>
              <TouchableOpacity
                className="h-14 items-center justify-center rounded-button border"
                style={{
                  backgroundColor: "#E9F0F5",
                  borderColor: "#7EC8E3",
                }}
              >
                <Text
                  style={{
                    color: "#7EC8E3",
                    fontSize: 18,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Learn How It Works
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
