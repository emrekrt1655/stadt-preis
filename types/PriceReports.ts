export type PriceCategory = "rent" | "beer" | "cappuccino" | "salary";

export interface BasePriceReport {
  id: string;
  cityId: string;
  stateId: string;
  category: PriceCategory;
  price: number;
  currency: string;
  notes?: string;
  isAnonymous: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentDetails {
  id?: string;
  reportId?: string;
  rentType?: "warm" | "kalt";
  roomCount?: number;
  squareMeters?: number;
  floor?: number;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  neighborhood?: string;
}

export interface BeverageDetails {
  id?: string;
  reportId?: string;
  venueName?: string;
  venueType?: "bar" | "cafe" | "restaurant";
  beverageSize?: string;
}

export interface SalaryDetails {
  id?: string;
  reportId?: string;
  salaryGross?: number;
  salaryNet?: number;
  salaryPeriod?: "yearly" | "monthly";
  jobTitle?: string;
  industry?: string;
  experienceYears?: number;
  companySize?: "small" | "medium" | "large";
}

export interface RentReport extends BasePriceReport {
  category: "rent";
  rentDetails?: RentDetails;
}

export interface BeerReport extends BasePriceReport {
  category: "beer";
  beverageDetails?: BeverageDetails;
}

export interface CappuccinoReport extends BasePriceReport {
  category: "cappuccino";
  beverageDetails?: BeverageDetails;
}

export interface SalaryReport extends BasePriceReport {
  category: "salary";
  salaryDetails?: SalaryDetails;
}

export type PriceReport =
  | RentReport
  | BeerReport
  | CappuccinoReport
  | SalaryReport;

export function isRentReport(report: PriceReport): report is RentReport {
  return report.category === "rent";
}

export function isBeverageReport(
  report: PriceReport
): report is BeerReport | CappuccinoReport {
  return report.category === "beer" || report.category === "cappuccino";
}

export function isSalaryReport(report: PriceReport): report is SalaryReport {
  return report.category === "salary";
}
