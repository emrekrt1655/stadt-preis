"use client";

import { useEffect, useState } from "react";
import * as d3 from "d3-geo";
import { Card } from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelectedState } from "@/hooks/useSelectedState";
import { State } from "@/types/State";
import { toast } from "sonner";

type GermanyMapProps = {
  states: State[];
};

type Feature = {
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

export default function GermanyMap({ states }: GermanyMapProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { setSelectedStateId } = useSelectedState();

  useEffect(() => {
    fetch("/states.geojson")
      .then((res) => res.json())
      .then((data) => setFeatures(data.features))
      .catch(() => setError(true));
  }, []);

  if (error) {
    toast.error("Failed to load map data");
  }

  if (features.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const width = 600;
  const height = 700;
  const projection = d3
    .geoMercator()
    .center([10.5, 51])
    .scale(2400)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 p-4 shadow-md">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {features.map((feature, i) => {
          const d = path(feature as any);
          if (!d) return null;

          const matchedState = states.find(
            (s) => s.stateId === String(feature.id)
          );
          if (!matchedState) return null;

          const { name, code, stateId } = matchedState;

          const [x, y] = path.centroid(feature as any);

          const bounds = path.bounds(feature as any);
          const widthFeature = bounds[1][0] - bounds[0][0];
          const heightFeature = bounds[1][1] - bounds[0][1];
          const fontSize = Math.min(
            12,
            Math.max(6, (widthFeature / (name.length + code.length)) * 1.5)
          );

          const showText = widthFeature > 15 && heightFeature > 10;

          return (
            <g key={i} className="cursor-pointer">
              <path
                d={d}
                className="fill-slate-100 stroke-gray-500 hover:fill-blue-400 hover:stroke-blue-600 transition-all duration-200"
                onClick={() => {
                  setSelectedStateId(stateId);
                  router.push(`/${name}/${stateId}`);
                }}
              >
                <title>
                  {name} | {code}
                </title>
              </path>

              {showText && (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={fontSize}
                  className="fill-gray-800 font-medium pointer-events-none select-none"
                >
                  {name} | {code}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
