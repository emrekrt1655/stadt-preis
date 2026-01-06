"use client";

import { useStates } from "@/hooks/useStates";
import { useCountries } from "@/hooks/useCountries";
import { useParams } from "next/navigation";
import { useSelectedCountry } from "@/hooks/useSelectedCountry";
import { Loader2, AlertCircle } from "lucide-react";
import GermanyMap from "./GermanyMap";
import StateInfoPanel from "./InfoPanel";
import { toast } from "sonner";

export default function Hero() {
  const params = useParams();
  const locale = params.locale as string;

  const {
    data: countries,
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useCountries(locale);

  const { selectedCountryCode } = useSelectedCountry(countries || []);

  const {
    data: states,
    isLoading: isStatesLoading,
    isError: isStatesError,
  } = useStates(selectedCountryCode, locale);

  if (isStatesLoading || isCountriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-75">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (isStatesError || isCountriesError) {
    toast.error("Failed to load data");
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
      </div>
    );
  }

  if (states?.length === 0) {
    toast.error("No states found for the selected country");
    return null;
  }

  return (
    <section className="space-y-10">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div className="flex-1 w-full">
          <StateInfoPanel />
        </div>
        <div className="flex-1 w-full">
          <GermanyMap locale={locale} states={states!} />
        </div>
      </div>
    </section>
  );
}
