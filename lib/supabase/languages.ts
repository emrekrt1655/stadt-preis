import { Language } from "@/types/Language";
import { supabase } from "./client";

export async function getLanguages() {
  const { data, error } = await supabase.from("languages").select("*");
  if (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
  return data as Language[];
}
