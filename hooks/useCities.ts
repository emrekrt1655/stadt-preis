"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCities } from "@/lib/supabase/cities";
import { City } from "@/types/City";

export const useCities = (langCode: string) => {
  const query = useQuery<City[], Error>({
    queryKey: ["cities", langCode],
    queryFn: async (): Promise<City[]> => {
      try {
        return await getCities(langCode);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load cities";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
  });

  return query;
};
