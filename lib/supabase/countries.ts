import { supabase } from "./client";

export async function getCountries(langCode: string) {
  const { data: language, error: langError } = await supabase
    .from("languages")
    .select("id")
    .eq("code", langCode)
    .single();

  if (langError || !language) throw new Error("Language not found");

  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("name, code")
    .eq("language_id", language.id)

  if (countriesError || !countries || countries.length === 0) {
    throw new Error("Country not found for the specified language");
  }
    return countries;

}
