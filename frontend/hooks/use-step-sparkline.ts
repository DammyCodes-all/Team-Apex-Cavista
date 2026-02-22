import { useMemo } from "react";

interface ActivityBar {
  h: number;
  active: boolean;
}

export interface StepSparklineResult {
  /** 12 data points (pairs of hours summed: 0-1, 2-3, ... 22-23) */
  sparkline: number[];
  /** Percentage trend: positive = up vs earlier today window, negative = down */
  trend: number;
  /** Hourly buckets reshaped into ActivityBar[] for the bar chart */
  activityBars: ActivityBar[];
}

/**
 * Derives sparkline, trend and activity-bar data from the raw 24-slot
 * hourly step buckets produced by `useStepCounter`.
 */
export function useStepSparkline(
  hourlyBuckets: number[],
  totalSteps: number,
): StepSparklineResult {
  return useMemo(() => {
    // --- Sparkline: downsample 24 buckets → 12 points (sum pairs of hours) ---
    const sparkline: number[] = [];
    for (let i = 0; i < 24; i += 2) {
      sparkline.push((hourlyBuckets[i] ?? 0) + (hourlyBuckets[i + 1] ?? 0));
    }

    // --- Trend: compare first half of day so far vs second half ---
    // Simple approach: % of steps in the later half of elapsed hours
    const currentHour = new Date().getHours();
    if (currentHour <= 1 || totalSteps === 0) {
      // Not enough data to compute a meaningful trend
      return { sparkline, trend: 0, activityBars: buildBars(hourlyBuckets) };
    }

    const midpoint = Math.floor(currentHour / 2);
    let firstHalfSteps = 0;
    let secondHalfSteps = 0;
    for (let h = 0; h < currentHour; h++) {
      if (h < midpoint) firstHalfSteps += hourlyBuckets[h] ?? 0;
      else secondHalfSteps += hourlyBuckets[h] ?? 0;
    }

    let trend = 0;
    if (firstHalfSteps > 0) {
      trend = Math.round(
        ((secondHalfSteps - firstHalfSteps) / firstHalfSteps) * 100,
      );
    } else if (secondHalfSteps > 0) {
      trend = 100; // went from zero to something
    }

    return {
      sparkline,
      trend,
      activityBars: buildBars(hourlyBuckets),
    };
  }, [hourlyBuckets, totalSteps]);
}

/** Convert 24 hourly buckets into ActivityBar[] (normalised 0–100). */
function buildBars(hourlyBuckets: number[]): ActivityBar[] {
  // Use the most recent 7 two-hour windows up to the current hour
  const currentHour = new Date().getHours();
  const windowEnd = Math.min(Math.ceil((currentHour + 1) / 2), 12); // 0-12 windows
  const windowStart = Math.max(windowEnd - 7, 0);

  const windows: number[] = [];
  for (let i = windowStart; i < windowEnd; i++) {
    const h1 = i * 2;
    const h2 = h1 + 1;
    windows.push((hourlyBuckets[h1] ?? 0) + (hourlyBuckets[h2] ?? 0));
  }

  // Pad to 7 bars if we have fewer
  while (windows.length < 7) {
    windows.unshift(0);
  }

  const maxVal = Math.max(...windows, 1);
  const sorted = [...windows].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;

  return windows.map((value) => ({
    h: Math.round((value / maxVal) * 100),
    active: value > median,
  }));
}
