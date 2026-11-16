-- 케이파워 솔라 랜딩(A안) / 회사(B안) 공용 스키마
-- Supabase SQL Editor 에서 실행하세요.

create type site_model  as enum ('ROOF_LEASE', 'OWN_PLANT', 'PREPAID_LEASE');
create type site_status as enum ('PERMIT', 'BUILDING', 'DONE', 'RUNNING');

-- 시공현장 (B안 /sites 가 원본, A안은 최신 6건만 조회)
create table public.sites (
  id                 text primary key,               -- 예: gimhae-jinyeong-001
  name               text not null,
  region             text not null,                  -- 부산/울산/김해/양산/창원
  address            text not null,
  roof_area_m2       numeric not null default 0,
  roof_area_pyeong   numeric not null default 0,
  capacity_kw        numeric not null default 0,
  roof_type          text not null default '',
  method             text not null default '',
  model              site_model not null,
  status             site_status not null,
  completed_at       text not null,                  -- 'YYYY-MM'
  annual_lease_krw   bigint,
  images             text[] not null default '{}',
  review_text        text,
  review_author      text,
  review_avatar_url  text,
  review_consent     boolean not null default false, -- 동의받은 후기만 노출
  is_published       boolean not null default false,
  created_at         timestamptz not null default now()
);

-- 실적 수치 (실적 벤토 카드)
create table public.stats (
  id            text primary key,
  label         text not null,
  value         text not null,
  unit          text not null default '',
  caption       text,
  tone          text not null default 'mint',        -- mint/sky/lavender/sand/cream
  sort_order    int  not null default 0,
  is_published  boolean not null default true
);

-- 상담 신청
create table public.consultations (
  id                uuid primary key default gen_random_uuid(),
  name              text not null check (char_length(name) between 1 and 50),
  phone             text not null check (phone ~ '^[0-9]{9,11}$'),
  region            text,
  roof_area_pyeong  numeric,
  message           text check (char_length(message) <= 2000),
  agree_privacy     boolean not null check (agree_privacy = true),
  source            text,
  created_at        timestamptz not null default now()
);

-- RLS: 익명(anon)은 공개 데이터 읽기 + 상담 신청 쓰기만 가능
alter table public.sites         enable row level security;
alter table public.stats         enable row level security;
alter table public.consultations enable row level security;

create policy "public read published sites" on public.sites
  for select to anon using (is_published = true);

create policy "public read published stats" on public.stats
  for select to anon using (is_published = true);

create policy "anon can submit consultation" on public.consultations
  for insert to anon with check (agree_privacy = true);

-- consultations 에는 select 정책이 없으므로 anon 은 조회할 수 없습니다.
-- 관리자 조회는 Supabase 대시보드 또는 service_role 키(서버 전용)로 합니다.
