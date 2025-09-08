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
        comps.county ||
        comps.state ||
        comps.country ||
        '';

      setData({
        formatted: first?.formatted ?? '',
        city,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getLocation, data, isLoading };
}
