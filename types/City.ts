export type City = {
  id: string;
  name: string;
  zipCode: string | null;
  population: number | null;
  area: number | null;
  populationDensity: number | null;
  lat: number | null;
  lng: number | null;
  stateId?: string;
  countryId?: string;
  state?: {
    id: string;
    code: string;
  };
  country?: {
    id: string;
    code: string;
  };
};
