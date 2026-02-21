import { useMemo, type ReactNode } from "react";
import { type Href, router } from "expo-router";
import { PanResponder, View } from "react-native";

type OnboardingSwipeViewProps = {
  step: number;
  totalSteps?: number;
  children: ReactNode;
};

const SWIPE_DISTANCE = 64;
const SWIPE_VELOCITY = 0.35;

export function OnboardingSwipeView({
  step,
  totalSteps = 5,
  children,
}: OnboardingSwipeViewProps) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const horizontalDistance = Math.abs(gestureState.dx);
          const verticalDistance = Math.abs(gestureState.dy);

          return (
            horizontalDistance > 18 &&
            horizontalDistance > verticalDistance &&
            verticalDistance < 22
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          const isSwipeLeft =
            gestureState.dx <= -SWIPE_DISTANCE || gestureState.vx <= -SWIPE_VELOCITY;
          const isSwipeRight =
            gestureState.dx >= SWIPE_DISTANCE || gestureState.vx >= SWIPE_VELOCITY;

          if (isSwipeLeft && step < totalSteps) {
            router.push(`/onboarding/step-${step + 1}` as Href);
            return;
          }

          if (isSwipeRight && step > 1) {
            router.push(`/onboarding/step-${step - 1}` as Href);
          }
        },
      }),
    [step, totalSteps],
  );

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}