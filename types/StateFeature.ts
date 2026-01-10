type StateFeature = {
  type: "Feature";
  id: string | number;
  properties: {
    NAME_1: string;
    ID_1?: number;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][][] | number[][][];
  };
};
