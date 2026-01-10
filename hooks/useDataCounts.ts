"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

interface UseDataCountsParams {
  ids: string[];
  tableName: string;
  columnName: string;
  enabled?: boolean;
}

export const useDataCounts = ({
  ids,
  tableName,
  columnName,
  enabled = true,
}: UseDataCountsParams): UseQueryResult<Record<string, number>, Error> => {
  return useQuery<Record<string, number>, Error>({
    queryKey: ["dataCounts", tableName, columnName, ids],
    queryFn: async () => {
      if (!ids.length) return {};

      try {
        const BATCH_SIZE = 1000;
        const batches: string[][] = [];

        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
          batches.push(ids.slice(i, i + BATCH_SIZE));
        }

        const results = await Promise.all(
          batches.map(async (batch) => {
            const { data, error } = await supabase
              .from(tableName)
              .select(columnName)
              .in(columnName, batch);

            if (error) {
              console.error("Batch query error:", error);
              return [];
            }

            return data || [];
          })
        );

        const allData = results.flat();
        const counts: Record<string, number> = {};

        allData.forEach((record: any) => {
          const key = record[columnName];
          counts[key] = (counts[key] || 0) + 1;
        });

        return counts;
      } catch (error) {
        console.error("Error in useDataCounts:", error);
        return {};
      }
    },
    enabled: enabled && ids.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
