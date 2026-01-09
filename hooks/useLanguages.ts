"use client";

import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "@/lib/supabase/languages";
import { Language } from "@/types/Language";
import { toast } from "sonner";

export const useLanguages = () => {
  return useQuery<Language[], Error>({
    queryKey: ["languages"],
    queryFn: async (): Promise<Language[]> => {
      try {
        return (await getLanguages()) || [];
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load languages";
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
  });
};
