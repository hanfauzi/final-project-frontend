"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth";

function parseJwt(token?: string) {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function useAutoLogout() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const token = useAuthStore((s) => s.getToken());
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!token) return;

    const payload = parseJwt(token);
    const expSec: number | undefined = payload?.exp;
    if (!expSec) return;

    const expMs = expSec * 1000;
    const now = Date.now();

    if (expMs <= now) {
      clearAuth();
      window.location.href = "/customer/login?reason=expired";
      return;
    }

    const delay = Math.max(expMs - now - 5000, 0);
    timerRef.current = window.setTimeout(() => {
      clearAuth();
      window.location.href = "/customer/login?reason=expired";
    }, delay);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isHydrated, token, clearAuth]);
}
