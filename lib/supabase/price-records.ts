import { supabase } from "./client";
import { PriceCategory } from "@/types/PriceRecords";

export async function createPriceRecord(
  cityId: string,
  stateId: string,
  countryId: string,
  category: PriceCategory,
  data: any
) {
  const { data: record, error: recordError } = await supabase
    .from("price_records")
    .insert({
      city_id: cityId,
      state_id: stateId,
      country_id: countryId,
      category,
      price: data.price,
      currency: data.currency || "EUR",
      is_anonymous: true,
    })
    .select()
    .single();

  if (recordError) throw recordError;

  if (category === "rent" && data.rentDetails) {
    const { error } = await supabase.from("rent_prices").insert({
      price_record_id: record.id,
      rent_type: data.rentDetails.rentType,
      room_count: data.rentDetails.roomCount,
    });
    if (error) throw error;
  } else if (category === "doener" && data.doenerDetails) {
    const { error } = await supabase.from("doener_prices").insert({
      price_record_id: record.id,
      restaurant_name: data.doenerDetails.restaurantName,
    });
    if (error) throw error;
  } else if (category === "cappuccino" && data.cappuccinoDetails) {
    const { error } = await supabase.from("cappuccino_prices").insert({
      price_record_id: record.id,
      restaurant_name: data.cappuccinoDetails.restaurantName,
      size: data.cappuccinoDetails.size,
    });
    if (error) throw error;
  } else if (category === "salary" && data.salaryDetails) {
    const { error } = await supabase.from("salary_prices").insert({
      price_record_id: record.id,
      job_title: data.salaryDetails.jobTitle,
      salary_gross: data.salaryDetails.salaryGross,
    });
    if (error) throw error;
  }

  return record;
}

export async function getPriceRecordsByCity(
  cityId: string,
  category?: PriceCategory
) {
  let query = supabase
    .from("price_records")
    .select(
      `
      *,
      rent_prices(*),
      doener_prices(*),
      cappuccino_prices(*),
      salary_prices(*)
    `
    )
    .eq("city_id", cityId)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getPriceRecordsByState(
  stateId: string,
  category?: PriceCategory
) {
  let query = supabase
    .from("price_records")
    .select(
      `
      *,
      rent_prices(*),
      doener_prices(*),
      cappuccino_prices(*),
      salary_prices(*)
    `
    )
    .eq("state_id", stateId)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getAveragePrices(
  cityId: string,
  category: PriceCategory
) {
  const { data, error } = await supabase
    .from("price_records")
    .select("price")
    .eq("city_id", cityId)
    .eq("category", category);

  if (error) throw error;

  if (!data || data.length === 0) return null;

  const prices = data.map((item) => item.price);
  const avg = prices.reduce((sum, item) => sum + item, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return { average: avg, min, max, count: data.length };
}