"use client";

import { useDataCounts } from "./useDataCounts";

interface UseStateDataCountsParams {
  stateIds: string[];
  enabled?: boolean;
}

export const useStateDataCounts = ({
  stateIds,
  enabled = true,
}: UseStateDataCountsParams) =>
  useDataCounts({
    ids: stateIds,
    tableName: "price_reports",
    columnName: "state_id",
    enabled,
  });
