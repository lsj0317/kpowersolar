import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * 관리자 전용 Supabase 클라이언트.
 * 사이트용 클라이언트(lib/supabase.ts)와 달리 로그인 상태를 기기에 저장합니다.
 * 데이터 접근 권한은 DB 의 RLS(supabase/admin.sql)가 관리자 계정에만 줍니다.
 * 관리자 화면은 별도 파일로 나뉘어 있어 일반 방문자는 이 코드를 내려받지 않습니다.
 */
export const adminSupabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: 'kps-admin-auth' },
      })
    : null;
