import { getSupabase } from '@/lib/supabase';
import type { ConsultationInput } from '@/types/domain';

export async function submitConsultation(input: ConsultationInput): Promise<void> {
  const sb = await getSupabase();

  if (!sb) {
    // Supabase 미사용 상태: 실제 저장 없이 성공 처리 (개발 확인용)
    await new Promise((r) => setTimeout(r, 600));
    if (import.meta.env.DEV) console.info('[mock] 상담 신청', input);
    return;
  }

  const { error } = await sb.from('consultations').insert({
    name: input.name.trim(),
    phone: input.phone.replace(/[^0-9]/g, ''),
    region: input.region || null,
    roof_area_pyeong: input.roofAreaPyeong ?? null,
    message: input.message?.trim() || null,
    agree_privacy: input.agreePrivacy,
    source: input.source ?? null,
  });

  if (error) throw error;
}
