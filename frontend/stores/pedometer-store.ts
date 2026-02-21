import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PermissionState = "unknown" | "granted" | "denied";

type PedometerStore = {
  isChecking: boolean;
  isAvailable: boolean;
  permissionState: PermissionState;
  todaySteps: number;
  liveSteps: number;
  lastUpdated: number | null;
  error: string | null;
  init: () => Promise<void>;
  refreshTodaySteps: () => Promise<void>;
  startLiveUpdates: () => void;
  stopLiveUpdates: () => void;
  clearError: () => void;
};

let liveSubscription: { remove: () => void } | null = null;

const startOfToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

export const usePedometerStore = create<PedometerStore>()(
  persist(
    (set, get) => ({
      isChecking: false,
      isAvailable: false,
      permissionState: "unknown",
      todaySteps: 0,
      liveSteps: 0,
      lastUpdated: null,
      error: null,
      init: async () => {
        set({ isChecking: true, error: null });

        try {
          const available = await Pedometer.isAvailableAsync();
          if (!available) {
            set({ isAvailable: false, permissionState: "unknown" });
            get().stopLiveUpdates();
            return;
          }

          set({ isAvailable: true });

          const currentPermission = await Pedometer.getPermissionsAsync();
          let finalStatus = currentPermission.status;

          if (finalStatus !== "granted") {
            const requestedPermission =
              await Pedometer.requestPermissionsAsync();
            finalStatus = requestedPermission.status;
          }

          const nextPermissionState: PermissionState =
            finalStatus === "granted" ? "granted" : "denied";

          set({ permissionState: nextPermissionState });

          if (nextPermissionState !== "granted") {
            get().stopLiveUpdates();
            return;
          }

          await get().refreshTodaySteps();
          get().startLiveUpdates();
        } catch {
          set({ error: "Pedometer setup failed." });
        } finally {
          set({ isChecking: false });
        }
      },
      refreshTodaySteps: async () => {
        const { isAvailable, permissionState } = get();

        if (!isAvailable || permissionState !== "granted") {
          return;
        }

        set({ error: null });

        try {
          const result = await Pedometer.getStepCountAsync(
            startOfToday(),
            new Date(),
          );
          set({
            todaySteps: result.steps ?? 0,
            lastUpdated: Date.now(),
          });
        } catch {
          set({ error: "Could not load today's steps on this device." });
        }
      },
      startLiveUpdates: () => {
        const { permissionState } = get();

        if (permissionState !== "granted") {
          return;
        }

        liveSubscription?.remove();
        liveSubscription = Pedometer.watchStepCount((result) => {
          set({ liveSteps: result.steps ?? 0 });
        });
      },
      stopLiveUpdates: () => {
        liveSubscription?.remove();
        liveSubscription = null;
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "@team-axle-cavista/pedometer",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        todaySteps: state.todaySteps,
        liveSteps: state.liveSteps,
        lastUpdated: state.lastUpdated,
        permissionState: state.permissionState,
        isAvailable: state.isAvailable,
      }),
    },
  ),
);
