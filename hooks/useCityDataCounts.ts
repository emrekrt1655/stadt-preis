"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useDataCounts } from "./useDataCounts";

interface UseCityDataCountsParams {
  cityIds: string[];
  enabled?: boolean;
}

export const useCityDataCounts = ({
  cityIds,
  enabled = true,
}: UseCityDataCountsParams) =>
  useDataCounts({
    ids: cityIds,
    tableName: "price_reports",
    columnName: "city_id",
    enabled,
  });