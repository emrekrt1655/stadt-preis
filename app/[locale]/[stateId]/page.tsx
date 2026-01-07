"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StateMap from "@/app/components/StateMap";
import { Card } from "@/app/components/ui/card";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

type StateData = {
  totalPopulation: number;
  totalArea: number;
  populationDensity: number;
  districtCount: number;
};

type Feature = {
  type: "Feature";
  id: string | number;
  properties: {
    GEN?: string;
    BEZ?: string;
    destatis?: {
      population?: number;
      area?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  geometry: any;
};

export default function StateDetailPage() {
  const params = useParams();
  const stateId = params.stateId as string;
  const t = useTranslations("stateDetail");

  const [stateData, setStateData] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!stateId) return;

    fetch(`/${stateId}.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((geojson) => {
        const features = geojson.features || [];
        setAllFeatures(features);

        let totalPop = 0;
        let totalArea = 0;

        features.forEach((feature: any) => {
          const destatis = feature.properties?.destatis || {};
          if (destatis.population) totalPop += destatis.population;
          if (destatis.area) totalArea += destatis.area;
        });

        const density = totalArea > 0 ? Math.round(totalPop / totalArea) : 0;

        setStateData({
          totalPopulation: totalPop,
          totalArea,
          populationDensity: density,
          districtCount: features.length,
        });
      })
      .catch((err) => {
        console.error("Error loading GeoJSON:", err);
      })
      .finally(() => setLoading(false));
  }, [stateId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allFeatures.filter((feature) =>
      feature.properties.GEN?.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectFeature = (feature: Feature) => {
    setSelectedFeature(feature);
    setSearchQuery(feature.properties.GEN || "");
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedFeature(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {/* Eyalet Bilgileri Kartı */}
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {t("title")}
              </h2>
              <p className="text-sm text-gray-600">{t("subtitle")}</p>
            </Card>

            {/* Şehir Arama Alanı */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t("placeholder.search")}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {suggestions.map((feature, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectFeature(feature)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {feature.properties.GEN}
                      </div>
                      <div className="text-sm text-gray-600">
                        {feature.properties.BEZ}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showSuggestions && suggestions.length === 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 text-center text-gray-500">
                  {t("noResults", { defaultValue: "Sonuç bulunamadı" })}
                </div>
              )}
            </div>

            {selectedFeature && (
              <Card className="p-4 bg-blue-50 border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t("selectedCityName", {
                        cityName: selectedFeature.properties.GEN!,
                      })}
                    </h3>
                    {selectedFeature.properties.BEZ && (
                      <p className="text-sm text-gray-600">
                        {selectedFeature.properties.BEZ}
                      </p>
                    )}
                    {selectedFeature.properties.destatis?.population && (
                      <p className="text-sm text-gray-600">
                        {t("selectedCityPopulation", {
                          population:
                            selectedFeature.properties.destatis.population.toLocaleString(),
                        })}
                      </p>
                    )}
                    {selectedFeature.properties.destatis?.area && (
                      <p className="text-sm text-gray-600">
                        {t("selectedCityArea", {
                          area: selectedFeature.properties.destatis.area,
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            )}

            {loading ? (
              <Card className="p-6 flex justify-center items-center min-h-48">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
              </Card>
            ) : stateData ? (
              <Card className="p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {t("statistics")}
                </h2>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {t("generalPopulation")}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stateData.totalPopulation.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t("generalArea")}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stateData.totalArea.toFixed(0)} 
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {t("generalDestiny")}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stateData.populationDensity} 
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {t("countOfCities")}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stateData.districtCount}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 shadow-md bg-red-50">
                <p className="text-red-600">
                  {t("loadError", {
                    defaultValue:
                      "Harita verisi yüklenemedi. Konsolu kontrol et.",
                  })}
                </p>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <StateMap selectedFeature={selectedFeature} />
          </div>
        </div>
      </div>
    </div>
  );
}
