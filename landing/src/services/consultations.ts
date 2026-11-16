import { getSupabase } from '@/lib/supabase';
import type { ConsultationInput } from '@/types/domain';

/**
 * 지붕 종류·면적 구간은 별도 컬럼이 없어 문의 내용 앞에 붙여 저장합니다.
 * 예) "지붕 종류: 샌드위치 패널\n지붕 면적: 300~1,000평\n\n(문의 내용)"
 */
export function composeMessage(input: ConsultationInput): string | null {
  const head = [
    input.roofType && `지붕 종류: ${input.roofType}`,
    input.roofAreaRange && `지붕 면적: ${input.roofAreaRange}`,
  ].filter(Boolean);
  const body = input.message?.trim();
  const text = [head.join('\n'), body].filter(Boolean).join('\n\n');
  return text || null;
}

export async function submitConsultation(input: ConsultationInput): Promise<void> {
  const sb = await getSupabase();

  if (!sb) {
    // Supabase 미사용 상태: 실제 저장 없이 성공 처리 (개발 확인용)
    await new Promise((r) => setTimeout(r, 600));
    if (import.meta.env.DEV) console.info('[mock] 상담 신청', { ...input, message: composeMessage(input) });
    return;
  }

  const { error } = await sb.from('consultations').insert({
    name: input.name.trim(),
    phone: input.phone.replace(/[^0-9]/g, ''),
    region: input.region || null,
    roof_area_pyeong: input.roofAreaPyeong ?? null,
    message: composeMessage(input),
    agree_privacy: input.agreePrivacy,
    source: input.source ?? null,
  });

  if (error) throw error;
}
