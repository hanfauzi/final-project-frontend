"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GeoStatus =
  | "idle"
  | "prompt"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 8000,
};

export function useAutoGeolocate(
  options: PositionOptions = DEFAULT_OPTIONS
) {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const requestedRef = useRef(false);
  const permRef = useRef<PermissionStatus | null>(null);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
        setError(null);
      },
      (err) => {
        setError(err);
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      options
    );
  }, [options]);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    const hasPermissionsAPI =
      typeof navigator.permissions?.query === "function";

    if (hasPermissionsAPI) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((res) => {
          permRef.current = res;
          setStatus(res.state as GeoStatus);

          if (res.state === "granted" || res.state === "prompt") {
            request();
          }

          res.onchange = () => {
            const next = (res.state as "granted" | "prompt" | "denied");
            setStatus(next as GeoStatus);
            if (next === "granted" || next === "prompt") {
              request();
            }
          };
        })
        .catch(() => {
          request();
        });
    } else {
      request();
    }

    return () => {
      if (permRef.current) {
        permRef.current.onchange = null;
      }
    };
  }, [request]);

  return { status, coords, error, request };
}
