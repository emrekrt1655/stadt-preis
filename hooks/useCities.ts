'use client';

import { useQuery } from '@tanstack/react-query';
import { getCities } from '@/lib/supabase/cities';

export const useCities = (langCode: string) => {
  return useQuery({
    queryKey: ['cities', langCode],
    queryFn: () => getCities(langCode),
    retry: 1,
  });
};
