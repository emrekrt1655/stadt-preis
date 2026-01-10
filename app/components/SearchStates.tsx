"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLocale, useTranslations } from "next-intl";
import { useStates } from "@/hooks/useStates";
import { useCountries } from "@/hooks/useCountries";
import { useSelectedCountry } from "@/hooks/useSelectedCountry";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchStates() {
  const t = useTranslations("searchStates");
  const locale = useLocale();
  const { data: countries } = useCountries(locale);
  const { selectedCountryCode } = useSelectedCountry(countries || []);
  const { data: states = [] } = useStates(selectedCountryCode, locale);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const filteredStates = states.filter((state) => {
    const searchName = state.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return searchName;
  });

  return (
    <Card className="w-full max-w-4xl mx-auto ml-6 mt-6 p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={t("placeholder") || "Search states..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 border border-gray-200 rounded-lg bg-white shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredStates.length > 0 ? (
                filteredStates.map((state) => (
                  <div
                    key={state.stateId}
                    className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0"
                    onClick={() => router.push(`/states/${state.stateId}`)}
                  >
                    {state.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  {t("noResults") || "No states found"}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
