"use client";

import { useQuery } from "@tanstack/react-query";
import { getStateById, getStates } from "@/lib/supabase/states";
import { toast } from "sonner";
import { State } from "@/types/State";

export const useStates = (countryCode: string, langCode: string) => {
  return useQuery<State[], Error>({
    queryKey: ["states", countryCode, langCode],
    queryFn: async (): Promise<State[]> => {
      try {
        return await getStates(countryCode, langCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load states";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!countryCode && !!langCode,
  });
};

export const useStateById = (stateId: string, langCode: string) => {
  return useQuery<State, Error>({
    queryKey: ["state", stateId, langCode],
    queryFn: async (): Promise<State> => {
      try {
        return await getStateById(stateId, langCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load state";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    enabled: !!stateId && !!langCode,
  });
};
