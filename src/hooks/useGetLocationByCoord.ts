// hooks/useGetLocationByCoord.ts
'use client';
import { useState, useCallback } from 'react';
import { axiosInstance } from '@/lib/axios';

export type ReverseGeoOut = { formatted: string; city: string };

export default function useGetLocationByCoord() {
  const [data, setData] = useState<ReverseGeoOut | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLocation = useCallback(async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&key=9e064033ccf240d5bc85a4653d8af37d`
      );

const first = res.data?.results?.[0];
const comps = first?.components ?? {};

const city =
  comps.city ||
  comps.town ||
  comps.village ||
  comps.municipality ||
  comps.suburb ||
  comps.county ||
  comps.state ||
  comps.country ||
  "";

const primaryRoad =
  comps.road ||
  comps.pedestrian ||
  comps.cycleway ||
  comps.footway ||
  comps.path ||
  comps.neighbourhood ||
  comps.suburb ||
  "";

let addressLine = first?.formatted ?? "";

if (primaryRoad && /^unnamed/i.test(primaryRoad)) {
  addressLine =
    [comps.neighbourhood, comps.suburb, comps.city || comps.town || comps.village]
      .filter(Boolean)
      .join(", ") || addressLine;
} else if (primaryRoad) {
  addressLine = [primaryRoad, comps.house_number, comps.postcode]
    .filter(Boolean)
    .join(" ");
}

setData({
  formatted: addressLine || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
  city,
});
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getLocation, data, isLoading };
}
