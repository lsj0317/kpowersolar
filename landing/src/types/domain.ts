/** 앱에서 사용하는 도메인 타입 (가이드 5장 "현장 데이터 구조" 기준, camelCase) */

/** ROOF_LEASE 지붕 임대형 / OWN_PLANT 발전소 구축형 / PREPAID_LEASE 임대료 선지급형 */
export type SiteModel = 'ROOF_LEASE' | 'OWN_PLANT' | 'PREPAID_LEASE';

/** PERMIT 인허가중 / BUILDING 시공중 / DONE 시공완료 / RUNNING 발전중 */
export type SiteStatus = 'PERMIT' | 'BUILDING' | 'DONE' | 'RUNNING';

export type Region = '부산' | '울산' | '김해' | '양산' | '창원' | '기타';

export interface SiteReview {
  text: string;
  /** 예: "50대 · 금속가공 대표" */
  author: string;
  /** 고객 동의 여부 — true 인 후기만 노출 */
  consent: boolean;
  avatarUrl?: string | null;
}

export interface Site {
  id: string;
  name: string;
  region: Region;
  address: string;
  roofAreaM2: number;
  roofAreaPyeong: number;
  capacityKw: number;
  roofType: string;
  method: string;
  model: SiteModel;
  status: SiteStatus;
  /** "YYYY-MM" */
  completedAt: string;
  annualLeaseKrw: number | null;
  images: string[];
  review: SiteReview | null;
}

export type StatTone = 'mint' | 'sky' | 'lavender' | 'sand' | 'cream';

export interface Stat {
  id: string;
  label: string;
  value: string;
  unit: string;
  caption?: string;
  tone: StatTone;
}

export interface ConsultationInput {
  name: string;
  phone: string;
  region: Region | '';
  roofAreaPyeong?: number | null;
  message?: string;
  agreePrivacy: boolean;
  /** 지붕 종류 (선택 칩). DB 에는 문의 내용 앞에 함께 저장 */
  roofType?: string;
  /** 지붕 면적 구간 (선택 칩). DB 에는 문의 내용 앞에 함께 저장 */
  roofAreaRange?: string;
  /** 광고 유입 추적용 (utm_source 등) */
  source?: string | null;
}

export const SITE_MODEL_LABEL: Record<SiteModel, string> = {
  ROOF_LEASE: '지붕 임대형',
  OWN_PLANT: '발전소 구축형',
  PREPAID_LEASE: '임대료 선지급형',
};

export const SITE_STATUS_LABEL: Record<SiteStatus, string> = {
  PERMIT: '인허가중',
  BUILDING: '시공중',
  DONE: '시공완료',
  RUNNING: '발전중',
};

export const REGIONS: Region[] = ['부산', '울산', '김해', '양산', '창원', '기타'];

/** 상담 폼 선택지 */
export const ROOF_TYPES = ['샌드위치 패널', '징크', '컬러강판', '슬레이트', '콘크리트 평지붕', '잘 모름'] as const;
export const ROOF_AREA_RANGES = ['300평 미만', '300~1,000평', '1,000~3,000평', '3,000평 이상', '잘 모름'] as const;
