export type CityFeature = {
  type: "Feature";
  id: string | number;
  properties: {
    RS?: string;
    AGS?: string;
    GEN?: string;
    BEZ?: string;
    destatis?: {
      population?: number;
      area?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][][] | number[][][];
  };
};