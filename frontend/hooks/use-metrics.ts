import { useEffect, useState } from "react";
import { get } from "@/lib/api/client";

export interface MetricsResponse {
  user_id: string;
  date: string;
  steps: number;
  sleep_duration_minutes: number;
  sedentary_minutes: number;
  location_diversity_score: number;
  active_minutes: number;
  screen_time_minutes: number;
  created_at: string;
  updated_at: string;
  deviation_flags: Record<string, boolean>;
  risk_score: number;
}

export function useMetrics(date: string) {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get<MetricsResponse>(`/metrics/${date}`);
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch metrics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [date]);

  return { data, loading, error };
}
