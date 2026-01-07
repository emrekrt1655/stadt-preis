import { Country } from "@/types/Country";
import { supabase } from "./client";

export async function getCountries(langCode: string) {
  const { data, error } = await supabase
    .from("country_translations")
    .select(
      `
      name,
      countries!inner (
        id,
        code,
        iso3,
        continent
      ),
      languages!inner (
        code
      )
    `
    )
    .eq("languages.code", langCode);

  if (error) {
    throw new Error(`Failed to fetch countries: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(`No countries found for language: ${langCode}`);
  }
  const countries = data.map((item: any) => ({
    name: item.name,
    code: item.countries.code,
    iso3: item.countries.iso3,
    continent: item.countries.continent,
    langCode: item.languages.code,
  })) as Country[];

  return countries;
}
