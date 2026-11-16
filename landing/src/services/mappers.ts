import type { SiteRow, StatRow } from '@/types/database';
import type { Region, Site, Stat, StatTone } from '@/types/domain';

export function mapSiteRow(row: SiteRow): Site {
  return {
    id: row.id,
    name: row.name,
    region: row.region as Region,
    address: row.address,
    roofAreaM2: row.roof_area_m2,
    roofAreaPyeong: row.roof_area_pyeong,
    capacityKw: row.capacity_kw,
    roofType: row.roof_type,
    method: row.method,
    model: row.model,
    status: row.status,
    completedAt: row.completed_at,
    annualLeaseKrw: row.annual_lease_krw,
    images: row.images ?? [],
    review:
      row.review_text && row.review_author
        ? {
            text: row.review_text,
            author: row.review_author,
            consent: row.review_consent,
            avatarUrl: row.review_avatar_url,
          }
        : null,
  };
}

export function mapStatRow(row: StatRow): Stat {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    unit: row.unit,
    caption: row.caption ?? undefined,
    tone: row.tone as StatTone,
  };
}
