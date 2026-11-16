/** 회사 공통 정보 — ○○ 표시는 실제 자료로 교체 전 상태입니다. */
export const COMPANY = {
  name: '케이파워 솔라',
  nameEn: 'K-POWER SOLAR',
  phone: '010-3675-4804',
  ceo: '○○○',
  bizNo: '○○○-○○-○○○○○',
  licenseNo: '전기공사업 ○○-○○○○○',
  address: '경상남도 ○○시 ○○로 ○○',
  email: 'contact@kpowersolar.co.kr',
  /** B안 회사 홈페이지 시공현장 목록 (원본 데이터) */
  sitesUrl: 'https://kpowersolar.co.kr/sites',
  privacyUrl: '#privacy',
} as const;

export const telHref = `tel:${COMPANY.phone.replace(/-/g, '')}`;

/** 랜딩(/) 섹션 링크 — 상세페이지에서도 동작하도록 경로 포함 */
export const NAV_ITEMS = [
  { to: '/#service', label: '사업안내' },
  { to: '/#sites', label: '시공현장' },
  { to: '/#record', label: '실적' },
  { to: '/#why', label: '케이파워 솔라' },
  { to: '/#consult', label: '상담신청' },
] as const;

export const DISCLAIMER =
  '※ 실제 수익과 계약조건은 공장 위치, 지붕 면적, 한전 선로 상황에 따라 달라질 수 있습니다.';
