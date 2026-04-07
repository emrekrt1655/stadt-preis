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
    throw new Error(`Failed to fetch states: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(`No states found for ${countryCode} in ${langCode}`);
  }

  return data.map((item: any) => ({
    name: item.name,
    code: item.states.code,
    stateId: item.states.id,
  })) as State[];
}

export async function getStateById(stateId: string, langCode: string) {
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
    .eq("states.id", stateId)
    .eq("languages.code", langCode)
    .single();

  if (error) {
    throw new Error(`Failed to fetch state: ${error.message}`);
  }

  if (!data) {
    throw new Error(`No state found for id: ${stateId} in ${langCode}`);
  }

  return {
    name: data.name,
    code: (data.states as any).code,
    stateId: (data.states as any).id,
  } as State;
}