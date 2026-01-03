import { City } from "@/types/City";
import { supabase } from "./client";

export async function getCitiesByCountry(
  countryCode: string,
  langCode: string
) {
  const { data, error } = await supabase
    .from("city_translations")
    .select(`
      name,
      cities!inner (
        id,
        lat,
        lng,
        plate_code,
        countries!inner (
          code
        )
      ),
      languages!inner (
        code
      )
    `)
    .eq("cities.countries.code", countryCode)
    .eq("languages.code", langCode);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch cities: ${error.message}`);
  }

  if (!data?.length) {
    throw new Error(`No cities found for ${countryCode} in ${langCode}`);
  }

  console.log("Fetched cities data:", data);

  return data.map((item: any) => ({
    name: item.name,
    id: item.cities.id,
    lat: parseFloat(item.cities.lat),
    lng: parseFloat(item.cities.lng),
    plateCode: item.cities.plate_code,
  })) as City[];
}

export async function getCitiesByState(
  stateId: string,
  langCode: string
) {
  const { data, error } = await supabase
    .from("city_translations")
    .select(`
      name,
      cities!inner (
        id,
        lat,
        lng,
        plate_code,
        states!inner (
          id
        )
      ),
      languages!inner (
        code
      )
    `)
    .eq("cities.states.id", stateId)
    .eq("languages.code", langCode);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch cities: ${error.message}`);
  }

  if (!data?.length) {
    throw new Error(`No cities found for state ${stateId} in ${langCode}`);
  }


  return data.map((item: any) => ({
    name: item.name,
    id: item.cities.id,
    lat: parseFloat(item.cities.lat),
    lng: parseFloat(item.cities.lng),
    plateCode: item.cities.plate_code,
  })) as City[];
}