"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  createPriceReport,
  getPriceReportsByCity,
  getAveragePrices,
  getPriceReportsByState,
} from "@/lib/supabase/price-reports";
import { toast } from "sonner";
import { PriceReport, PriceCategory } from "@/types/PriceReports";

const baseQueryOptions = {
  retry: 1,
  staleTime: 2 * 60 * 1000,
};

export const usePriceReportsByCity = (
  cityId: string,
  category?: PriceCategory
): UseQueryResult<PriceReport[], Error> => {
  return useQuery<PriceReport[], Error>({
    queryKey: ["priceReports", cityId, category],
    queryFn: async () => {
      try {
        return await getPriceReportsByCity(cityId, category);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load price reports";
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!cityId,
    ...baseQueryOptions,
  });
};

export const usePriceReportsByState = (
  stateId: string,
  category?: PriceCategory
): UseQueryResult<PriceReport[], Error> => {
  return useQuery<PriceReport[], Error>({
    queryKey: ["priceReportsByState", stateId, category],
    queryFn: async () => {
      try {
        return await getPriceReportsByState(stateId, category);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load price reports by state";
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!stateId,
    ...baseQueryOptions,
  });
};

export const useAveragePrices = (
  cityId: string,
  category: PriceCategory
): UseQueryResult<
  { average: number; min: number; max: number; count: number } | null,
  Error
> => {
  return useQuery({
    queryKey: ["averagePrices", cityId, category],
    queryFn: async () => {
      try {
        return await getAveragePrices(cityId, category);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load average prices";
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!cityId && !!category,
    ...baseQueryOptions,
  });
};

export const useCreatePriceReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cityId,
      stateId,
      category,
      data,
    }: {
      cityId: string;
      stateId: string;
      category: PriceCategory;
      data: any;
    }) => {
      return await createPriceReport(cityId, stateId, category, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["priceReports", variables.cityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["averagePrices", variables.cityId, variables.category],
      });
      toast.success("Price report submitted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit price report";
      toast.error(errorMessage);
    },
  });
};

export const usePriceCategoryCounts = (cityId: string) => {
  return useQuery({
    queryKey: ["priceCategoryCounts", cityId],
    queryFn: async () => {
      try {
        const categories: PriceCategory[] = [
          "rent",
          "beer",
          "cappuccino",
          "salary",
        ];
        const counts = await Promise.all(
          categories.map(async (category) => {
            const data = await getPriceReportsByCity(cityId, category);
            return { category, count: data.length };
          })
        );
        return counts;
      } catch (error) {
        toast.error("Failed to load category counts");
        throw error;
      }
    },
    enabled: !!cityId,
    ...baseQueryOptions,
  });
};
