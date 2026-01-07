// scripts/seed-cities.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables!');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const COUNTRY_ID = '45d75408-d84a-4ce9-a520-3d5ca71b2b01';

const STATE_MAPPINGS = [
  { id: '17961918-6548-4339-953b-640101824426', code: 'SN' },
  { id: '23667104-5893-4152-870a-706563720743', code: 'ST' },
  { id: '28e67980-6060-4691-872e-065963283737', code: 'BB' },
  { id: '39912788-6629-4503-913a-6745582f3c7e', code: 'BE' },
  { id: '39983195-2022-4309-983b-857900746654', code: 'TH' },
  { id: '41066708-3601-4433-8557-550961817740', code: 'RP' },
  { id: '44634289-4981-4217-987a-770857544342', code: 'SH' },
  { id: '54d1976a-7346-4560-96f3-23363065603e', code: 'HH' },
  { id: '64973595-6679-4682-892a-350711903673', code: 'MV' },
  { id: '70757754-5264-4e2a-8991-236531398863', code: 'HE' },
  { id: '75705359-5415-4554-942b-582531093113', code: 'SL' },
  { id: '82281898-0387-4389-913a-528575510712', code: 'NW' },
  { id: '84509539-7157-410a-8575-397120614349', code: 'NI' },
  { id: '978d30e3-47a2-4a0b-93f0-466048d08670', code: 'BW' },
  { id: 'b4698889-7607-427c-9828-09556857313a', code: 'HB' },
  { id: 'f9a7385a-0720-4e78-958b-08502f6764d9', code: 'BY' },
];

async function seedAllCities() {
  console.log('🚀 Starting city seeding process...\n');
  
  let totalCities = 0;

  for (const state of STATE_MAPPINGS) {
    const fileName = `${state.id}.geojson`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${fileName} - file not found`);
      continue;
    }

    console.log(`📍 Processing ${state.code}...`);

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const geoJson = JSON.parse(fileContent);

    if (!geoJson.features || geoJson.features.length === 0) {
      console.log(`   ⚠️  No features found in ${fileName}`);
      continue;
    }

    const cities = geoJson.features.map((feature: any) => {
      const props = feature.properties;
      const destatis = props.destatis || {};

      return {
        id: props.RS || props.AGS,
        state_id: state.id,
        country_id: COUNTRY_ID,
        name: props.GEN,
        zip_code: destatis.zip || null,
        population: destatis.population || null,
        area: destatis.area ? parseFloat(destatis.area) : null,
        population_density: destatis.population_density || null,
        center_lon: destatis.center_lon 
          ? parseFloat(destatis.center_lon.replace(',', '.')) 
          : null,
        center_lat: destatis.center_lat 
          ? parseFloat(destatis.center_lat.replace(',', '.')) 
          : null,
      };
    });

    for (let i = 0; i < cities.length; i += 1000) {
      const batch = cities.slice(i, i + 1000);
      
      const { error } = await supabase
        .from('cities')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`   ❌ Error inserting batch:`, error);
        continue;
      }

      console.log(`   ✅ Inserted ${Math.min(i + 1000, cities.length)} / ${cities.length}`);
    }

    totalCities += cities.length;
    console.log(`   ✨ ${state.code} completed: ${cities.length} cities\n`);
  }

  console.log(`🎉 Seeding completed! Total cities: ${totalCities}`);
}

seedAllCities().catch(console.error);