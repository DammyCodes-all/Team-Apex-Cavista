import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { preventionTheme } from "@/constants/tokens";
import { usePedometerStore } from "@/stores/pedometer-store";

export default function PedometerTestScreen() {
  const colors = preventionTheme.colors.light;
  const {
    isChecking,
    isAvailable,
    permissionState,
    todaySteps,
    liveSteps,
    error,
    init,
    refreshTodaySteps,
    stopLiveUpdates,
  } = usePedometerStore();

  useEffect(() => {
    init();
    return () => {
      stopLiveUpdates();
    };
  }, [init, stopLiveUpdates]);

  const statusText = useMemo(() => {
    if (!isAvailable) {
      return "Pedometer unavailable (use a physical phone)";
    }

    if (permissionState === "denied") {
      return "Motion permission denied";
    }

    if (permissionState === "granted") {
      return "Tracking active";
    }

    return "Checking permissions...";
  }, [isAvailable, permissionState]);

  const helperText = useMemo(() => {
    if (!isAvailable) {
      return "Pedometer is not supported in most simulators/emulators. Test on a real device.";
    }

    if (permissionState === "denied") {
      if (Platform.OS === "ios") {
        return "Enable Motion & Fitness permission in iOS Settings for this app, then reopen the app.";
      }

      return "Enable Physical Activity permission in Android Settings for this app, then reopen the app.";
    }

    return "";
  }, [isAvailable, permissionState]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 16,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          color: colors.textPrimary,
          fontFamily: preventionTheme.typography.family.bold,
        }}
      >
        Pedometer Test
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.textSecondary,
          fontFamily: preventionTheme.typography.family.body,
        }}
      >
        {statusText}
      </Text>
      {helperText ? (
        <Text
          style={{
            fontSize: 13,
            color: colors.textSecondary,
            fontFamily: preventionTheme.typography.family.body,
            textAlign: "center",
            maxWidth: 420,
          }}
        >
          {helperText}
        </Text>
      ) : null}

      {isChecking ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: colors.card,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: 12,
              padding: 16,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: colors.textPrimary,
                fontFamily: preventionTheme.typography.family.medium,
              }}
            >
              Today steps: {todaySteps}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors.textPrimary,
                fontFamily: preventionTheme.typography.family.medium,
              }}
            >
              Live update steps: +{liveSteps}
            </Text>

            <TouchableOpacity
              onPress={refreshTodaySteps}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: preventionTheme.typography.family.medium,
                }}
              >
                Refresh Today Count
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={init}
            style={{
              borderColor: colors.primary,
              borderWidth: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontFamily: preventionTheme.typography.family.medium,
              }}
            >
              Retry Permissions
            </Text>
          </TouchableOpacity>
        </>
      )}

      {error ? (
        <Text
          style={{
            color: colors.error,
            fontFamily: preventionTheme.typography.family.body,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
