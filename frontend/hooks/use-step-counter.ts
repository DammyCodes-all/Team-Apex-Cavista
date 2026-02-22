import { useEffect, useRef, useState, useCallback } from "react";
import { Accelerometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, type AppStateStatus } from "react-native";

const STORAGE_KEY = "step_counter_data";
const MAGNITUDE_THRESHOLD = 1.18; // g-force threshold for a step
const MIN_STEP_INTERVAL_MS = 350; // minimum ms between steps (~170 BPM max)
const PERSIST_EVERY_N_STEPS = 5; // persist to AsyncStorage every N steps
const UPDATE_INTERVAL_MS = 20; // ~50Hz sampling rate

interface StoredStepData {
  date: string; // YYYY-MM-DD
  hourlyBuckets: number[]; // 24 slots, one per hour
  totalSteps: number;
}

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getCurrentHour(): number {
  return new Date().getHours();
}

function emptyBuckets(): number[] {
  return Array(24).fill(0);
}

/**
 * Low-pass filter coefficient for smoothing accelerometer magnitude.
 * Higher values = more smoothing, slower response.
 */
const SMOOTHING_ALPHA = 0.15;

export interface StepCounterResult {
  totalSteps: number;
  hourlyBuckets: number[];
  isAvailable: boolean;
  isTracking: boolean;
}

export function useStepCounter(): StepCounterResult {
  const [totalSteps, setTotalSteps] = useState(0);
  const [hourlyBuckets, setHourlyBuckets] = useState<number[]>(emptyBuckets());
  const [isAvailable, setIsAvailable] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Refs for the step detection algorithm (avoid re-renders on every sample)
  const lastStepTimeRef = useRef(0);
  const smoothedMagnitudeRef = useRef(9.81); // ~1g at rest
  const stepCountRef = useRef(0);
  const bucketsRef = useRef<number[]>(emptyBuckets());
  const persistCounterRef = useRef(0);
  const prevMagnitudeRef = useRef(9.81);
  const risingRef = useRef(false);

  // Load persisted data on mount
  const loadPersistedData = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredStepData = JSON.parse(raw);
        if (stored.date === getTodayKey()) {
          setTotalSteps(stored.totalSteps);
          setHourlyBuckets([...stored.hourlyBuckets]);
          stepCountRef.current = stored.totalSteps;
          bucketsRef.current = [...stored.hourlyBuckets];
        }
        // If it's a different day, we start fresh (zeros)
      }
    } catch {
      // If loading fails, start fresh
    }
  }, []);

  const persistData = useCallback(async () => {
    try {
      const data: StoredStepData = {
        date: getTodayKey(),
        hourlyBuckets: bucketsRef.current,
        totalSteps: stepCountRef.current,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Best-effort persistence
    }
  }, []);

  // Record a single step
  const recordStep = useCallback(() => {
    const hour = getCurrentHour();
    stepCountRef.current += 1;
    bucketsRef.current[hour] += 1;

    // Update React state
    setTotalSteps(stepCountRef.current);
    setHourlyBuckets([...bucketsRef.current]);

    // Persist periodically
    persistCounterRef.current += 1;
    if (persistCounterRef.current >= PERSIST_EVERY_N_STEPS) {
      persistCounterRef.current = 0;
      persistData();
    }
  }, [persistData]);

  // Process a single accelerometer sample
  const processAccelSample = useCallback(
    ({ x, y, z }: { x: number; y: number; z: number }) => {
      // Compute acceleration magnitude in m/s² (expo-sensors gives values in g's)
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Apply low-pass filter for smoothing
      const smoothed =
        SMOOTHING_ALPHA * magnitude +
        (1 - SMOOTHING_ALPHA) * smoothedMagnitudeRef.current;
      smoothedMagnitudeRef.current = smoothed;

      const now = Date.now();
      const prevMag = prevMagnitudeRef.current;
      const wasRising = risingRef.current;

      // Detect rising → falling transition (peak) above threshold
      const isRising = smoothed > prevMag;
      risingRef.current = isRising;
      prevMagnitudeRef.current = smoothed;

      // A step is a peak (was rising, now falling) above the threshold
      // with minimum time interval between steps
      if (
        wasRising &&
        !isRising &&
        smoothed > MAGNITUDE_THRESHOLD &&
        now - lastStepTimeRef.current > MIN_STEP_INTERVAL_MS
      ) {
        lastStepTimeRef.current = now;
        recordStep();
      }
    },
    [recordStep],
  );

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;

    const setup = async () => {
      // Load any existing data for today
      await loadPersistedData();

      // Check if accelerometer is available
      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(available);

      if (!available) return;

      // Set sampling rate
      Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);

      // Start listening
      subscription = Accelerometer.addListener(processAccelSample);
      setIsTracking(true);
    };

    setup();

    // Handle app state changes: persist when going to background
    const appStateListener = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "background" || nextState === "inactive") {
          persistData();
        }
      },
    );

    return () => {
      subscription?.remove();
      appStateListener.remove();
      setIsTracking(false);
      // Final persist on cleanup
      persistData();
    };
  }, [loadPersistedData, processAccelSample, persistData]);

  return {
    totalSteps,
    hourlyBuckets,
    isAvailable,
    isTracking,
  };
}
