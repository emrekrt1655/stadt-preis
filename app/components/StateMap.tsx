"use client";

import { useEffect, useState } from "react";
import * as d3 from "d3-geo";
import { Card } from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

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
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][][] | number[][][];
  };
};

interface StateMapProps {
  selectedFeature?: Feature | null;
}

export default function StateMap({ selectedFeature }: StateMapProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams();
  const stateId = params.stateId as string;

  useEffect(() => {
    if (!stateId) return;

    setLoading(true);
    fetch(`/${stateId}.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error("GeoJSON not found");
        return res.json();
      })
      .then((data) => {
        setFeatures(data.features || []);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [stateId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (error || features.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-6 p-4 shadow-md">
        <div className="text-center text-red-500">
          There is no map!
        </div>
      </Card>
    );
  }

  const width = 700;
  const height = 800;
  const projection = d3
    .geoMercator()
    .fitExtent(
      [
        [10, 10],
        [width - 10, height - 10],
      ],
      {
        type: "FeatureCollection",
        features: features as any,
      }
    );

  const path = d3.geoPath().projection(projection);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 p-4 shadow-md">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {features.map((feature, i) => {
          const d = path(feature as any);
          if (!d) return null;

          const name = feature.properties.GEN || `Region ${i}`;
          const type = feature.properties.BEZ || "";
          const population = feature.properties.destatis?.population || 0;
          const area = feature.properties.destatis?.area || 0;

          const [x, y] = path.centroid(feature as any);

          const bounds = path.bounds(feature as any);
          const widthFeature = bounds[1][0] - bounds[0][0];
          const heightFeature = bounds[1][1] - bounds[0][1];
          const fontSize = Math.min(
            12,
            Math.max(6, (widthFeature / name.length) * 1.8)
          );

          const showText = widthFeature > 15 && heightFeature > 10;
          const isCity = type.toLowerCase() === "stadt";
          const isSelected = selectedFeature?.properties.GEN === name;

          return (
            <g key={i} className="cursor-pointer">
              <path
                d={d}
                className={`stroke-gray-500 transition-all duration-200 ${
                  isSelected
                    ? "fill-blue-500 stroke-blue-700 stroke-2"
                    : "fill-slate-100 hover:fill-blue-400 hover:stroke-blue-600"
                }`}
              >
                <title>
                  {name} ({type})
                  {population > 0 && ` - ${population.toLocaleString()} inhabitants`}
                  {area > 0 && ` - ${area} km²`}
                </title>
              </path>

              {showText && isCity && (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={fontSize}
                  className={`font-medium pointer-events-none select-none ${
                    isSelected ? "fill-white" : "fill-gray-800"
                  }`}
                >
                  {name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Card>
  );
}