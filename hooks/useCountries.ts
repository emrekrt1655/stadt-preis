"use client";

import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/lib/supabase/countries";
import { Country } from "@/types/Country";
import { toast } from "sonner";

export const useCountries = (langCode: string) => {
  return useQuery<Country[], Error>({
    queryKey: ["countries", langCode],
    queryFn: async (): Promise<Country[]> => {
      try {
        return await getCountries(langCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load countries";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
  });
};
