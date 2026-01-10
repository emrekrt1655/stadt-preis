"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCountries } from "@/hooks/useCountries";
import { useSelectedCountry } from "@/hooks/useSelectedCountry";
import { useStates } from "@/hooks/useStates";
import { useStateDataCounts } from "@/hooks/useStateDataCounts";
import { useMemo } from "react";
export default function PopularState() {
  const t = useTranslations("popularState");
  const locale = useLocale();
  const router = useRouter();

  const { data: countries } = useCountries(locale);
  const { selectedCountryCode } = useSelectedCountry(countries || []);
  const { data: states = [] } = useStates(selectedCountryCode, locale);
  const stateIds = useMemo(() => states.map((s) => s.stateId), [states]);
  const { data: stateCounts } = useStateDataCounts({
    stateIds,
    enabled: stateIds.length > 0,
  });

  const sortedStates = useMemo(() => {
    if (!stateCounts || states.length === 0) return [];

    return states
      .filter(
        (state) => stateCounts[state.stateId] && stateCounts[state.stateId] > 0
      )
      .sort((a, b) => {
        const countA = stateCounts[a.stateId] || 0;
        const countB = stateCounts[b.stateId] || 0;
        return countB - countA;
      });
  }, [states, stateCounts]);

  const topThreeStates = useMemo(() => {
    return sortedStates.slice(0, 3);
  }, [sortedStates]);

  const getSizeClass = (index: number) => {
    if (index === 0) return "col-span-2 row-span-2";
    if (index === 1) return "col-span-1";
    return "col-span-1";
  };

  const getSizeStyle = (index: number) => {
    if (index === 0) return "text-xl font-bold h-full justify-center";
    if (index === 1) return "text-l font-semibold";
    return "text-xs font-small";
  };

  const handleStateClick = (stateId: string) => {
    router.push(`/${locale}/states/${stateId}`);
  };

  console.log("Sorted States:", sortedStates);

  return (
    <Card className="w-full max-w-4xl mx-auto ml-6 mt-6 p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {topThreeStates.map((state, index) => (
            <button
              key={state.stateId}
              onClick={() => handleStateClick(state.stateId)}
              className={`${getSizeClass(
                index
              )} p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer bg-white ${getSizeStyle(
                index
              )}`}
            >
              <div className="flex flex-col items-start justify-between h-full">
                <div>
                  <p className="font-bold">{state.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
