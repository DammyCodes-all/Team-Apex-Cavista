import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/lib/api/config";

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
