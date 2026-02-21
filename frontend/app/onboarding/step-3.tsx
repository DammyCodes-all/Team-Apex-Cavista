import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { OnboardingStepDots } from "@/components/onboarding-step-dots";
import { OnboardingSwipeView } from "@/components/onboarding-swipe-view";
import { preventionTheme } from "@/constants/tokens";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function OnboardingStepThree() {
  const colors = preventionTheme.colors.light;
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const GENDER_OPTIONS = [
    { id: "female", label: "Female", icon: "female" },
    { id: "male", label: "Male", icon: "male" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C9DCE8" }}>
      <OnboardingSwipeView step={3} totalSteps={5}>
        <ScrollView
          className="flex-1 px-4"
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            backgroundColor: "#C9DCE8",
          }}
        >
          <View className="items-center pt-l">
            <OnboardingStepDots
              step={3}
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

          <View className="mt-xl items-center px-l">
            <Text
              style={{
                color: "#2D3449",
                fontSize: 42 / 2,
                lineHeight: 50 / 2,
                fontFamily: preventionTheme.typography.family.bold,
              }}
            >
              Let&apos;s Learn About You
            </Text>

            <Text
              className="mt-s text-center"
              style={{
                color: "#4E6177",
                fontSize: 16,
                lineHeight: 26,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              This helps the AI give personalized health insights.
            </Text>
          </View>

          <View
            className="mt-l rounded-3xl"
            style={{
              backgroundColor: "#EEF4F8",
              padding: 14,
            }}
          >
            <View style={{ gap: 10 }}>
              <View
                className="flex-row items-center rounded-2xl"
                style={{
                  backgroundColor: "#F5F8FB",
                  borderWidth: 1,
                  borderColor: "#D3DEE8",
                  paddingHorizontal: 14,
                  height: 52,
                }}
              >
                <MaterialIcons
                  name="person-outline"
                  size={22}
                  color="#90A2B7"
                />
                <TextInput
                  placeholder="Your name"
                  placeholderTextColor="#8A9CB1"
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    color: "#2D3449",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                />
              </View>

              <View
                className="flex-row items-center rounded-2xl"
                style={{
                  backgroundColor: "#F5F8FB",
                  borderWidth: 1,
                  borderColor: "#D3DEE8",
                  paddingHorizontal: 14,
                  height: 52,
                }}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color="#90A2B7"
                />
                <TextInput
                  placeholder="Age"
                  placeholderTextColor="#8A9CB1"
                  keyboardType="number-pad"
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    color: "#2D3449",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => setShowGenderModal(true)}
                className="flex-row items-center rounded-2xl"
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#F5F8FB",
                  borderWidth: 1,
                  borderColor: "#D3DEE8",
                  paddingHorizontal: 14,
                  height: 52,
                }}
              >
                <MaterialIcons
                  name="sentiment-satisfied"
                  size={20}
                  color="#90A2B7"
                />
                <Text
                  style={{
                    marginLeft: 12,
                    color: selectedGender ? "#2D3449" : "#8A9CB1",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                    flex: 1,
                  }}
                >
                  {selectedGender
                    ? GENDER_OPTIONS.find((g) => g.id === selectedGender)?.label
                    : "Select gender"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={22}
                  color="#90A2B7"
                />
              </TouchableOpacity>

              <View
                className="flex-row items-center rounded-2xl"
                style={{
                  backgroundColor: "#F5F8FB",
                  borderWidth: 1,
                  borderColor: "#D3DEE8",
                  paddingHorizontal: 14,
                  height: 52,
                }}
              >
                <MaterialIcons name="height" size={20} color="#90A2B7" />
                <TextInput
                  placeholder="Height (ft/in)"
                  placeholderTextColor="#8A9CB1"
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    color: "#2D3449",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                />
                <Text
                  style={{
                    color: "#2F80ED",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  cm
                </Text>
              </View>

              <View
                className="flex-row items-center rounded-2xl"
                style={{
                  backgroundColor: "#F5F8FB",
                  borderWidth: 1,
                  borderColor: "#D3DEE8",
                  paddingHorizontal: 14,
                  height: 52,
                }}
              >
                <MaterialIcons
                  name="monitor-weight"
                  size={20}
                  color="#90A2B7"
                />
                <TextInput
                  placeholder="Weight (lbs)"
                  placeholderTextColor="#8A9CB1"
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    color: "#2D3449",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.body,
                  }}
                />
                <Text
                  style={{
                    color: "#2F80ED",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  kg
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="mt-m h-12 flex-row items-center justify-center rounded-2xl"
            activeOpacity={0.85}
            style={{ backgroundColor: "#DCE8EF" }}
          >
            <Text
              style={{
                color: "#2F80ED",
                fontSize: 16,
                fontFamily: preventionTheme.typography.family.medium,
              }}
            >
              Why we ask
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color="#2F80ED"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          <View className="mt-l items-center">
            <Link href="/onboarding/step-4" asChild>
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: "#2F80ED",
                    fontSize: 32 / 2,
                    lineHeight: 38 / 2,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Skip for now
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color="#2F80ED"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </Link>

            <Text
              className="mt-s"
              style={{
                color: "#5B6D82",
                fontSize: 16,
                lineHeight: 24,
                fontFamily: preventionTheme.typography.family.body,
              }}
            >
              You can add this later in settings
            </Text>
          </View>

          <View className="mt-auto pt-l">
            <Link href="/onboarding/step-4" asChild>
              <TouchableOpacity
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
                  Save & Continue
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>

        <Modal
          visible={showGenderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setShowGenderModal(false)}
              activeOpacity={1}
            />

            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 20,
                paddingHorizontal: 20,
                paddingBottom: 32,
                maxHeight: "70%",
              }}
            >
              <View
                className="flex-row items-center justify-between"
                style={{ marginBottom: 16 }}
              >
                <Text
                  style={{
                    color: "#2D3449",
                    fontSize: 18,
                    fontFamily: preventionTheme.typography.family.bold,
                  }}
                >
                  Select Gender
                </Text>

                <TouchableOpacity
                  onPress={() => setShowGenderModal(false)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color="#90A2B7" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={true}>
                <View style={{ gap: 10 }}>
                  {GENDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => {
                        setSelectedGender(option.id);
                        setShowGenderModal(false);
                      }}
                      activeOpacity={0.8}
                      className="flex-row items-center rounded-2xl"
                      style={{
                        backgroundColor:
                          selectedGender === option.id ? "#E8F4F9" : "#F5F8FB",
                        borderWidth: 2,
                        borderColor:
                          selectedGender === option.id
                            ? colors.primary
                            : "#D3DEE8",
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                      }}
                    >
                      <MaterialIcons
                        name={option.icon as any}
                        size={24}
                        color={
                          selectedGender === option.id
                            ? colors.primary
                            : "#90A2B7"
                        }
                      />
                      <Text
                        style={{
                          marginLeft: 12,
                          color:
                            selectedGender === option.id
                              ? colors.primary
                              : "#2D3449",
                          fontSize: 16,
                          fontFamily: preventionTheme.typography.family.medium,
                          flex: 1,
                        }}
                      >
                        {option.label}
                      </Text>

                      {selectedGender === option.id && (
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                activeOpacity={0.85}
                className="h-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: "#DCE8EF",
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    color: "#2F80ED",
                    fontSize: 16,
                    fontFamily: preventionTheme.typography.family.medium,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </OnboardingSwipeView>
    </SafeAreaView>
  );
}
