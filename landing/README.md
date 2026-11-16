# 케이파워 솔라 랜딩페이지 (A안)

`KPOWER_DESIGN_GUIDE.md` 3장 기준 · React 18 + TypeScript + Vite

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입체크 + 빌드 (dist/)
```

## 구조

```
src/
  sections/   Header, Hero, ServiceBento, SiteRail, StatsBento, ConsultForm, WhySection, CtaBanner, Footer, StickyCta
  components/ Photo(사진/자리표시), Logo, Icons, SectionHeader
  styles/     tokens.css(가이드 토큰) · base.css · landing.css
  data/       company.ts(회사정보·○○ 교체) · mock.ts(목업 데이터)
  lib/        supabase.ts (클라이언트, 동적 import)
  services/   sites · stats · consultations (Supabase ↔ 목업 자동 분기)
  hooks/      useLatestSites, useStats
  types/      domain.ts(앱 타입) · database.ts(DB 타입)
supabase/schema.sql  테이블 + RLS
```

## Supabase 연동 (현재 미사용)

1. Supabase 프로젝트 생성 → SQL Editor 에서 `supabase/schema.sql` 실행
2. `.env.example` 을 `.env.local` 로 복사 후 URL·anon key 입력
3. `VITE_USE_SUPABASE=true` 로 변경 → 재시작

비활성 상태에서는 `src/data/mock.ts` 데이터를 쓰고, 상담 신청은 저장하지 않고 콘솔에만 출력합니다.
컴포넌트는 `services/*` 만 호출하므로 연동 시 UI 코드는 바꿀 필요가 없습니다.

## 사진 넣기

`Photo` 컴포넌트에 `src`(+`srcSet`)를 주면 실제 이미지, 없으면 자리표시 박스가 나옵니다.
히어로: `sections/Hero.tsx` 의 `SLIDES[].image` / 서비스 카드: `ServiceBento.tsx` 의 `SERVICES[].image` / 현장: DB `images` 배열.
