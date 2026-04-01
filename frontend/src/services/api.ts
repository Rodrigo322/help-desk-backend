import axios, { AxiosError } from "axios";

import { ApiResponse } from "../types/api";
import { frontendEnvironment } from "../utils/env";
import { getAuthToken } from "../utils/storage";

const rawApiUrl = frontendEnvironment.VITE_API_URL;

if (!rawApiUrl) {
  console.error("[bootstrap] Missing VITE_API_URL. Configure frontend environment variables.");
}

export const apiBaseUrl = (rawApiUrl ?? "").replace(/\/+$/, "");
export const apiPublicBaseUrl = apiBaseUrl.replace(/\/v1\/?$/, "");

let unauthorizedHandler: (() => void) | null = null;

export const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && unauthorizedHandler && getAuthToken()) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export function unwrapApiResponse<T>(payload: ApiResponse<T>): T {
  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      const isOfflineClient = typeof navigator !== "undefined" && navigator.onLine === false;

      if (isOfflineClient) {
        return "Sem conexao com a internet. Verifique sua rede e tente novamente.";
      }

      return "Nao foi possivel conectar ao backend. O servico pode estar fora do ar.";
    }

    const message = (error.response?.data as { error?: { message?: string } } | undefined)?.error
      ?.message;

    if (message) {
      return message;
    }

    if (error.response?.status === 401) {
      return "Sua sessao expirou. Faca login novamente.";
    }

    return "Erro de comunicacao com a API.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido.";
}
