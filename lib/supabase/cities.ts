import { supabase } from "./client";

export async function getCities(langCode: string) {
  const { data: language, error: langError } = await supabase
    .from("languages")
    .select("id")
    .eq("code", langCode)
    .single();

  if (langError || !language) throw new Error("Language not found");

  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("code")
    .eq("language_id", language.id)
    .eq("code", "DE");

  if (countriesError || !countries || countries.length === 0) {
    throw new Error("Country not found for the specified language");
  }

  const { data: cities, error: cityError } = await supabase
    .from("cities")
    .select("name, lat, lng")
    .eq("language_id", language.id)
    .eq("country_code", countries[0].code)
    .order("name", { ascending: true });

  if (cityError) throw cityError;

  return cities;
}
