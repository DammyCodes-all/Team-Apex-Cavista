import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";
import { useOnboardingStore } from "@/stores/onboarding-store";

interface SetupItem {
  icon: string;
  label: string;
}

interface TimelineItem {
  dayRange: string;
  title: string;
  description: string;
}

const SETUP_ITEMS: SetupItem[] = [
  {
    icon: "data-usage",
    label: "4 data sources connected",
  },
  {
    icon: "person",
    label: "Health profile created",
  },
  {
    icon: "target",
    label: "Personal goals selected",
  },
  {
    icon: "lock",
    label: "Privacy preferences saved",
  },
];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    dayRange: "1–3",
    title: "AI learns your patterns",
    description: "No action needed, just live normally",
  },
  {
    dayRange: "4–7",
    title: "First insights arrive",
    description: "You'll start seeing personalized recommendations",
  },
  {
    dayRange: "7+",
    title: "Full personalization",
    description: "Experience AI tailored to your unique health profile",
  },
];

function SetupItemCard({ item }: { item: SetupItem }) {
  return (
    <View
      className="flex-row items-center rounded-2xl"
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E4EC",
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 10,
      }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          backgroundColor: "#E8F4F9",
          width: 40,
          height: 40,
        }}
      >
        <MaterialIcons
          name="check-circle"
          size={20}
          color={preventionTheme.colors.light.primary}
        />
      </View>

      <Text
        style={{
          marginLeft: 12,
          color: "#2D3449",
          fontSize: 16,
          fontFamily: preventionTheme.typography.family.medium,
          flex: 1,
        }}
      >
        {item.label}
      </Text>
    </View>
  );
}

function TimelineItemCard({ item }: { item: TimelineItem }) {
  return (
    <View
      className="flex-row rounded-2xl"
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E4EC",
        padding: 14,
        marginBottom: 12,
      }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          backgroundColor: preventionTheme.colors.light.primary,
          width: 48,
          height: 48,
          minWidth: 48,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontFamily: preventionTheme.typography.family.bold,
          }}
        >
          {item.dayRange}
        </Text>
      </View>

      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text
          style={{
            color: "#2D3449",
            fontSize: 16,
            fontFamily: preventionTheme.typography.family.semiBold,
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            color: "#60718A",
            fontSize: 14,
            fontFamily: preventionTheme.typography.family.body,
            lineHeight: 22,
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );
}

export default function OnboardingStepFive() {
  const colors = preventionTheme.colors.light;

  // Get all collected data from the store
  const getOnboardingData = useOnboardingStore(
    (state) => state.getOnboardingData,
  );
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  const onboardingData = getOnboardingData();

  const handleSubmit = async () => {
    // Log the data (in production, this would send to backend)
    console.log("Onboarding Data:", onboardingData);

    // TODO: Send onboardingData to backend API
    // await submitOnboarding(onboardingData);

    // Reset the store and navigate to home
    resetOnboarding();
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C9DCE8" }}>
      <OnboardingSwipeView step={5} totalSteps={5}>
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 40,
            backgroundColor: "#C9DCE8",
          }}
        >
          <View className="items-center pt-l">
            <OnboardingStepDots
              step={5}
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

          <View className="mt-xl items-center">
            <View
              className="items-center justify-center rounded-full mb-l"
              style={{
                width: 100,
                height: 100,
                backgroundColor: colors.primary,
              }}
            >
              <MaterialIcons name="check" size={52} color="#FFFFFF" />
            </View>

            <Text
              style={{
                color: "#2D3449",
                fontSize: 46 / 2,
                lineHeight: 54 / 2,
                fontFamily: preventionTheme.typography.family.bold,
                textAlign: "center",
              }}
            >
              You&apos;re All Set!
            </Text>

            <Text
              className="mt-s text-center px-l"
              style={{
                color: "#4E6177",
                fontSize: 16,
                lineHeight: 26,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              Your AI health partner is ready to start learning about you
            </Text>
          </View>

          <View
            className="mt-l rounded-3xl"
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#D8E4EC",
              padding: 16,
            }}
          >
            <Text
              style={{
                color: "#2D3449",
                fontSize: 18,
                fontFamily: preventionTheme.typography.family.bold,
                marginBottom: 14,
              }}
            >
              Here&apos;s what we&apos;ve set up
            </Text>

            {SETUP_ITEMS.map((item, index) => (
              <SetupItemCard key={index} item={item} />
            ))}
          </View>

          <View
            className="mt-l rounded-3xl"
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#D8E4EC",
              padding: 16,
            }}
          >
            <Text
              style={{
                color: "#2D3449",
                fontSize: 18,
                fontFamily: preventionTheme.typography.family.bold,
                marginBottom: 14,
              }}
            >
              Your First 7 Days
            </Text>

            {TIMELINE_ITEMS.map((item, index) => (
              <TimelineItemCard key={index} item={item} />
            ))}
          </View>

          <View className="mt-l pt-l">
            <TouchableOpacity
              onPress={handleSubmit}
              className="h-14 items-center justify-center rounded-button"
              style={{ backgroundColor: colors.primary }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Start Using Prevention
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
