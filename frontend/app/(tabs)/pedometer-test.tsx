import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Pedometer } from "expo-sensors";

import { preventionTheme } from "@/constants/tokens";

type PermissionState = "unknown" | "granted" | "denied";

export default function PedometerTestScreen() {
  const colors = preventionTheme.colors.light;
  const [isChecking, setIsChecking] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("unknown");
  const [todaySteps, setTodaySteps] = useState(0);
  const [liveSteps, setLiveSteps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refreshTodaySteps = useCallback(async () => {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      const result = await Pedometer.getStepCountAsync(start, end);
      setTodaySteps(result.steps ?? 0);
    } catch {
      setError("Could not load today's steps on this device.");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let subscription: { remove: () => void } | null = null;

    const setupPedometer = async () => {
      setIsChecking(true);
      setError(null);

      try {
        const available = await Pedometer.isAvailableAsync();
        if (!isMounted) {
          return;
        }

        setIsAvailable(available);

        if (!available) {
          setPermissionState("unknown");
          return;
        }

        const currentPermission = await Pedometer.getPermissionsAsync();
        let finalStatus = currentPermission.status;

        if (finalStatus !== "granted") {
          const requestedPermission = await Pedometer.requestPermissionsAsync();
          finalStatus = requestedPermission.status;
        }

        if (!isMounted) {
          return;
        }

        const nextPermissionState: PermissionState =
          finalStatus === "granted" ? "granted" : "denied";

        setPermissionState(nextPermissionState);

        if (nextPermissionState !== "granted") {
          return;
        }

        await refreshTodaySteps();

        subscription = Pedometer.watchStepCount((result) => {
          if (!isMounted) {
            return;
          }

          setLiveSteps(result.steps ?? 0);
        });
      } catch {
        if (isMounted) {
          setError("Pedometer setup failed.");
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    setupPedometer();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [refreshTodaySteps, retryKey]);

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
            onPress={() => setRetryKey((previous) => previous + 1)}
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
