import { PhoneIcon } from '@/components/Icons';
import { telHref } from '@/data/company';

/** 모바일(≤767px) 전용 하단 고정 상담바 */
export function StickyCta() {
  return (
    <div className="a-sticky-cta" role="complementary" aria-label="빠른 상담">
      <a className="a-sticky-cta__tel" href={telHref}>
        <PhoneIcon size={18} /> 전화하기
      </a>
      <a className="a-sticky-cta__main" href="#consult">
        무료 상담신청
      </a>
    </div>
  );
}
