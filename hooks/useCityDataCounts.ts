// hooks/useCityDataCounts.ts
"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

interface UseCityDataCountsParams {
  cityIds: string[];
  enabled?: boolean;
}

export const useCityDataCounts = ({
  cityIds,
  enabled = true,
}: UseCityDataCountsParams): UseQueryResult<Record<string, number>, Error> => {
  return useQuery<Record<string, number>, Error>({
    queryKey: ["cityDataCounts", cityIds],
    queryFn: async () => {
      if (!cityIds.length) return {};

      try {
        const BATCH_SIZE = 1000;
        const batches: string[][] = [];
        
        for (let i = 0; i < cityIds.length; i += BATCH_SIZE) {
          batches.push(cityIds.slice(i, i + BATCH_SIZE));
        }

        console.log(`Fetching data for ${cityIds.length} cities in ${batches.length} batches`);

        const results = await Promise.all(
          batches.map(async (batch) => {
            const { data, error } = await supabase
              .from("price_reports")
              .select("city_id")
              .in("city_id", batch);

            if (error) {
              console.error("Batch query error:", error);
              return [];
            }

            return data || [];
          })
        );

        const allData = results.flat();
        const counts: Record<string, number> = {};
        
        allData.forEach((report: any) => {
          counts[report.city_id] = (counts[report.city_id] || 0) + 1;
        });

        console.log(`Found ${Object.keys(counts).length} cities with data`);
        return counts;
      } catch (error) {
        console.error("Error in useCityDataCounts:", error);
        return {};
      }
    },
    enabled: enabled && cityIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};