import { useCallback } from "react";
import { AxiosRequestConfig } from "axios";

import { get, patch, post, put, remove } from "@/lib/api/client";
import { useApiRequest } from "@/hooks/use-api-request";

export function useGet<TResponse>(
  endpoint: string,
  config?: AxiosRequestConfig,
) {
  const requestFn = useCallback(
    (requestConfig?: AxiosRequestConfig) =>
      get<TResponse>(endpoint, requestConfig ?? config),
    [endpoint, config],
  );

  return useApiRequest<TResponse, AxiosRequestConfig | undefined>(requestFn);
}

export function usePost<TResponse, TBody = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
) {
  const requestFn = useCallback(
    (body?: TBody) => post<TResponse, TBody>(endpoint, body, config),
    [endpoint, config],
  );

  return useApiRequest<TResponse, TBody>(requestFn);
}

export function usePut<TResponse, TBody = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
) {
  const requestFn = useCallback(
    (body?: TBody) => put<TResponse, TBody>(endpoint, body, config),
    [endpoint, config],
  );

  return useApiRequest<TResponse, TBody>(requestFn);
}

export function usePatch<TResponse, TBody = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
) {
  const requestFn = useCallback(
    (body?: TBody) => patch<TResponse, TBody>(endpoint, body, config),
    [endpoint, config],
  );

  return useApiRequest<TResponse, TBody>(requestFn);
}

export function useDelete<TResponse, TBody = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
) {
  const requestFn = useCallback(
    (body?: TBody) => remove<TResponse, TBody>(endpoint, body, config),
    [endpoint, config],
  );

  return useApiRequest<TResponse, TBody>(requestFn);
}
