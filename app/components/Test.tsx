"use client";
import { useCities } from "@/hooks/useCities";
import { useCountries } from "@/hooks/useCountries";
import { useParams } from "next/navigation";

export default function Test() {
    const params  = useParams();
    const locale = params.locale as string;

const { data: cities, isLoading: isCitiesLoading, isError: isCitiesError } = useCities(locale);
const { data: counries, isLoading: isCountriesLoading, isError: isCountriesError } = useCountries(locale);

  if (isCitiesLoading) return <div>Loading cities...</div>;
  if (isCitiesError) return <div>Error loading cities.</div>;
  if (isCountriesLoading) return <div>Loading cities...</div>;
  if (isCountriesError) return <div>Error loading cities.</div>;

  return (
    <>
    <ul className="max-w-md mx-auto space-y-4 mb-8">
        {counries?.map((country) => (
          <li
            key={country.code}
            className="p-4 border border-gray-300 rounded-lg shadow-sm flex items-center space-x-4"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{country.name}</h2>
            </div>
          </li>
        ))}
    </ul>
      <ul className="max-w-md mx-auto space-y-4">
        {cities?.map((city) => (
          <li
            key={city.name}
            className="p-4 border border-gray-300 rounded-lg shadow-sm flex items-center space-x-4"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{city.name}</h2>
              <p className="text-gray-600">
                Latitude: {city.lat}, Longitude: {city.lng}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
