-- 관리자 페이지(/admin) 용 권한·테이블
-- schema.sql 실행 후, Supabase SQL Editor 에서 한 번 실행하세요. 여러 번 실행해도 됩니다.
-- 관리자 계정 등록 방법은 supabase/ADMIN.md 참고.

-- 1) 관리자 명단: 여기에 있는 로그인 계정만 관리자 페이지를 쓸 수 있습니다.
create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);
-- RLS 를 켜고 정책을 만들지 않음 → 사이트에서는 읽기·쓰기 모두 불가 (SQL Editor 로만 관리)
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

-- 지금 로그인한 계정이 관리자인지
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2) 상담 처리 상태
alter table public.consultations
  add column if not exists status text not null default 'new',
  add column if not exists handled_at timestamptz;

alter table public.consultations drop constraint if exists consultations_status_check;
alter table public.consultations
  add constraint consultations_status_check check (status in ('new', 'contacted', 'done', 'hold'));

-- 방문자는 상담을 "신규" 상태로만 넣을 수 있음 (상태를 미리 바꿔 넣지 못하게)
drop policy if exists "anon can submit consultation" on public.consultations;
create policy "anon can submit consultation" on public.consultations
  for insert to anon
  with check (agree_privacy = true and status = 'new' and handled_at is null);

-- 3) 상담 댓글 (통화 내용·처리 메모를 시간순으로 기록)
create table if not exists public.consultation_notes (
  id               uuid primary key default gen_random_uuid(),
  consultation_id  uuid not null references public.consultations (id) on delete cascade,
  body             text not null check (char_length(body) between 1 and 2000),
  author_email     text,
  created_at       timestamptz not null default now()
);
create index if not exists consultation_notes_consultation_idx
  on public.consultation_notes (consultation_id, created_at);
alter table public.consultation_notes enable row level security;
revoke all on public.consultation_notes from anon;

-- 4) 관리자 권한: 상담 조회·수정·삭제, 댓글, 현장(후기)·실적 관리
grant select, update, delete on public.consultations to authenticated;
grant select, insert, delete on public.consultation_notes to authenticated;
grant select, insert, update, delete on public.sites, public.stats to authenticated;

drop policy if exists "admin read consultations" on public.consultations;
create policy "admin read consultations" on public.consultations
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "admin update consultations" on public.consultations;
create policy "admin update consultations" on public.consultations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admin delete consultations" on public.consultations;
create policy "admin delete consultations" on public.consultations
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "admin manage notes" on public.consultation_notes;
create policy "admin manage notes" on public.consultation_notes
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admin manage sites" on public.sites;
create policy "admin manage sites" on public.sites
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admin manage stats" on public.stats;
create policy "admin manage stats" on public.stats
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
