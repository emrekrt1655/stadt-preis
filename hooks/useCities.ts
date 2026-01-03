"use client";

import { useQuery } from "@tanstack/react-query";
import { getCitiesByCountry, getCitiesByState } from "@/lib/supabase/cities";
import { toast } from "sonner";
import { City } from "@/types/City";

export const useCitiesByCountry = (countryCode: string, langCode: string) => {
  return useQuery<City[]>({
    queryKey: ["citiesByCountry", countryCode, langCode],
    queryFn: async (): Promise<City[]> => {
      try {
        return await getCitiesByCountry(countryCode, langCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load cities";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!countryCode && !!langCode,
  });
};

export const useCitiesByState = (stateId: string, langCode: string) => {
  return useQuery<City[]>({
    queryKey: ["citiesByState", stateId, langCode],
    queryFn: async (): Promise<City[]> => {
      try {
        return await getCitiesByState(stateId, langCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load cities";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!stateId && !!langCode,
  });
};
