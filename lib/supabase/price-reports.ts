// lib/supabase/price-reports.ts
import { supabase } from "./client";
import { PriceReport, PriceCategory } from "@/types/PriceReports";

export async function createPriceReport(
  cityId: string,
  category: PriceCategory,
  data: any
) {
  const { data: report, error: reportError } = await supabase
    .from("price_reports")
    .insert({
      city_id: cityId,
      category,
      price: data.price,
      currency: data.currency || "EUR",
      notes: data.notes,
      is_anonymous: true,
    })
    .select()
    .single();

  if (reportError) throw reportError;

  if (category === "rent" && data.rentDetails) {
    await supabase.from("rent_details").insert({
      report_id: report.id,
      ...data.rentDetails,
    });
  } else if (
    (category === "beer" || category === "cappuccino") &&
    data.beverageDetails
  ) {
    await supabase.from("beverage_details").insert({
      report_id: report.id,
      ...data.beverageDetails,
    });
  } else if (category === "salary" && data.salaryDetails) {
    await supabase.from("salary_details").insert({
      report_id: report.id,
      ...data.salaryDetails,
    });
  }

  return report;
}

export async function getPriceReportsByCity(
  cityId: string,
  category?: PriceCategory
) {
  let query = supabase
    .from("price_reports")
    .select(
      `
      *,
      rent_details(*),
      beverage_details(*),
      salary_details(*)
    `
    )
    .eq("city_id", cityId)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getAveragePrices(
  cityId: string,
  category: PriceCategory
) {
  const { data, error } = await supabase
    .from("price_reports")
    .select("price")
    .eq("city_id", cityId)
    .eq("category", category);

  if (error) throw error;

  if (!data || data.length === 0) return null;

  const avg = data.reduce((sum, item) => sum + item.price, 0) / data.length;
  const min = Math.min(...data.map((item) => item.price));
  const max = Math.max(...data.map((item) => item.price));

  return { average: avg, min, max, count: data.length };
}
