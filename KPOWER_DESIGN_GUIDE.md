ㄷ# 케이파워 솔라 웹 디자인 가이드

> 대상: 케이파워 솔라(K-POWER SOLAR, 구 부울경태양광) 웹사이트
> - **A안 — 랜딩페이지** (광고 유입 → 상담 전환용, 솔라쉐어 스타일)
> - **B안 — 회사 홈페이지** (브랜드·시공실적·회사 신뢰용, e편한세상 스타일)
>
> 이 문서는 디자인 시안(캔버스 "2차 시안")을 실제 개발로 옮기기 위한 기준서입니다.
> 토큰(색·서체·간격) → 공통 규칙 → A안 → B안 → 체크리스트 순서입니다.

---

## 0. 레퍼런스에서 가져온 것 / 가져오지 않은 것

| 레퍼런스 | 가져온 것 | 가져오지 않은 것 |
|---|---|---|
| 솔라쉐어 (solarshare.co.kr) | 풀블리드 사진 히어로, 크기가 다른 둥근 카드 배치(벤토), 시공현장·후기를 섞은 가로 스크롤, 파스텔 톤 실적 카드, 사진을 깐 다크 섹션 + 반투명 카드 | 로고, 문구, 사진, 실적 수치, 브랜드 컬러 |
| e편한세상 브랜드 (elife.co.kr) | 아이보리 배경, 가는 서체와 넓은 여백, 페이지 타이틀 + 서브탭, 글·사진이 번갈아 나오는 잡지형 구성, 가는 선으로 나눈 수치 | 로고(구름 모양), 오렌지 브랜드 컬러 그대로 쓰기, 문구 |
| e편한세상 단지 페이지 (dlcon-apt.co.kr) | 상태 배지(시공완료/발전중), 큰 현장명, 개요·정보 탭, 가는 선 정보표 | 일러스트, 레이아웃 그대로 복제 |

**주의**
- 기존 부울경태양광 사이트의 금액(15억, 4억, 연 3,200만 원)과 첨부 브로셔((주)중부발전·(주)남부발전)는 경쟁사 자료일 수 있습니다. 문구·수치·사진을 쓰지 않습니다.
- 모든 수치, 현장명, 후기, 사진은 **케이파워 솔라의 실제 자료**로만 채웁니다. 시안의 `○○`는 교체 전 표시입니다.

---

## 1. 공통 디자인 토큰

### 1-1. 브레이크포인트 (모바일 우선)

| 이름 | 범위 | 컨테이너 좌우 여백 | 비고 |
|---|---|---|---|
| `mobile` | 0 – 767px | 20px | 1단, 햄버거 메뉴, 하단 고정 상담바(A안) |
| `tablet` | 768 – 1023px | 32px | 2단 위주, 햄버거 메뉴 |
| `desktop` | 1024 – 1439px | 40px | 전체 메뉴 노출 |
| `wide` | 1440px 이상 | 40px | 컨테이너 최대폭 1320px 고정, 가운데 정렬 |

```css
/* 미디어쿼리 기준 (min-width, 모바일 우선) */
@media (min-width: 768px)  { /* tablet  */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1440px) { /* wide    */ }
```

### 1-2. 레이아웃

```css
.container {
  width: 100%;
  max-width: 1320px;            /* 컨텐츠 최대폭 */
  margin: 0 auto;
  padding-inline: var(--gutter);
  box-sizing: border-box;
}
:root { --gutter: 20px; }
@media (min-width: 768px)  { :root { --gutter: 32px; } }
@media (min-width: 1024px) { :root { --gutter: 40px; } }
```

### 1-3. 간격 스케일 (8px 기반)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--space-1` | 4px | 아이콘-텍스트 |
| `--space-2` | 8px | 배지 내부, 작은 간격 |
| `--space-3` | 12px | 버튼 묶음 |
| `--space-4` | 16px | 카드 내부 요소 |
| `--space-5` | 20px | 카드 간 간격(gap) |
| `--space-6` | 24px | 카드 패딩(모바일) |
| `--space-8` | 32px | 카드 패딩(데스크톱) |
| `--space-10` | 40px | 섹션 제목 ↔ 본문 |
| `--space-16` | 64px | 2단 사이 간격 |
| `--section-y` | 64 / 88 / 110~120px | 섹션 상하 여백 (모바일/태블릿/데스크톱) |

```css
:root { --section-y: 64px; }
@media (min-width: 768px)  { :root { --section-y: 88px; } }
@media (min-width: 1024px) { :root { --section-y: 112px; } }
.section { padding-block: var(--section-y); }
```

### 1-4. 서체

| 용도 | 서체 | 비고 |
|---|---|---|
| 한글 본문·제목 | **Noto Sans KR** (300/400/500/700) | Google Fonts. Pretendard로 바꿔도 같은 굵기 체계 유지 |
| 영문 디스플레이 (B안 전용) | **Jost** (200/300/400) | 키비주얼 영문, 큰 숫자, 가치 키워드 |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Jost:wght@200;300;400&display=swap" rel="stylesheet">
```

공통 규칙
- 한글 자간 `letter-spacing: -0.02em` (본문·제목 공통)
- 본문 줄간격 1.7 (A안) / 1.9~2.0 (B안, 여유 있게)
- 본문 최소 15px (모바일 15px, 데스크톱 16px)
- 제목에는 `word-break: keep-all;`을 적용해 한글 단어가 중간에서 끊기지 않게 합니다.

```css
body { font-family: 'Noto Sans KR', sans-serif; letter-spacing: -0.02em; word-break: keep-all; }
```

### 1-5. 반경·그림자

| 토큰 | A안 (랜딩) | B안 (회사) |
|---|---|---|
| 카드 반경 | 20–24px (둥글게) | 0–6px (각지게, 절제) |
| 버튼 반경 | 999px (알약형) | 0 또는 999px(배지만) |
| 그림자 | 거의 없음, 사진 위 카드만 약하게 | 사용하지 않음, 선으로 구분 |

---

## 2. 공통 컴포넌트 규칙

### 2-1. 이미지 (가장 중요)
시안이 "AI처럼" 보였던 가장 큰 이유는 사진이 없어서였습니다. 실제 사진이 디자인의 80%를 차지합니다.

| 용도 | 비율 | 권장 원본 크기 | 비고 |
|---|---|---|---|
| A안 히어로 | 16:9 (모바일 4:5로 크롭) | 2400×1350 | 드론 항공사진. 텍스트 쪽이 어두운 사진 |
| A안 서비스 카드 | 자유 크롭 | 1600px 이상 | 지붕 패널, 공장 외관, 상담 장면 |
| A안 현장 카드 | 4:3 | 1200×900 | 같은 높이로 맞춤 |
| B안 키비주얼 | 21:9 (모바일 4:5) | 2600×1100 | 사람 없는 정제된 현장 사진 |
| B안 가치·소개 사진 | 3:2 | 1800×1200 | 작업 장면, 디테일 컷 |
| B안 현장 상세 | 16:9 슬라이드 | 2400×1350 | 드론 + 지상 디테일 섞기 |

- 포맷: WebP(+ JPG 대체), `srcset`으로 768/1280/1920 3단계
- 사진 위 텍스트: `rgba(10,16,30,.45)` 어두운 막을 깔아 대비 4.5:1 이상 확보
- `loading="lazy"`는 첫 화면 사진을 제외한 모든 이미지에 적용
- 모든 사진에 `alt` 필수 (예: `alt="김해 진영 공장 지붕 태양광 450kW 준공 항공사진"`)

```html
<img src="/img/site-gimhae-1280.webp"
     srcset="/img/site-gimhae-768.webp 768w, /img/site-gimhae-1280.webp 1280w, /img/site-gimhae-1920.webp 1920w"
     sizes="(min-width:1024px) 50vw, 100vw"
     alt="김해 진영 공장 지붕 태양광 준공 항공사진" loading="lazy">
```

### 2-2. 헤더
- 높이: 모바일 60px / 데스크톱 76px(A) · 84px(B)
- 스크롤 시 `position: sticky; top: 0;` + 흰 배경 + 하단 1px 선
- 1023px 이하: 메뉴를 숨기고 햄버거(44×44 터치영역) + 전화 아이콘 버튼 노출
- 모바일 메뉴는 전체화면 시트. 첫 항목으로 상담 버튼, 마지막에 전화번호

### 2-3. 접근성 최소 기준
- 텍스트 대비 4.5:1 이상 (큰 글씨 24px 이상은 3:1)
- 버튼·링크 터치영역 최소 44×44px
- 버튼은 `<button>`/`<a href>`만 사용 (div 클릭 금지)
- 아이콘만 있는 버튼에는 `aria-label` (예: `aria-label="전화 상담 010-3675-4804"`)
- 가로 스크롤 영역은 키보드로도 이동할 수 있게 `tabindex="0"` + `aria-label`

---

## 3. A안 — 랜딩페이지 (솔라쉐어 스타일)

### 3-1. 목적과 톤
- 목적: 광고·검색 유입 → **상담 신청 / 전화 연결**
- 톤: 밝고 깨끗함, 사진 중심, 짧은 문장, 숫자로 설득
- 한 페이지 원페이지 구성, 상담 버튼을 섹션마다 반복

### 3-2. 컬러 토큰

```css
:root {
  /* A안 · 랜딩 */
  --a-brand:        #1B2A6B;  /* 메인 네이비: 로고, 강조 숫자, CTA 배경 */
  --a-brand-dark:   #0E1847;  /* hover */
  --a-ink:          #1A1A1A;  /* 본문 제목 */
  --a-text:         #333333;  /* 본문 */
  --a-sub:          #555555;  /* 보조 텍스트 (흰 배경 대비 7.4:1) */
  --a-muted:        #777777;  /* 캡션 (4.5:1) */
  --a-line:         #EEEEEE;
  --a-bg:           #FFFFFF;
  --a-bg-soft:      #F6F7F9;  /* 현장 섹션, 푸터 */
  --a-dark:         #1E2533;  /* 다크 카드 */

  /* 파스텔 카드 (실적 벤토) */
  --a-mint:         #E9F5EE;  --a-mint-ink:     #3D5A49;
  --a-sky:          #E7EEF8;  --a-sky-ink:      #3A4A66;
  --a-lavender:     #F1EEFA;  --a-lavender-ink: #4C4566;
  --a-sand:         #EDEAE4;  /* 서비스 카드 */
  --a-cream:        #F3EFE8;
  --a-price-bg:     #EEF2FA;  /* 임대료 박스 */

  --a-overlay:      rgba(10,16,30,.45);
}
```

### 3-3. 타이포 스케일 (A안)

| 요소 | 모바일 | 데스크톱 | 굵기 | CSS |
|---|---|---|---|---|
| 히어로 H1 | 30px | 52px | 700 | `font-size: clamp(30px, 4.2vw, 52px); line-height: 1.32;` |
| 섹션 H2 | 24px | 38px | 700 | `clamp(24px, 3vw, 38px)` |
| 카드 제목 | 20px | 24–26px | 700 | `clamp(20px, 2vw, 26px)` |
| 실적 숫자 | 28px | 36px | 700 | `clamp(28px, 3vw, 36px)` |
| 본문 | 15px | 16px | 400 | line-height 1.7 |
| 캡션 | 13px | 13–14px | 400 | |

### 3-4. 버튼

| 종류 | 스타일 | 사용처 |
|---|---|---|
| 아웃라인 알약 (사진 위) | 테두리 `1px rgba(255,255,255,.8)`, 흰 글씨, `padding 14px 26px`, 반경 999px | 히어로 |
| 솔리드 흰색 알약 | 흰 배경 + `--a-brand` 글씨, 굵게 | 네이비 CTA 배너 |
| 솔리드 네이비 | `--a-brand` 배경 + 흰 글씨 | 상담폼 제출 |
| 텍스트 링크 | `전체 보기 ›` 15px, `--a-text` | 섹션 우측 상단 |

### 3-5. 섹션 구성과 반응형 규칙

| # | 섹션 | 데스크톱 (≥1024) | 태블릿 (768–1023) | 모바일 (≤767) |
|---|---|---|---|---|
| 1 | 헤더 | 로고 · 메뉴 5개 · 전화/상담 | 로고 · 전화 · 햄버거 | 동일, 높이 60px |
| 2 | 히어로 | 높이 720px, 좌측 텍스트, 슬라이드 표시 01—02 | 높이 600px | `min-height: 88svh`, 사진 4:5 크롭, 텍스트 하단 정렬, 버튼 전체폭 |
| 3 | 서비스 벤토 | 좌: 큰 카드(min 520px) / 우: 작은 카드 2장 세로 | 큰 카드 전체폭 + 작은 카드 2장 가로 | 3장 세로 스택 (큰 카드 360px, 작은 카드 220px) |
| 4 | 현장 + 후기 가로 스크롤 | 카드 300px, 4장 이상 노출 | 카드 280px | 카드 `82vw` + 다음 카드 살짝 보이게, scroll-snap |
| 5 | 실적 벤토 | 3열 (첫 카드 `span 2`) | 2열 (첫 카드 `span 2`) | 2열 작은 카드 (숫자 28px), 첫 카드 전체폭 |
| 6 | 상담폼 (추가 권장) | 좌 카피 / 우 폼 카드 | 동일 2단 | 1단, 폼 먼저 |
| 7 | 다크 사진 섹션 | 좌 제목 / 우 카드 3장 가로 | 제목 위 + 카드 3장 가로 | 제목 위 + 카드 세로 스택 |
| 8 | 상담 배너 | 네이비 둥근 박스, 좌 문구 / 우 버튼 | 동일 | 세로 정렬, 버튼 전체폭 |
| 9 | 푸터 | 회사정보 3줄 | 동일 | 동일, 13px |
| — | **하단 고정 상담바** | 없음 | 없음 | **필수**: `[전화하기] [상담신청]` 2버튼, 높이 64px, `safe-area-inset-bottom` 적용 |

### 3-6. 핵심 컴포넌트 코드

**서비스 벤토**
```css
.a-bento { display: grid; gap: 20px; grid-template-columns: 1fr; }
.a-bento__card { border-radius: 24px; padding: 28px; position: relative; overflow: hidden;
                 min-height: 220px; color: var(--a-ink); text-decoration: none; }
.a-bento__card--main { min-height: 360px; background: var(--a-sand); }
@media (min-width: 768px) {
  .a-bento { grid-template-columns: 1fr 1fr; }
  .a-bento__card--main { grid-column: 1 / -1; }
}
@media (min-width: 1024px) {
  .a-bento { grid-template-columns: 1.1fr 1fr; grid-template-rows: 1fr 1fr; }
  .a-bento__card--main { grid-column: 1; grid-row: 1 / span 2; min-height: 520px; padding: 40px; }
}
.a-bento__card img { position: absolute; right: 0; bottom: 0; width: 62%; height: 60%;
                     object-fit: cover; border-top-left-radius: 20px; }
```

**현장 + 후기 가로 스크롤**
```css
.a-rail { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory;
          padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
.a-rail > * { flex: 0 0 82vw; scroll-snap-align: start; border-radius: 20px; background: #fff; }
@media (min-width: 768px)  { .a-rail > * { flex-basis: 280px; } }
@media (min-width: 1024px) { .a-rail > * { flex-basis: 300px; } }
```
- 카드 종류 2가지를 번갈아 배치: **현장 카드**(사진 4:3, 현장명, `지붕 ○○○평 · ○○○kW`, 연 임대료 박스) / **후기 카드**(큰따옴표, 후기 3~4줄, 프로필 원형 48px, `공장 지붕 ○○○평 / 50대 · 업종`)
- 후기는 **실제 고객 동의를 받은 것만** 사용합니다.

**실적 벤토**
```css
.a-stats { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0,1fr)); }
.a-stats > :first-child { grid-column: 1 / -1; }
@media (min-width: 1024px) {
  .a-stats { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; }
  .a-stats > :first-child { grid-column: span 2; }
}
.a-stat { border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 8px; }
@media (min-width: 1024px) { .a-stat { padding: 32px; } }
```

**모바일 하단 고정 상담바**
```css
.a-sticky-cta { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
  display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom)); background: #fff;
  box-shadow: 0 -4px 16px rgba(0,0,0,.08); }
.a-sticky-cta a { min-height: 48px; display: flex; align-items: center; justify-content: center;
  border-radius: 12px; font-weight: 700; text-decoration: none; }
@media (min-width: 768px) { .a-sticky-cta { display: none; } }
body.has-sticky-cta { padding-bottom: 72px; }
@media (min-width: 768px) { body.has-sticky-cta { padding-bottom: 0; } }
```

### 3-7. A안 카피 원칙
- 문장은 짧고 구체적으로. "혁신적인 솔루션" 같은 추상어는 쓰지 않습니다.
- 숫자에는 항상 기준을 붙입니다: `연 임대료 약 ○,○○○만 원 (지붕 ○○○평 기준)`
- 수익 문구 아래에는 고지문을 둡니다: `※ 실제 수익과 계약조건은 공장 위치, 지붕 면적, 한전 선로 상황에 따라 달라질 수 있습니다.`
- 히어로 예시: `놀고 있는 공장 지붕, / 이제 매년 임대료를 받으세요`

### 3-8. A안 SEO 메타 예시
```html
<title>공장 지붕 태양광 임대 | 부산·울산·경남 | 케이파워 솔라</title>
<meta name="description" content="부산·울산·경남 공장 지붕 태양광. 한전 선로 무료 조회, 지붕 임대·발전소 구축 상담. 케이파워 솔라 010-3675-4804">
<meta property="og:image" content="/img/og-landing.jpg"> <!-- 1200×630 실제 현장 사진 -->
```

---

## 4. B안 — 회사 홈페이지 (e편한세상 스타일)

### 4-1. 목적과 톤
- 목적: 브랜드 신뢰, **시공실적 아카이브**, 회사 정보. 영업 미팅 후 고객이 찾아보는 사이트
- 톤: 차분하고 고급스러움, 가는 서체, 넓은 여백, 선으로 구분

### 4-2. 사이트맵

```
/                        메인 (키비주얼 · 소개 · 가치 · 대표 현장 · 수치)
/brand/value             브랜드 > 핵심 가치
/brand/history           브랜드 > 연혁
/brand/ci                브랜드 > CI
/sites                   시공현장 목록 (지역 필터: 부산·울산·김해·양산·창원)
/sites/{id}              시공현장 상세 (개요 · 현장정보 · 설비정보 · 수익구조)
/business/models         사업안내 > 수익모델
/business/process        사업안내 > 진행절차
/business/faq            사업안내 > FAQ
/support/contact         고객센터 > 상담신청
/support/notice          고객센터 > 공지사항
```
상담 유입은 A안 랜딩(`/lp` 또는 별도 도메인)으로 연결합니다.

### 4-3. 컬러 토큰

```css
:root {
  /* B안 · 회사 */
  --b-brand:        #E8641B;  /* 케이파워 썬 오렌지: 로고, 활성 탭, 배지 (장식·큰 글씨용) */
  --b-brand-text:   #C4511A;  /* 오렌지 '글씨'용 (흰 배경 대비 4.6:1) */
  --b-brand-dark:   #9C3E12;  /* hover */
  --b-navy:         #17233A;  /* 키비주얼, 현장 상세 상단 */
  --b-navy-sub:     #4A5468;  /* 시공완료 배지 */
  --b-ink:          #222222;
  --b-text:         #555555;  /* 본문 (얇은 300 굵기와 함께) */
  --b-muted:        #888888;  /* 표 라벨 (큰 글씨·라벨 전용) */
  --b-line:         #E5E0D8;  /* 따뜻한 회색 선 */
  --b-line-strong:  #222222;  /* 표 첫 줄 */
  --b-bg:           #FFFFFF;
  --b-ivory:        #FBF8F3;  /* 소개·수치 섹션 배경 */
  --b-beige:        #EFE9E0;
  --b-footer:       #2B2B2B;
  --b-on-dark-sub:  #D5DBE6;  /* 네이비 위 보조 글씨 */
}
```
- 오렌지 `#E8641B`는 흰 글씨를 올리는 배지나 큰 요소에만 씁니다. 본문 크기 오렌지 글씨는 `--b-brand-text`를 사용합니다.
- `--b-muted #888888`은 흰 배경 대비 3.5:1이라 14px 라벨에서는 부족합니다. 실서비스에서는 `#767676`(4.5:1)로 올리는 것을 권장합니다.

### 4-4. 타이포 스케일 (B안)

| 요소 | 모바일 | 데스크톱 | 서체 / 굵기 | 비고 |
|---|---|---|---|---|
| 키비주얼 영문 | 44px | 88px | Jost 200 | `clamp(44px, 6.5vw, 88px); line-height: 1;` |
| 페이지 타이틀 (브랜드 스토리) | 28px | 44px | Noto 500 | 가운데 정렬 |
| 섹션 라벨 | 14px | 15px | Noto 500, `--b-brand-text` | "브랜드 가치" |
| 섹션 H2 | 26px | 40px | Noto 300 + 강조 700 | 두 줄 중 한 줄만 굵게 |
| 가치 키워드 | 18px | 20px | Jost 300, 오렌지 | Survey / Build / Care |
| 가치 제목 H3 | 22px | 28px | Noto 500 | |
| 현장명 (상세) | 30px | 52px | Noto 700 | |
| 큰 수치 | 40px | 56px | Jost 200 | 단위는 22px |
| 본문 | 15px | 16px | Noto 300 | line-height 1.9 |

### 4-5. 섹션 구성과 반응형 규칙 (메인 + 브랜드)

| # | 섹션 | 데스크톱 (≥1024) | 태블릿 | 모바일 (≤767) |
|---|---|---|---|---|
| 1 | 헤더 | 로고 · 대메뉴 4개 (간격 56px) · 유틸(현장 찾기 / 상담신청) | 로고 · 햄버거 | 동일, 높이 60px |
| 2 | 페이지 타이틀 + 서브탭 | 3등분 탭, 활성 탭 하단 2px 오렌지 | 동일 | 탭 가로 스크롤 (`overflow-x:auto`), 탭 폭은 내용 크기 |
| 3 | 키비주얼 | 높이 620px, 좌 네이비 + 영문 / 우 사진 58% | 높이 520px, 사진 50% | 사진 위, 네이비 영역 아래로 세로 배치 (사진 4:5, 영문 44px) |
| 4 | 에디토리얼 소개 | 좌 글(**오른쪽 정렬**) / 우 사진 | 동일 | 사진 먼저, 글 **왼쪽 정렬** |
| 5 | 브랜드 가치 3행 | 사진·글 좌우 교차 | 동일 | 항상 사진 위 → 글 아래, 정렬은 모두 왼쪽 |
| 6 | 대표 시공현장 | 네이비 상단(배지·현장명·버튼·사진) + 흰 하단(탭·정보표) | 동일 | 정보표 1열, 탭 가로 스크롤 |
| 7 | 수치로 보는 기록 | 4열, 세로 구분선 | 4열 | 2×2, 구분선 대신 행 사이 가로선 |
| 8 | 푸터 | 다크 그레이, 링크 줄 + 회사정보 | 동일 | 회사정보 항목별 줄바꿈 |

### 4-6. 핵심 컴포넌트 코드

**서브탭 (e편한세상식)**
```css
.b-subtab { display: flex; border-bottom: 1px solid var(--b-line); overflow-x: auto; scrollbar-width: none; }
.b-subtab a { flex: 1 0 auto; padding: 18px 20px; text-align: center; color: var(--b-ink);
              text-decoration: none; white-space: nowrap; }
.b-subtab a[aria-current="page"] { color: var(--b-brand-text); border-bottom: 2px solid var(--b-brand); margin-bottom: -1px; }
@media (min-width: 1024px) { .b-subtab a { flex: 1 1 0; } }
```

**에디토리얼 / 가치 교차 행**
```css
.b-split { display: flex; flex-direction: column; gap: 32px; }
.b-split__media { aspect-ratio: 3 / 2; width: 100%; object-fit: cover; }
.b-split__text { text-align: left; }
@media (min-width: 768px) {
  .b-split { flex-direction: row; align-items: center; gap: 64px; }
  .b-split > * { flex: 1 1 0; min-width: 0; }
  .b-split--reverse { flex-direction: row-reverse; }   /* 2번째 행: 글 왼쪽, 사진 오른쪽 */
  .b-split--reverse .b-split__text,
  .b-split--intro .b-split__text { text-align: right; } /* e편한세상식 오른쪽 정렬 */
}
```
HTML 순서는 항상 **사진 → 글**로 작성합니다. 그래야 모바일에서 사진이 먼저 나옵니다. 데스크톱에서는 `row-reverse`로 좌우를 바꿉니다.

**시공현장 상세 정보표**
```css
.b-info { display: grid; grid-template-columns: 1fr; column-gap: 48px; }
.b-info__row { display: flex; flex-direction: column; gap: 8px; padding: 20px 0; border-top: 1px solid var(--b-line); }
.b-info__row:first-child { border-top-color: var(--b-line-strong); }
.b-info__label { font-size: 14px; color: #767676; }
@media (min-width: 768px) {
  .b-info { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .b-info__row:nth-child(-n+2) { border-top-color: var(--b-line-strong); }
}
```
정보표 항목: 위치 / 지붕 면적(㎡·평 병기) / 설치 용량 / 지붕 형태·공법 / 사업 방식 / 준공 (+ 상세 페이지에서는 모듈·인버터, 연간 발전량)

**상태 배지**
```css
.b-badge { display: inline-flex; align-items: center; height: 32px; padding: 0 16px; border-radius: 999px;
           font-size: 14px; color: #fff; }
.b-badge--done    { background: var(--b-navy-sub); }  /* 시공완료 */
.b-badge--running { background: var(--b-brand); }     /* 발전중 */
.b-badge--build   { background: #2F6F5E; }            /* 시공중 */
.b-badge--permit  { background: #6B6B6B; }            /* 인허가중 */
```

**수치 4열 → 2×2**
```css
.b-record { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); text-align: center; }
.b-record > * { padding: 20px 0; }
.b-record > :nth-child(n+3) { border-top: 1px solid var(--b-line); }
@media (min-width: 768px) {
  .b-record { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .b-record > :nth-child(n+3) { border-top: 0; }
  .b-record > * + * { border-left: 1px solid #E0D9CE; }
}
.b-record strong { font-family: 'Jost', sans-serif; font-weight: 200; font-size: clamp(40px, 4.5vw, 56px); }
```

### 4-7. 시공현장 목록 페이지 (/sites)
- 상단: 페이지 타이틀 "시공현장" + 지역 탭 (전체·부산·울산·김해·양산·창원)
- 목록: 데스크톱 3열 / 태블릿 2열 / 모바일 1열 카드
- 카드: 사진 4:3 (각진 모서리), 좌상단 상태 배지, 현장명(18px 500), `○○○kW · 지붕 임대형 · 2026.○○`
- 정렬: 최신 준공순 기본, 12개씩 "더 보기"

### 4-8. B안 카피 원칙
- 과장 대신 태도와 기준을 말합니다: "먼저, 꼼꼼히 살핍니다", "공장은 멈추지 않게", "준공 후에도 곁에서"
- 영문은 키비주얼 1곳과 가치 키워드에만 씁니다.
- 수치·인증·면허는 서류로 증명할 수 있는 것만 씁니다.

---

## 5. 두 사이트를 함께 운영할 때

| 항목 | A안 랜딩 | B안 회사 |
|---|---|---|
| 주소 예 | `kpowersolar.co.kr/lp` 또는 별도 도메인 | `kpowersolar.co.kr` |
| 메인 컬러 | 네이비 `#1B2A6B` | 오렌지 `#E8641B` + 네이비 `#17233A` |
| 모서리 | 둥글게 (20–24px) | 각지게 (0–6px) |
| 서체 굵기 | 400/700 | 300/500 (+영문 Jost 200) |
| 공통 | 로고, 전화번호, 회사 정보, 실제 현장 사진, 개인정보처리방침 |

- 두 사이트의 브랜드 컬러가 다르므로 **로고 심볼은 하나로 통일**합니다. 오렌지 심볼 + 네이비 워드마크 조합을 권장합니다. 그러면 A안 로고에도 오렌지 포인트를 넣어 연결감을 줄 수 있습니다.
- 시공현장 데이터는 한 곳(DB/JSON)에서 관리합니다. B안 `/sites`가 원본이고, A안 가로 스크롤 카드는 같은 데이터를 최신 6건만 불러옵니다.

**현장 데이터 구조 예시**
```json
{
  "id": "gimhae-jinyeong-001",
  "name": "○○금속 지붕 태양광 발전소",
  "region": "김해",
  "address": "경상남도 김해시 진영읍 ○○로",
  "roofAreaM2": 0,
  "roofAreaPyeong": 0,
  "capacityKw": 0,
  "roofType": "샌드위치 패널",
  "method": "무타공 공법",
  "model": "ROOF_LEASE",
  "status": "RUNNING",
  "completedAt": "2026-00",
  "annualLeaseKrw": null,
  "images": ["/img/sites/gimhae-001-1.webp"],
  "review": { "text": "", "author": "50대 · 금속가공 대표", "consent": true }
}
```
`model`: `ROOF_LEASE`(지붕 임대형) / `OWN_PLANT`(발전소 구축형) / `PREPAID_LEASE`(임대료 선지급형)
`status`: `PERMIT`(인허가중) / `BUILDING`(시공중) / `DONE`(시공완료) / `RUNNING`(발전중)

---

## 6. 개발 전 체크리스트

**자료 준비 (디자인 품질에 가장 큰 영향)**
- [ ] 시공현장 드론사진 (현장별 최소 2장: 전경 + 디테일)
- [ ] 공장 외관, 작업 장면, 상담 장면 사진
- [ ] 로고 원본 (SVG)
- [ ] 실제 누적 용량, 현장 수, 지급 임대료, 상담 기업 수
- [ ] 수익모델별 금액과 조건 (경쟁사 수치 사용 금지)
- [ ] 동의받은 고객 후기 2개 이상
- [ ] 사업자등록번호, 전기공사업 면허번호, 대표자명, 이메일
- [ ] 파트너십 문구 확인 (기존 "(주)아주쏠라 HD현대에너지솔루션 파트너십" 유지 여부)

**반응형 검수 폭**
- [ ] 360px (작은 안드로이드) / 390px (아이폰) / 768px (태블릿 세로) / 1024px / 1440px / 1920px
- [ ] 360px에서 가로 스크롤이 생기지 않는지 확인 (가로 스크롤 레일 제외)
- [ ] 모바일 하단 고정 상담바가 푸터 정보를 가리지 않는지 확인 (A안)
- [ ] 한글 제목이 단어 중간에서 끊기지 않는지 확인 (`word-break: keep-all`)

**성능**
- [ ] 첫 화면 이미지 `fetchpriority="high"`, 나머지 `loading="lazy"`
- [ ] 이미지 WebP, 히어로 400KB 이하
- [ ] 폰트는 필요한 굵기만 로드 (A: 400/700, B: 300/500/700 + Jost 200/300)
