/**
 * Supabase DB 타입 (supabase/schema.sql 과 1:1 대응, snake_case)
 * 스키마 확정 후에는 아래 명령으로 자동 생성한 파일로 교체해도 됩니다.
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 */

export type SiteModelEnum = 'ROOF_LEASE' | 'OWN_PLANT' | 'PREPAID_LEASE';
export type SiteStatusEnum = 'PERMIT' | 'BUILDING' | 'DONE' | 'RUNNING';

export type SiteRow = {
  id: string;
  name: string;
  region: string;
  address: string;
  roof_area_m2: number;
  roof_area_pyeong: number;
  capacity_kw: number;
  roof_type: string;
  method: string;
  model: SiteModelEnum;
  status: SiteStatusEnum;
  completed_at: string;
  annual_lease_krw: number | null;
  images: string[];
  review_text: string | null;
  review_author: string | null;
  review_avatar_url: string | null;
  review_consent: boolean;
  is_published: boolean;
  created_at: string;
};

export type StatRow = {
  id: string;
  label: string;
  value: string;
  unit: string;
  caption: string | null;
  tone: string;
  sort_order: number;
  is_published: boolean;
};

export type ConsultationRow = {
  id: string;
  name: string;
  phone: string;
  region: string | null;
  roof_area_pyeong: number | null;
  message: string | null;
  agree_privacy: boolean;
  source: string | null;
  created_at: string;
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Database = {
  public: {
    Tables: {
      sites: {
        Row: SiteRow;
        Insert: Optional<SiteRow, 'created_at' | 'is_published' | 'review_consent' | 'images'>;
        Update: Partial<SiteRow>;
        Relationships: [];
      };
      stats: {
        Row: StatRow;
        Insert: Optional<StatRow, 'is_published' | 'sort_order' | 'caption'>;
        Update: Partial<StatRow>;
        Relationships: [];
      };
      consultations: {
        Row: ConsultationRow;
        Insert: Optional<
          ConsultationRow,
          'id' | 'created_at' | 'region' | 'roof_area_pyeong' | 'message' | 'source'
        >;
        Update: Partial<ConsultationRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      site_model: SiteModelEnum;
      site_status: SiteStatusEnum;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
