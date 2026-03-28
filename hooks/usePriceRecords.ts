"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  createPriceRecord,
  getPriceRecordsByCity,
  getAveragePrices,
  getPriceRecordsByState,
} from "@/lib/supabase/price-records";
import { toast } from "sonner";
import {
  PriceRecord,
  PriceCategory,
  CreatePriceRecordInput,
} from "@/types/PriceRecords";

const baseQueryOptions = {
  retry: 1,
  staleTime: 2 * 60 * 1000,
};

export const usePriceReportsByCity = (
  cityId: string,
  category?: PriceCategory,
): UseQueryResult<PriceRecord[], Error> => {
  return useQuery<PriceRecord[], Error>({
    queryKey: ["priceRecords", cityId, category],
    queryFn: async () => {
      try {
        return await getPriceRecordsByCity(cityId, category);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load price records by city";
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!cityId,
    ...baseQueryOptions,
  });
};

export const usePriceRecordsByState = (
  stateId: string,
  category?: PriceCategory,
): UseQueryResult<PriceRecord[], Error> => {
  return useQuery<PriceRecord[], Error>({
    queryKey: ["priceRecordsByState", stateId, category],
    queryFn: async () => {
      try {
        return await getPriceRecordsByState(stateId, category);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load price records by state";
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
  category: PriceCategory,
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

export const useCreatePriceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cityId,
      stateId,
      countryId,
      category,
      data,
    }: {
      cityId: string;
      stateId: string;
      countryId: string;
      category: PriceCategory;
      data: CreatePriceRecordInput;
    }) => {
      return await createPriceRecord(
        cityId,
        stateId,
        countryId,
        category,
        data,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["priceRecords", variables.cityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["averagePrices", variables.cityId, variables.category],
      });
      queryClient.invalidateQueries({
        queryKey: ["priceCategoryCounts", variables.cityId],
      });
      toast.success("Price record submitted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit price record";
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
          "doener",
          "cappuccino",
          "salary",
        ];
        const counts = await Promise.all(
          categories.map(async (category) => {
            const data = await getPriceRecordsByCity(cityId, category);
            return { category, count: data.length };
          }),
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
