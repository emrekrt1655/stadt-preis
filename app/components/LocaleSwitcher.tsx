"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useCountries } from "@/hooks/useCountries";
import { useSelectedCountry } from "@/hooks/useSelectedCountry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Globe, MapPin } from "lucide-react";
import { useLanguages } from "@/hooks/useLanguages";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { data: countries } = useCountries(locale);
  const { selectedCountryCode, setSelectedCountryCode } = useSelectedCountry(
    countries || []
  );

  const { data: languages = [] } = useLanguages();

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);
  const currentCountry = countries?.find((c) => c.code === selectedCountryCode);

  return (
    <div className="flex items-center gap-2">
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-auto gap-2 border-0 shadow-none">
          <Globe className="w-4 h-4" />
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCountryCode}
        onValueChange={setSelectedCountryCode}
      >
        <SelectTrigger className="w-auto gap-2 border-0 shadow-none">
          <MapPin className="w-4 h-4" />
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          {countries?.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
