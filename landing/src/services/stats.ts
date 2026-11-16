import { getSupabase } from '@/lib/supabase';
import { mockStats } from '@/data/mock';
import type { Stat } from '@/types/domain';
import { mapStatRow } from './mappers';

export async function fetchStats(): Promise<Stat[]> {
  const sb = await getSupabase();
  if (!sb) return mockStats;

  const { data, error } = await sb
    .from('stats')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapStatRow);
}
