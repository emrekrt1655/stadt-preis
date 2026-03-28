export type PriceCategory = "rent" | "doener" | "cappuccino" | "salary";

export interface BasePriceRecord {
  id: string;
  city_id: string;
  state_id: string;
  country_id: string;
  category: PriceCategory;
  price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface RentDetails {
  id?: string;
  price_record_id?: string;
  rent_type?: "warm" | "kalt";
  room_count?: number;
}

export interface CappuccinoDetails {
  id?: string;
  price_record_id?: string;
  restaurant_name?: string;
  size?: string;
}

export interface DoenerDetails {
  id?: string;
  price_record_id?: string;
  restaurant_name?: string;
}

export interface SalaryDetails {
  id?: string;
  price_record_id?: string;
  salary_gross?: number;
  job_title?: string;
}

export interface RentRecord extends BasePriceRecord {
  category: "rent";
  rent_prices?: RentDetails[];
}

export interface CappuccinoRecord extends BasePriceRecord {
  category: "cappuccino";
  cappuccino_prices?: CappuccinoDetails[];
}

export interface DoenerRecord extends BasePriceRecord {
  category: "doener";
  doener_prices?: DoenerDetails[];
}

export interface SalaryRecord extends BasePriceRecord {
  category: "salary";
  salary_prices?: SalaryDetails[];
}

export type PriceRecord =
  | RentRecord
  | DoenerRecord
  | CappuccinoRecord
  | SalaryRecord;

// Create input types
export interface CreateRentInput {
  price: number;
  currency?: string;
  rentDetails?: {
    rentType?: "warm" | "kalt";
    roomCount?: number;
  };
}

export interface CreateDoenerInput {
  price: number;
  currency?: string;
  doenerDetails?: {
    restaurantName?: string;
  };
}

export interface CreateCappuccinoInput {
  price: number;
  currency?: string;
  cappuccinoDetails?: {
    restaurantName?: string;
    size?: string;
  };
}

export interface CreateSalaryInput {
  price: number;
  currency?: string;
  salaryDetails?: {
    salaryGross?: number;
    jobTitle?: string;
  };
}

export type CreatePriceRecordInput =
  | CreateRentInput
  | CreateDoenerInput
  | CreateCappuccinoInput
  | CreateSalaryInput;

// Type guards
export function isRentReport(record: PriceRecord): record is RentRecord {
  return record.category === "rent";
}

export function isCappuccinoReport(
  report: PriceRecord
): report is CappuccinoRecord {
  return report.category === "cappuccino";
}

export function isSalaryReport(report: PriceRecord): report is SalaryRecord {
  return report.category === "salary";
}

export function isDoenerReport(report: PriceRecord): report is DoenerRecord {
  return report.category === "doener";
}

