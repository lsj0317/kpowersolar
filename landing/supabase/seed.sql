-- 케이파워 솔라 예시 데이터 (src/data/mock.ts 와 동일)
-- schema.sql 실행 후, Supabase SQL Editor 에서 실행하세요.
-- 여러 번 실행해도 됩니다. (같은 id 는 덮어씀)
-- 수치·현장명·후기는 자리표시(○○)이므로 실제 자료로 교체하세요.

-- 시공현장
insert into public.sites (
  id, name, region, address,
  roof_area_m2, roof_area_pyeong, capacity_kw,
  roof_type, method, model, status, completed_at, annual_lease_krw, images,
  review_text, review_author, review_consent, is_published
) values
  ('gimhae-jinyeong-001', '○○금속 지붕 태양광 발전소', '김해', '경상남도 김해시 진영읍 ○○로',
   0, 0, 0, '샌드위치 패널', '무타공 공법', 'ROOF_LEASE', 'RUNNING', '2026-00', null, '{}',
   '지붕만 빌려줬는데 매년 임대료가 들어옵니다. 공사 기간에도 공장은 그대로 돌아갔어요.',
   '50대 · 금속가공 대표', true, true),

  ('yangsan-002', '○○산업 제2공장', '양산', '경상남도 양산시 ○○로',
   0, 0, 0, '징크', '레일 공법', 'OWN_PLANT', 'DONE', '2026-00', null, '{}',
   null, null, false, true),

  ('ulsan-003', '○○화학 물류창고', '울산', '울산광역시 울주군 ○○로',
   0, 0, 0, '샌드위치 패널', '무타공 공법', 'PREPAID_LEASE', 'RUNNING', '2026-00', null, '{}',
   '선로 조회부터 인허가까지 알아서 챙겨줘서 신경 쓸 일이 거의 없었습니다.',
   '40대 · 물류업 대표', true, true),

  ('busan-004', '○○정밀 공장', '부산', '부산광역시 강서구 ○○로',
   0, 0, 0, '컬러강판', '무타공 공법', 'ROOF_LEASE', 'BUILDING', '2026-00', null, '{}',
   null, null, false, true),

  ('changwon-005', '○○기계 본사 공장', '창원', '경상남도 창원시 성산구 ○○로',
   0, 0, 0, '샌드위치 패널', '레일 공법', 'ROOF_LEASE', 'PERMIT', '2026-00', null, '{}',
   null, null, false, true)
on conflict (id) do update set
  name = excluded.name,
  region = excluded.region,
  address = excluded.address,
  roof_area_m2 = excluded.roof_area_m2,
  roof_area_pyeong = excluded.roof_area_pyeong,
  capacity_kw = excluded.capacity_kw,
  roof_type = excluded.roof_type,
  method = excluded.method,
  model = excluded.model,
  status = excluded.status,
  completed_at = excluded.completed_at,
  annual_lease_krw = excluded.annual_lease_krw,
  images = excluded.images,
  review_text = excluded.review_text,
  review_author = excluded.review_author,
  review_consent = excluded.review_consent,
  is_published = excluded.is_published;

-- 실적 수치
insert into public.stats (id, label, value, unit, caption, tone, sort_order, is_published) values
  ('capacity', '누적 설치 용량', '○○.○', 'MW',     '2026년 ○월 기준',          'mint',     1, true),
  ('sites',    '준공 현장',      '○○',   '곳',     null,                       'sky',      2, true),
  ('lease',    '지급한 임대료',  '○○',   '억 원',  null,                       'lavender', 3, true),
  ('consult',  '상담 기업',      '○○○',  '곳',     null,                       'sand',     4, true),
  ('region',   '시공 지역',      '5',    '개 시·군', '부산·울산·김해·양산·창원', 'cream',    5, true)
on conflict (id) do update set
  label = excluded.label,
  value = excluded.value,
  unit = excluded.unit,
  caption = excluded.caption,
  tone = excluded.tone,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;
