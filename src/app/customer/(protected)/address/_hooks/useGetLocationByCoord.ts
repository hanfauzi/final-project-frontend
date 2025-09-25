'use client';
import { useState, useCallback } from 'react';
import { axiosInstance } from '@/lib/axios';

export type ReverseGeoOut = { formatted: string; city: string, postcode?: string;};

export default function useGetLocationByCoord() {
  const [data, setData] = useState<ReverseGeoOut | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLocation = useCallback(async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get<ReverseGeoOut>("/api/geocode/reverse", {
        params: { lat, lng },
      });
      setData(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getLocation, data, isLoading };
}