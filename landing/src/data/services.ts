/**
 * 사업안내 상세페이지 콘텐츠 — content/service-details.md 원고 기준
 * (출처: 업체 홍보 전단지, 2026년 10월 말 기준 · 건물 약 2,000평 / 1,000kW)
 * 원고의 [확인] 항목은 ○○ 로 두거나 노출하지 않았습니다.
 */
import type { SiteModel } from '@/types/domain';

export type ServiceSlug = 'roof-lease' | 'own-plant' | 'prepaid-lease';

export interface Highlight {
  label: string;
  value: string;
  caption?: string;
}

export interface PointItem {
  title: string;
  desc: string;
}

export type ContentBlock =
  | {
      kind: 'table';
      title: string;
      desc?: string;
      head: string[];
      rows: string[][];
      /** 강조할 행 인덱스 (합계 등) */
      emphasize?: number[];
      notes?: string[];
    }
  | {
      kind: 'points';
      title: string;
      desc?: string;
      items: PointItem[];
    };

export interface ServiceDetail {
  slug: ServiceSlug;
  model: SiteModel;
  label: string;
  /** 서비스 벤토 카드용 짧은 제목/설명 */
  cardTitle: string;
  cardDesc: string;
  cardPoint: string;
  title: string;
  subtitle: string;
  tone: 'sand' | 'cream' | 'price';
  highlights: Highlight[];
  fit: string[];
  blocks: ContentBlock[];
  benefits: PointItem[];
  process: string[];
  extraNotes?: string[];
}

export const BASIS = '공장 건물 약 2,000평 · 발전용량 1,000kW 기준';

export const COMMON_NOTES = [
  '※ 위 금액은 공장 건물 약 2,000평 · 발전용량 1,000kW 기준 예시이며, 2026년 10월 말 기준입니다.',
  '※ 실제 수익과 계약조건은 공장 위치, 지붕 면적·상태, 한전 선로 상황, 일사량, 전력 판매 단가에 따라 달라질 수 있습니다.',
];

export const COMMON_FAQ: PointItem[] = [
  {
    title: '지붕이 오래됐는데 설치할 수 있나요?',
    desc: '현장 점검에서 지붕 상태를 먼저 확인합니다. 보강이 필요하면 방법과 비용을 미리 안내해 드립니다.',
  },
  {
    title: '공사 중에 공장을 멈춰야 하나요?',
    desc: '아닙니다. 조업 중에도 공사를 진행합니다.',
  },
  {
    title: '우리 공장이 설치 가능한지 어떻게 아나요?',
    desc: '한전 선로 여유를 무료로 조회해 드립니다. 선로 여유가 없으면 계약 전에 미리 말씀드립니다.',
  },
];

export const SERVICES: ServiceDetail[] = [
  {
    slug: 'roof-lease',
    model: 'ROOF_LEASE',
    label: '지붕 임대형',
    cardTitle: '지붕만 빌려주고\n매년 임대료 받기',
    cardDesc: '설치·운영·보험은 저희가 맡고, 공장주는 매년 임대료를 받습니다.',
    cardPoint: '설치비 0원 · 관리 부담 없음',
    title: '지붕만 빌려주고,\n매년 임대료를 받으세요',
    subtitle:
      '설치비는 0원입니다. 설치·운영·관리는 케이파워 솔라가 맡고, 공장주는 계약 기간 동안 매년 임대료를 받습니다.',
    tone: 'sand',
    highlights: [
      { label: '공장주 부담', value: '0원', caption: '설치비·유지관리비' },
      { label: '연 임대료', value: '○,○○○만 원', caption: '1,000kW 기준' },
      { label: '계약 기간', value: '○○년' },
    ],
    fit: [
      '초기 투자 없이 지붕에서 고정 수입을 얻고 싶은 분',
      '대출을 받고 싶지 않은 분',
      '발전소 운영·관리에 신경 쓰고 싶지 않은 분',
    ],
    blocks: [
      {
        kind: 'table',
        title: '수익 구조',
        head: ['항목', '내용'],
        rows: [
          ['공장주 부담', '없음 (설치비·유지관리비 0원)'],
          ['공장주 수익', '매년 지붕 임대료'],
          ['임대료 기준', 'kW당 연 ○만 원'],
          ['예시 (1,000kW)', '연 약 ○,○○○만 원'],
          ['계약 기간', '○○년'],
        ],
      },
    ],
    benefits: [
      { title: '설치비 0원', desc: '공사비·자재비 부담이 없습니다.' },
      { title: '관리 부담 없음', desc: '발전량 모니터링, 정기 점검, 보험을 케이파워 솔라가 맡습니다.' },
      { title: '공장은 그대로', desc: '조업 중에도 공사를 진행합니다.' },
    ],
    process: ['무료 상담', '한전 선로 조회', '현장 점검', '임대 계약', '인허가', '시공', '준공·임대료 지급 시작'],
  },
  {
    slug: 'own-plant',
    model: 'OWN_PLANT',
    label: '발전소 구축형',
    cardTitle: '내 공장 지붕에\n내 발전소 짓기',
    cardDesc: '공사비는 대출로 마련하고, 발전 수익으로 갚아 나갑니다.',
    cardPoint: '연 발전 수익 약 3억 원 (1,000kW 기준)',
    title: '내 공장 지붕에 내 발전소를 짓고,\n발전 수익을 직접 받으세요',
    subtitle:
      '공장 건물 약 2,000평(1,000kW) 기준 연간 발전 수익 약 3억 원. 공사비는 대출로 마련하고, 발전 수익으로 갚아 나갑니다.',
    tone: 'cream',
    highlights: [
      { label: '연 발전 수익', value: '약 3억 원', caption: '1,000kW 기준' },
      { label: '월 순수익', value: '약 2,357만 원', caption: '정부 정책자금형 · 거치 기간' },
      { label: '시공 단가', value: 'kW당 86만 원', caption: '한전 계통연계비 별도' },
    ],
    fit: [
      '발전 수익을 직접 가져가고 싶은 분',
      '대출을 활용해 초기 부담을 줄이고 싶은 분',
      '장기적으로 공장의 고정 수익원을 만들고 싶은 분',
    ],
    blocks: [
      {
        kind: 'table',
        title: '두 가지 자금 방식',
        head: ['', '전액 지원형', '정부 정책자금형'],
        rows: [
          ['자금', '공사비 전액 지원(대출)', '총 공사비의 80% 대출, 연 2.5%'],
          ['상환', '발전 수익으로 약 7년간 전액 상환', '5년 거치 · 10년 상환'],
          ['공장주 수익', '상환 후 발전 수익 100%', '거치 기간에도 이자를 빼고 월 순수익 발생'],
        ],
      },
      {
        kind: 'points',
        title: '전액 지원형',
        desc: '초기 투자 없이 발전 수익으로 대출금을 갚는 방식입니다.',
        items: [
          { title: '약 7년간 전액 상환', desc: '초기 약 7년간 발전 수익으로 대출금을 상환합니다. 수익이 좋으면 5~6년 안에도 상환할 수 있습니다.' },
          { title: '8년차부터 수익 100%', desc: '8년차부터 발생하는 발전 수익은 모두 공장주에게 돌아갑니다.' },
          { title: '매년 약 3억 원', desc: '상환 후에는 추가 투자 없이 직접 운영하며, 1,000kW 기준 매년 약 3억 원의 발전 수익이 납니다.' },
        ],
      },
      {
        kind: 'table',
        title: '정부 정책자금형 (연 2.5% · 5년 거치 10년 상환)',
        desc: `예시: ${BASIS}`,
        head: ['항목', '금액'],
        rows: [
          ['총 공사비', '8억 6천만 원 (kW당 86만 원, 한전 계통연계비 별도)'],
          ['대출금 (총 공사비의 80%)', '6억 8,800만 원'],
          ['대출 이자 (연 2.5%)', '월 약 143만 원'],
          ['월 발전 수익', '약 2,500만 원'],
          ['월 순수익 (발전 수익 − 대출 이자)', '약 2,357만 원'],
        ],
        emphasize: [4],
        notes: [
          '※ 월 순수익은 거치 기간(5년) 기준입니다. 6년차부터는 원금 상환분이 더해지므로 월 순수익이 줄어듭니다.',
          '※ 자기부담금은 총 공사비의 20%(약 1억 7,200만 원)와 한전 계통연계비입니다.',
        ],
      },
      {
        kind: 'points',
        title: '시공사를 고를 때 꼭 확인할 두 가지',
        items: [
          { title: '시공 단가가 얼마인가?', desc: 'kW당 단가와 계통연계비 포함 여부를 비교하세요. 케이파워 솔라는 kW당 86만 원(계통연계비 별도)입니다.' },
          { title: '믿을 수 있는 회사인가?', desc: '준공 실적, 전기공사업 면허, 준공 후 관리 체계를 확인하세요.' },
        ],
      },
    ],
    benefits: [
      { title: '연간 수익 규모', desc: '건물 약 2,000평 · 1,000kW 기준 매년 약 3억 원 정도의 평균 수익이 납니다.' },
      { title: '유지비가 적음', desc: '연료비가 없고, 정기 점검 위주로 관리합니다.' },
      { title: '안정적인 고정 수익', desc: '한 번 설치하면 설비 수명 동안 연금처럼 꾸준히 수익이 납니다.' },
    ],
    process: [
      '무료 상담',
      '한전 선로 조회',
      '현장 점검',
      '수익 시뮬레이션·자금 방식 선택',
      '대출 연계',
      '인허가',
      '시공',
      '준공·발전 시작',
      '모니터링·정기 점검',
    ],
    extraNotes: ['※ 대출 조건(금리·한도·거치/상환 기간)은 금융기관 심사 결과에 따라 달라질 수 있습니다.'],
  },
  {
    slug: 'prepaid-lease',
    model: 'PREPAID_LEASE',
    label: '임대료 선지급형',
    cardTitle: '5년 치 임대료를\n한 번에 먼저 받기',
    cardDesc: '목돈이 필요할 때 5년 치 임대료를 일시불로 받습니다.',
    cardPoint: '선지급 3억 5천만 원 (1,000kW 기준)',
    title: '5년 치 임대료 3억 5천만 원,\n한 번에 먼저 받으세요',
    subtitle:
      '공장 건물 약 2,000평(1,000kW) 기준. 서류 접수 후 약 2개월 안에 일시불로 지급하고, 6년차부터는 매년 임대료를 따로 받습니다.',
    tone: 'price',
    highlights: [
      { label: '1~5년차 선지급', value: '3억 5천만 원', caption: '서류 접수 후 약 2개월' },
      { label: '6년차부터', value: '연 4,000만 원', caption: '15년간 총 6억 원' },
      { label: '20년 합계', value: '9억 5천만 원', caption: '1,000kW 기준' },
    ],
    fit: [
      '설비 투자, 운영 자금, 부채 상환 등으로 목돈이 지금 필요한 분',
      '초기 투자와 대출 없이 지붕을 활용하고 싶은 분',
      '매년 받는 것보다 앞당겨 받는 쪽이 유리한 분',
    ],
    blocks: [
      {
        kind: 'table',
        title: '지급 구조',
        desc: `예시: ${BASIS}`,
        head: ['구간', '지급 방식', '금액', '산출 기준'],
        rows: [
          ['1~5년차', '일시불 선지급', '3억 5천만 원', 'kW당 연 7만 원 × 1,000kW = 연 7,000만 원 × 5년'],
          ['6~20년차 (15년간)', '매년 지급', '연 4,000만 원, 총 6억 원', 'kW당 연 4만 원 × 1,000kW = 연 4,000만 원 × 15년'],
          ['합계 (20년)', '', '9억 5천만 원', ''],
        ],
        emphasize: [2],
      },
    ],
    benefits: [
      { title: '설치비 0원 + 임대료 선지급', desc: '투자 없이 5년 치 임대료를 먼저 받습니다.' },
      { title: '빠른 지급', desc: '서류 접수 후 약 2개월 안에 지급합니다.' },
      { title: '이후에도 계속 수입', desc: '6년차부터 매년 임대료를 받습니다.' },
      { title: '관리 부담 없음', desc: '설치·운영·보험은 케이파워 솔라가 맡습니다.' },
    ],
    process: [
      '무료 상담',
      '한전 선로 조회',
      '현장 점검',
      '계약·서류 접수',
      '선지급금 지급 (약 2개월)',
      '인허가·시공',
      '6년차부터 연 임대료 지급',
    ],
  },
];

export const getService = (slug?: string) => SERVICES.find((s) => s.slug === slug);
export const servicePath = (slug: ServiceSlug) => `/service/${slug}`;
