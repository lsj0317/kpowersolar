-- 새 상담 카카오톡 알림 (나에게 보내기) 용 테이블
-- schema.sql 실행 후, Supabase SQL Editor 에서 한 번 실행하세요. 여러 번 실행해도 됩니다.

-- 카카오 로그인 토큰 보관 (한 줄만 사용)
create table if not exists public.kakao_tokens (
  id                  int primary key default 1 check (id = 1),
  access_token        text not null,
  access_expires_at   timestamptz not null,
  refresh_token       text not null,
  refresh_expires_at  timestamptz,
  updated_at          timestamptz not null default now()
);

-- RLS 를 켜고 정책을 만들지 않음 → 방문자(anon)는 읽기·쓰기 모두 불가.
-- 알림 함수(Edge Function)는 서버 전용 service_role 로만 접근합니다.
alter table public.kakao_tokens enable row level security;
revoke all on public.kakao_tokens from anon, authenticated;

-- 같은 상담으로 알림이 두 번 가지 않도록 보낸 시각 기록
alter table public.consultations add column if not exists notified_at timestamptz;
