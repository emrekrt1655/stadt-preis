'use client';

import { useQuery } from '@tanstack/react-query';
import { getCountries } from '@/lib/supabase/countries';

export const useCountries = (langCode: string) => {
  return useQuery({
    queryKey: ['countries', langCode],
    queryFn: () => getCountries(langCode),
    retry: 1,
  });
};
