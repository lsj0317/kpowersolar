import { Link } from 'react-router-dom';
import { Photo } from '@/components/Photo';
import { SectionHeader } from '@/components/SectionHeader';
import { DISCLAIMER } from '@/data/company';
import { SERVICES, servicePath } from '@/data/services';

/** 카드 배경: 첫 카드(큰 카드)는 main, 나머지는 각 서비스 톤 */
const variantOf = (i: number, tone: string) => (i === 0 ? 'main' : tone);

/** 사진 준비 후 서비스별 이미지 경로를 넣습니다. */
const IMAGES: Record<string, { src?: string; alt: string }> = {
  'roof-lease': { alt: '공장 지붕 위에 설치된 태양광 패널' },
  'own-plant': { alt: '공장 외관과 지붕 태양광' },
  'prepaid-lease': { alt: '태양광 상담 장면' },
};

export function ServiceBento() {
  return (
    <section className="section" id="service" aria-labelledby="service-title">
      <div className="container">
        <SectionHeader
          id="service-title"
          eyebrow="사업안내"
          title={
            <>
              공장 상황에 맞는
              <br />세 가지 방법
            </>
          }
        />

        <div className="a-bento">
          {SERVICES.map((s, i) => (
            <Link key={s.slug} to={servicePath(s.slug)} className={`a-bento__card a-bento__card--${variantOf(i, s.tone)}`}>
              <div className="a-bento__text">
                <span className="chip">{s.label}</span>
                <h3 className="card-title">{s.cardTitle}</h3>
                <p className="a-bento__desc">{s.cardDesc}</p>
                <p className="a-bento__point">{s.cardPoint}</p>
                <span className="a-bento__more">
                  자세히 보기 <span aria-hidden="true">›</span>
                </span>
              </div>
              <Photo className="a-bento__img" src={IMAGES[s.slug].src} alt={IMAGES[s.slug].alt} />
            </Link>
          ))}
        </div>
        <p className="disclaimer">{DISCLAIMER}</p>
      </div>
    </section>
  );
}
