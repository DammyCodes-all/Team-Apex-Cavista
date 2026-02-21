import { Text, View } from "react-native";

type OnboardingStepDotsProps = {
  step: number;
  totalSteps?: number;
  showLabel?: boolean;
  labelColor?: string;
  labelFontFamily?: string;
  labelFontSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  activeSize?: number;
  inactiveSize?: number;
  gap?: number;
};

export function OnboardingStepDots({
  step,
  totalSteps = 5,
  showLabel = true,
  labelColor = "#5C6875",
  labelFontFamily,
  labelFontSize = 22,
  activeColor = "#6EC1E4",
  inactiveColor = "#90A5B5",
  activeSize = 16,
  inactiveSize = 8,
  gap = 10,
}: OnboardingStepDotsProps) {
  const safeStep = Math.min(Math.max(step, 1), totalSteps);

  return (
    <View className="items-center">
      {showLabel ? (
        <Text
          style={{
            color: labelColor,
            fontSize: labelFontSize,
            fontFamily: labelFontFamily,
          }}
        >
          Step {safeStep} of {totalSteps}
        </Text>
      ) : null}

      <View className="mt-s flex-row items-center" style={{ gap }}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const dotStep = index + 1;
          const isActive = dotStep === safeStep;
          const dotSize = isActive ? activeSize : inactiveSize;

          return (
            <View
              key={dotStep}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: isActive ? activeColor : inactiveColor,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
