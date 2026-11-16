import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * VITE_USE_SUPABASE=true 이고 URL/키가 모두 있을 때만 Supabase를 사용합니다.
 * 그 외에는 서비스 레이어가 목업 데이터로 동작합니다. (현재: 미사용)
 */
export const isSupabaseEnabled: boolean =
  import.meta.env.VITE_USE_SUPABASE === 'true' && Boolean(url) && Boolean(anonKey);

export type TypedSupabaseClient = SupabaseClient<Database>;

let clientPromise: Promise<TypedSupabaseClient> | null = null;

/**
 * 지연 생성 싱글턴. 비활성 상태면 null 을 반환합니다.
 * SDK 는 동적 import 로 불러오므로, 미사용 상태에서는 랜딩 첫 로딩 번들에 포함되지 않습니다.
 */
export async function getSupabase(): Promise<TypedSupabaseClient | null> {
  if (!isSupabaseEnabled) return null;
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient<Database>(url as string, anonKey as string, {
      auth: { persistSession: false },
    }),
  );
  return clientPromise;
}
