"use client";
import { useCityById } from '@/hooks/useCities';
import { useParams } from 'next/navigation';
import React from 'react'

export default function CityPage({}) {

  const params = useParams();
  const cityId = params.cityId as string;
  const {data } = useCityById(cityId);
  console.log(data);
    return <div>{cityId}</div>
}