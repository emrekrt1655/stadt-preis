import { Country } from "@/types/Country";
import { useEffect, useState } from "react";

export const useSelectedCountry = (countries: Country[]) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");

  useEffect(() => {
    if (countries && countries.length > 0 && !selectedCountryCode) {
      setSelectedCountryCode(countries[0].code);
    }
  }, [countries, selectedCountryCode]);

  return { selectedCountryCode, setSelectedCountryCode };
};
