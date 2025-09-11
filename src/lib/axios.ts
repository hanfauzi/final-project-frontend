// src/lib/axios.ts
"use client";

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { useAuthStore } from "@/stores/auth";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipRedirect401?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
});

function isAxiosHeaders(h: InternalAxiosRequestConfig["headers"]): h is AxiosHeaders {
  return !!h && typeof (h as AxiosHeaders).set === "function";
}

function guessLoginPath(): string {
  const principal = useAuthStore.getState().getPrincipal?.(); 
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const looksEmployeePath = /^\/(employee|admin|driver|worker|staff)(\/|$)/i.test(pathname);

  if (principal === "EMPLOYEE" || looksEmployeePath) {
    return "/employee/login";
  }
  return "/customer/login";
}

function isOnLoginPage(pathname: string): boolean {
  return /^\/(customer|employee)\/login(\/|$)?/i.test(pathname);
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) return config;

    const token = useAuthStore.getState().getToken?.();
    if (!token) return config;

    const headers = isAxiosHeaders(config.headers)
      ? config.headers
      : AxiosHeaders.from(config.headers ?? {});

    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && !error.config?.skipRedirect401) {
      try {
        useAuthStore.getState().clearAuth?.();
      } catch {}

      if (typeof window !== "undefined") {
        const here = window.location.pathname + window.location.search;
        const loginPath = guessLoginPath();

        if (!isOnLoginPage(window.location.pathname)) {
          window.location.replace(`${loginPath}?next=${encodeURIComponent(here)}`);
        }
      }
    }

    return Promise.reject(error);
  }
);
