'use client';
import { useState } from 'react';
import { axiosInstance } from '@/lib/axios';

type ReverseGeoOut = { formatted: string; city: string };

export default function useGetLocationByCoord() {
  const [data, setData] = useState<ReverseGeoOut | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getLocation(lat: number, lng: number) {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get<ReverseGeoOut>('/api/revgeo', {
        params: { lat, lng },
      });
      setData(res.data);
    } finally {
      setIsLoading(false);
    }
  }

  return { getLocation, data, isLoading };
}
