import { City } from "@/types/City";
import { supabase } from "./client";

const CITY_SELECT_QUERY = `
  id,
  name,
  zip_code,
  population,
  area,
  population_density,
  center_lat,
  center_lon,
  state_id,
  country_id,
  states (
    id,
    code
  ),
  countries (
    id,
    code
  )
`;

function mapCityData(item: any): City {
  return {
    id: item.id,
    name: item.name,
    zipCode: item.zip_code,
    population: item.population,
    area: item.area,
    populationDensity: item.population_density,
    lat: item.center_lat,
    lng: item.center_lon,
    stateId: item.state_id,
    countryId: item.country_id,
    state: item.states,
    country: item.countries,
  };
}

async function fetchCities(
  filterKey: string,
  filterValue: string,
  isSingle = false
): Promise<City | City[]> {
  let query = supabase.from("cities").select(CITY_SELECT_QUERY);

  if (filterKey === "countries.code") {
    query = query.eq(filterKey, filterValue);
  } else {
    query = query.eq(filterKey, filterValue);
  }

  const { data, error } = isSingle 
    ? await query.single() 
    : await query;

  if (error) {
    throw new Error(`Failed to fetch city/cities: ${error.message}`);
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error(`No cities found for ${filterKey}=${filterValue}`);
  }

  return isSingle 
    ? mapCityData(data) 
    : (data as any[]).map(mapCityData);
}

export async function getCitiesByCountry(countryCode: string): Promise<City[]> {
  return fetchCities("countries.code", countryCode) as Promise<City[]>;
}

export async function getCitiesByState(stateId: string): Promise<City[]> {
  return fetchCities("state_id", stateId) as Promise<City[]>;
}

export async function getCityById(cityId: string): Promise<City> {
  return fetchCities("id", cityId, true) as Promise<City>;
}