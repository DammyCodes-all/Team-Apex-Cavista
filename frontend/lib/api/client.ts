import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/lib/api/config";

const AUTH_TOKEN_KEY = "@team-axle-cavista/auth-token";

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
export async function setAuthToken(token: string | null): Promise<void> {
  if (token) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

// Request interceptor: attach Bearer token from storage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Silently fail if token retrieval fails
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Refresh deduplication
let refreshPromise: Promise<void> | null = null;

// Response interceptor: auto-refresh on 401/403, retry with new token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Skip refresh logic for refresh endpoint itself and non-401/403 errors
    if (
      (status !== 401 && status !== 403) ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    // Mark as already retried to prevent infinite loops
    if ((originalRequest as Record<string, unknown>)?._retry) {
      return Promise.reject(error);
    }

    (originalRequest as Record<string, unknown>)._retry = true;

    try {
      // Prevent multiple simultaneous refresh requests
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const response = await apiClient.post<{
              access_token?: string;
              token?: string;
            }>("/auth/refresh");
            // Store the new token from refresh response
            const newToken =
              response.data?.access_token || response.data?.token;
            if (newToken) {
              await setAuthToken(newToken);
            }
          } finally {
            refreshPromise = null;
          }
        })();
      }

      await refreshPromise;

      // Retry original request with refreshed token
      return apiClient(originalRequest);
    } catch {
      // Clear token on refresh failure
      await setAuthToken(null);
      return Promise.reject(error);
    }
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const responseMessage = axiosError.response?.data?.message;
    const responseError = axiosError.response?.data?.error;

    return (
      responseMessage ?? responseError ?? axiosError.message ?? "Request failed"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
};

export async function request<TResponse, TBody = unknown>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.request<TResponse>({
    ...config,
    method,
    url,
    data,
  });

  return response.data;
}

export function get<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse>("get", url, undefined, config);
}

export function post<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse, TBody>("post", url, body, config);
}

export function put<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse, TBody>("put", url, body, config);
}

export function patch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse, TBody>("patch", url, body, config);
}

export function remove<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse, TBody>("delete", url, body, config);
}
