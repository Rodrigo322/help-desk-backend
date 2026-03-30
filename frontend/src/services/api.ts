import axios, { AxiosError } from "axios";

import { ApiResponse } from "../types/api";
import { getAuthToken } from "../utils/storage";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333/v1";

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function unwrapApiResponse<T>(payload: ApiResponse<T>): T {
  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { error?: { message?: string } } | undefined)?.error
      ?.message;

    if (message) {
      return message;
    }

    return "Erro de comunicação com a API.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido.";
}

