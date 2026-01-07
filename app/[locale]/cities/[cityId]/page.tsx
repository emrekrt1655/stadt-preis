"use client";

import { useCityById } from "@/hooks/useCities";
import { usePriceReportsByCity, useAveragePrices } from "@/hooks/usePriceReports";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Loader2, MapPin, Users, Maximize2, Building2, Beer, Coffee, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { isRentReport, isBeverageReport, isSalaryReport } from "@/types/PriceReports";
import AddPriceReportForm from "@/app/components/AddPriceReportForm";
import { useTranslations } from "next-intl";

export default function CityPage() {
  const t = useTranslations("CityPage");
  const params = useParams();
  const cityId = params.cityId as string;
  
  const { data: city, isLoading: cityLoading } = useCityById(cityId);
  const { data: rentReports } = usePriceReportsByCity(cityId, "rent");
  const { data: beerReports } = usePriceReportsByCity(cityId, "beer");
  const { data: cappuccinoReports } = usePriceReportsByCity(cityId, "cappuccino");
  const { data: salaryReports } = usePriceReportsByCity(cityId, "salary");
  
  const { data: rentAvg } = useAveragePrices(cityId, "rent");
  const { data: beerAvg } = useAveragePrices(cityId, "beer");
  const { data: cappuccinoAvg } = useAveragePrices(cityId, "cappuccino");
  const { data: salaryAvg } = useAveragePrices(cityId, "salary");

  if (cityLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">{t("cityNotFound")}</h1>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{city.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{t("zip")}: {city.zipCode || "N/A"}</span>
        </div>
      </div>

      {/* City Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.population")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {city.population?.toLocaleString() || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.area")}</CardTitle>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {city.area ? `${city.area} km²` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.density")}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {city.populationDensity ? `${city.populationDensity}/km²` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.reports")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(rentReports?.length || 0) +
                (beerReports?.length || 0) +
                (cappuccinoReports?.length || 0) +
                (salaryReports?.length || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Information */}
      <Tabs defaultValue="rent" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rent">
            <Building2 className="w-4 h-4 mr-2" />
            {t("categories.rent")}
          </TabsTrigger>
          <TabsTrigger value="beer">
            <Beer className="w-4 h-4 mr-2" />
            {t("categories.beer")}
          </TabsTrigger>
          <TabsTrigger value="cappuccino">
            <Coffee className="w-4 h-4 mr-2" />
            {t("categories.cappuccino")}
          </TabsTrigger>
          <TabsTrigger value="salary">
            <Wallet className="w-4 h-4 mr-2" />
            {t("categories.salary")}
          </TabsTrigger>
        </TabsList>

        {/* Rent Tab */}
        <TabsContent value="rent" className="space-y-4">
          <div className="flex justify-end">
            <AddPriceReportForm cityId={cityId} defaultCategory="rent" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("rentStatistics")}</CardTitle>
            </CardHeader>
            <CardContent>
              {rentAvg ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("average")}</p>
                    <p className="text-2xl font-bold">{rentAvg.average.toFixed(2)}€</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("minMax")}</p>
                    <p className="text-2xl font-bold">
                      {rentAvg.min}€ - {rentAvg.max}€
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("reportsCount")}</p>
                    <p className="text-2xl font-bold">{rentAvg.count}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noDataRent")}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rentReports?.map((report) => {
              if (!isRentReport(report)) return null;
              
              return (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{report.price}€</span>
                        <span className="text-sm text-muted-foreground">
                          {report.rentDetails?.rentType}
                        </span>
                      </div>
                      {report.rentDetails && (
                        <div className="text-sm space-y-1">
                          {report.rentDetails.roomCount && (
                            <p>🛏️ {report.rentDetails.roomCount} {t("rooms")}</p>
                          )}
                          {report.rentDetails.squareMeters && (
                            <p>📏 {report.rentDetails.squareMeters}m²</p>
                          )}
                          {report.rentDetails.neighborhood && (
                            <p>📍 {report.rentDetails.neighborhood}</p>
                          )}
                        </div>
                      )}
                      {report.notes && (
                        <p className="text-sm text-muted-foreground italic">{report.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Beer Tab */}
        <TabsContent value="beer" className="space-y-4">
          <div className="flex justify-end">
            <AddPriceReportForm cityId={cityId} defaultCategory="beer" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("beerStatistics")}</CardTitle>
            </CardHeader>
            <CardContent>
              {beerAvg ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("average")}</p>
                    <p className="text-2xl font-bold">{beerAvg.average.toFixed(2)}€</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("minMax")}</p>
                    <p className="text-2xl font-bold">
                      {beerAvg.min}€ - {beerAvg.max}€
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("reportsCount")}</p>
                    <p className="text-2xl font-bold">{beerAvg.count}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noDataBeer")}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {beerReports?.map((report) => {
              if (!isBeverageReport(report)) return null;
              
              return (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{report.price}€</span>
                      </div>
                      {report.beverageDetails && (
                        <div className="text-sm space-y-1">
                          {report.beverageDetails.venueName && (
                            <p>🏪 {report.beverageDetails.venueName}</p>
                          )}
                          {report.beverageDetails.beverageSize && (
                            <p>🍺 {report.beverageDetails.beverageSize}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Cappuccino Tab */}
        <TabsContent value="cappuccino" className="space-y-4">
          <div className="flex justify-end">
            <AddPriceReportForm cityId={cityId} defaultCategory="cappuccino" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("cappuccinoStatistics")}</CardTitle>
            </CardHeader>
            <CardContent>
              {cappuccinoAvg ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("average")}</p>
                    <p className="text-2xl font-bold">{cappuccinoAvg.average.toFixed(2)}€</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("minMax")}</p>
                    <p className="text-2xl font-bold">
                      {cappuccinoAvg.min}€ - {cappuccinoAvg.max}€
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("reportsCount")}</p>
                    <p className="text-2xl font-bold">{cappuccinoAvg.count}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noDataCappuccino")}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cappuccinoReports?.map((report) => {
              if (!isBeverageReport(report)) return null;
              
              return (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{report.price}€</span>
                      </div>
                      {report.beverageDetails?.venueName && (
                        <p className="text-sm">☕ {report.beverageDetails.venueName}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Salary Tab */}
        <TabsContent value="salary" className="space-y-4">
          <div className="flex justify-end">
            <AddPriceReportForm cityId={cityId} defaultCategory="salary" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("salaryStatistics")}</CardTitle>
            </CardHeader>
            <CardContent>
              {salaryAvg ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("average")}</p>
                    <p className="text-2xl font-bold">{salaryAvg.average.toLocaleString()}€</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("minMax")}</p>
                    <p className="text-2xl font-bold">
                      {salaryAvg.min.toLocaleString()}€ - {salaryAvg.max.toLocaleString()}€
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("reportsCount")}</p>
                    <p className="text-2xl font-bold">{salaryAvg.count}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noDataSalary")}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salaryReports?.map((report) => {
              if (!isSalaryReport(report)) return null;
              
              return (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{report.price.toLocaleString()}€</span>
                        <span className="text-sm text-muted-foreground">
                          {report.salaryDetails?.salaryPeriod}
                        </span>
                      </div>
                      {report.salaryDetails && (
                        <div className="text-sm space-y-1">
                          {report.salaryDetails.jobTitle && (
                            <p>💼 {report.salaryDetails.jobTitle}</p>
                          )}
                          {report.salaryDetails.industry && (
                            <p>🏢 {report.salaryDetails.industry}</p>
                          )}
                          {report.salaryDetails.experienceYears && (
                            <p>📅 {report.salaryDetails.experienceYears} {t("yearsExperience")}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}