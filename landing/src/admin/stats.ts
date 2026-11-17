/** 관리자 페이지 집계 함수 (화면과 분리해 테스트하기 쉽게) */

export type ConsultStatus = 'new' | 'contacted' | 'done' | 'hold';

export const STATUS_LABEL: Record<ConsultStatus, string> = {
  new: '신규',
  contacted: '연락함',
  done: '완료',
  hold: '보류',
};
export const STATUSES = Object.keys(STATUS_LABEL) as ConsultStatus[];

export interface Consultation {
  id: string;
  name: string;
  phone: string;
  region: string | null;
  roof_area_pyeong: number | null;
  message: string | null;
  source: string | null;
  created_at: string;
  status: ConsultStatus;
  handled_at: string | null;
}

export interface Note {
  id: string;
  consultation_id: string;
  body: string;
  author_email: string | null;
  created_at: string;
}

/** 상담 폼이 문의 내용 앞에 붙여 저장한 "지붕 종류: …", "지붕 면적: …" 분리 */
export function parseMessage(message: string | null) {
  let body = message ?? '';
  const pick = (key: string) => {
    const m = body.match(new RegExp(`^${key}: (.+)$`, 'm'));
    if (!m) return null;
    body = body.replace(m[0], '');
    return m[1].trim();
  };
  const roofType = pick('지붕 종류');
  const roofArea = pick('지붕 면적');
  return { roofType, roofArea, body: body.trim() };
}

export function formatPhone(p: string) {
  const d = p.replace(/\D/g, '');
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) {
    return d.startsWith('02')
      ? `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`
      : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (d.length === 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
  return d;
}

/** 한국 시간 기준 날짜 키 (YYYY-MM-DD) */
export function kstDayKey(iso: string | Date) {
  const d = new Date(new Date(iso).getTime() + 9 * 3600_000);
  return d.toISOString().slice(0, 10);
}

export function formatDateTime(iso: string) {
  const d = new Date(new Date(iso).getTime() + 9 * 3600_000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

export interface CountItem {
  label: string;
  count: number;
}

/** 값별 개수 (많은 순). 빈 값은 emptyLabel 로 묶음 */
export function countBy<T>(items: T[], key: (t: T) => string | null | undefined, emptyLabel = '미입력'): CountItem[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it)?.trim() || emptyLabel;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ko'));
}

/** 정해진 순서로 정렬 (순서에 없는 값·빈 값은 뒤로) */
export function sortByOrder(items: CountItem[], order: readonly string[]) {
  const rank = (l: string) => {
    const i = order.indexOf(l);
    return i === -1 ? order.length : i;
  };
  return [...items].sort((a, b) => rank(a.label) - rank(b.label) || b.count - a.count);
}

/** 최근 n일 일별 개수 (오늘 포함, 오래된 날부터) */
export function dailyCounts(items: Consultation[], days: number, now = new Date()) {
  const counts = new Map<string, number>();
  for (const c of items) {
    const k = kstDayKey(c.created_at);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: { day: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const k = kstDayKey(new Date(now.getTime() - i * 86_400_000));
    out.push({ day: k, count: counts.get(k) ?? 0 });
  }
  return out;
}

/** 기간 안의 상담만 (days = null 이면 전체) */
export function withinDays(items: Consultation[], days: number | null, now = new Date()) {
  if (days == null) return items;
  const from = kstDayKey(new Date(now.getTime() - (days - 1) * 86_400_000));
  return items.filter((c) => kstDayKey(c.created_at) >= from);
}

export interface Summary {
  total: number;
  today: number;
  thisMonth: number;
  /** 지난달 같은 날짜까지의 개수 (이번 달과 비교용) */
  lastMonthSamePeriod: number;
  pending: number;
  /** 신규가 아닌(처리를 시작한) 비율 0~1 */
  handledRate: number;
}

export function summarize(items: Consultation[], now = new Date()): Summary {
  const todayKey = kstDayKey(now);
  const month = todayKey.slice(0, 7);
  const dayOfMonth = Number(todayKey.slice(8, 10));
  const [y, m] = month.split('-').map(Number);
  const lastMonth = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;

  let today = 0;
  let thisMonth = 0;
  let lastMonthSamePeriod = 0;
  let pending = 0;
  for (const c of items) {
    const k = kstDayKey(c.created_at);
    if (k === todayKey) today++;
    if (k.startsWith(month)) thisMonth++;
    if (k.startsWith(lastMonth) && Number(k.slice(8, 10)) <= dayOfMonth) lastMonthSamePeriod++;
    if (c.status === 'new') pending++;
  }
  return {
    total: items.length,
    today,
    thisMonth,
    lastMonthSamePeriod,
    pending,
    handledRate: items.length ? (items.length - pending) / items.length : 0,
  };
}

/** 엑셀에서 한글이 깨지지 않는 CSV (BOM 포함) */
export function toCsv(items: Consultation[]) {
  const header = ['접수일시', '상태', '성함', '연락처', '지역', '지붕 종류', '지붕 면적', '문의 내용', '유입'];
  const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  // 엑셀이 =, +, -, @ 로 시작하는 값을 수식으로 실행하지 않도록
  const safe = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);
  const rows = items.map((c) => {
    const { roofType, roofArea, body } = parseMessage(c.message);
    return [
      formatDateTime(c.created_at),
      STATUS_LABEL[c.status] ?? c.status,
      c.name,
      formatPhone(c.phone),
      c.region ?? '',
      roofType ?? '',
      roofArea ?? '',
      body,
      c.source ?? '',
    ]
      .map((v) => esc(safe(String(v))))
      .join(',');
  });
  return '﻿' + [header.join(','), ...rows].join('\r\n');
}
