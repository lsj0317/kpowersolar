import { getSupabase } from '@/lib/supabase';
import { mockSites } from '@/data/mock';
import type { Site } from '@/types/domain';
import { mapSiteRow } from './mappers';

/** 랜딩 가로 스크롤용 최신 현장 (가이드: 최신 6건) */
export async function fetchLatestSites(limit = 6): Promise<Site[]> {
  const sb = await getSupabase();
  if (!sb) return mockSites.slice(0, limit);

  const { data, error } = await sb
    .from('sites')
    .select('*')
    .eq('is_published', true)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapSiteRow);
}
