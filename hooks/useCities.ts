"use client";

import { useQuery } from "@tanstack/react-query";
import { getCitiesByCountry, getCitiesByState, getCityById } from "@/lib/supabase/cities";
import { toast } from "sonner";
import { City } from "@/types/City";

export const useCitiesByCountry = (countryCode: string) => {
  return useQuery<City[], Error>({
    queryKey: ["citiesByCountry", countryCode],
    queryFn: async (): Promise<City[]> => {
      try {
        return await getCitiesByCountry(countryCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load cities";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!countryCode,
  });
};

export const useCitiesByState = (stateId: string) => {
  return useQuery<City[], Error>({
    queryKey: ["citiesByState", stateId],
    queryFn: async (): Promise<City[]> => {
      try {
        return await getCitiesByState(stateId);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load cities";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!stateId,
  });
};

export const useCityById = (cityId: string) => {
  return useQuery<City, Error>({
    queryKey: ["city", cityId],
    queryFn: async (): Promise<City> => {
      try {
        return await getCityById(cityId);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load city";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!cityId,
  });
};