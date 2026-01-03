"use client";

import { useStates } from "@/hooks/useStates";
import { useCountries } from "@/hooks/useCountries";
import { useParams } from "next/navigation";
import { useSelectedCountry } from "@/hooks/useSelectedCountry";
import { useSelectedState } from "@/hooks/useSelectedState";
import { useCitiesByCountry, useCitiesByState } from "@/hooks/useCities";

export default function Test() {
  const params = useParams();
  const locale = params.locale as string;

  const {
    data: countries,
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useCountries(locale);

  const { selectedCountryCode, setSelectedCountryCode } = useSelectedCountry(
    countries || []
  );

  const {
    data: states,
    isLoading: isStatesLoading,
    isError: isStatesError,
    error: statesError,
  } = useStates(selectedCountryCode, locale);

  const { selectedStateId, setSelectedStateId } = useSelectedState();

  // Ülkedeki TÜM şehirleri
  const { data: countryCities, isLoading: isCountryCitiesLoading } =
    useCitiesByCountry(selectedCountryCode, locale);

  // Seçili eyaletteki şehirleri
  const { data: stateCities, isLoading: isStateCitiesLoading } =
    useCitiesByState(selectedStateId, locale);

  // Eyalet seçildiyse state cities göster, yoksa country cities göster
  const citiesToDisplay = selectedStateId ? stateCities : countryCities;
  const isCitiesLoading = selectedStateId
    ? isStateCitiesLoading
    : isCountryCitiesLoading;

  if (isCountriesLoading) return <div>Loading countries...</div>;
  if (isCountriesError) return <div>Error loading countries</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Countries List */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Countries</h1>
        <ul className="space-y-2">
          {countries?.map((country) => (
            <li key={country.code}>
              <button
                onClick={() => {
                  setSelectedCountryCode(country.code);
                  setSelectedStateId(""); // Ülke değişince state'i sıfırla
                }}
                className={`w-full text-left p-4 border rounded-lg transition ${
                  selectedCountryCode === country.code
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <h2 className="text-xl font-semibold">{country.name}</h2>
                <p className="text-sm text-gray-600">{country.code}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* States List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          States of {selectedCountryCode}
        </h2>

        {isStatesLoading && <div>Loading states...</div>}
        {isStatesError && (
          <div className="text-red-500">Error: {statesError?.message}</div>
        )}
        {!isStatesLoading &&
          !isStatesError &&
          (!states || states.length === 0) && <div>No states found</div>}

        {!isStatesLoading && states && states.length > 0 && (
          <ul className="space-y-2">
            {states.map((state) => (
              <li
                key={state.stateId}
                className={`border rounded-lg shadow-sm cursor-pointer transition ${
                  selectedStateId === state.stateId
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <button
                  onClick={() => setSelectedStateId(state.stateId)}
                  className="w-full text-left p-4"
                >
                  <h3 className="text-lg font-semibold">{state.name}</h3>
                  <p className="text-sm text-gray-600">Code: {state.code}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cities List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedStateId ? "State Cities" : "All Cities in Country"}
        </h2>

        {isCitiesLoading && <div>Loading cities...</div>}
        {!isCitiesLoading &&
          (!citiesToDisplay || citiesToDisplay.length === 0) && (
            <div>No cities found</div>
          )}

        {!isCitiesLoading && citiesToDisplay && citiesToDisplay.length > 0 && (
          <ul className="space-y-2">
            {citiesToDisplay.map((city) => (
              <li
                key={city.id}
                className="p-4 border border-gray-300 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold">{city.name}</h3>
                <p className="text-sm text-gray-600">
                  Latitude: {city.lat}, Longitude: {city.lng}
                </p>
                <p className="text-sm text-gray-500">Plate: {city.plateCode}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
