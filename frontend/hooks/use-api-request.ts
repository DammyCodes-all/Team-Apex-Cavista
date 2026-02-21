import { useCallback, useState } from "react";

import { getErrorMessage } from "@/lib/api/client";

type RequestFn<TResponse, TPayload> = (payload?: TPayload) => Promise<TResponse>;

export function useApiRequest<TResponse, TPayload = undefined>(
  requestFn: RequestFn<TResponse, TPayload>,
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (payload?: TPayload): Promise<TResponse> => {
      setLoading(true);
      setError(null);

      try {
        const result = await requestFn(payload);
        setData(result);
        return result;
      } catch (requestError) {
        const message = getErrorMessage(requestError);
        setError(message);
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [requestFn],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
