import { State } from "@/types/State";
import { supabase } from "./client";

export async function getStates(countryCode: string, langCode: string) {
  const { data, error } = await supabase
    .from("state_translations")
    .select(
      `
      name,
      states!inner (
        code,
        id,
        countries!inner (
          code
        )
      ),
      languages!inner (
        code
      )
    `
    )
    .eq("states.countries.code", countryCode)
    .eq("languages.code", langCode);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch states: ${error.message}`);
  }

  if (!data?.length) {
    throw new Error(`No states found for ${countryCode} in ${langCode}`);
  }

  return data.map((item: any) => ({
    name: item.name,
    code: item.states.code,
    stateId: item.states.id,
  })) as State[];
}
