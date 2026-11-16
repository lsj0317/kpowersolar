import { Link } from 'react-router-dom';
import { Photo } from '@/components/Photo';
import { SectionHeader } from '@/components/SectionHeader';
import { DISCLAIMER } from '@/data/company';
import { SERVICES, servicePath } from '@/data/services';

/** 카드 배경: 첫 카드(큰 카드)는 main, 나머지는 각 서비스 톤 */
const variantOf = (i: number, tone: string) => (i === 0 ? 'main' : tone);

/**
 * 서비스별 카드 이미지 (임시: Pexels 무료 사진, 실제 시공 사진 확보 시 교체)
 * - roof-lease: pexels.com/photo/29923348
 * - own-plant: pexels.com/photo/9799994
 * - prepaid-lease: pexels.com/photo/137602
 */
const img = (slug: string) => ({
  src: `/img/services/${slug}-640.webp`,
  srcSet: `/img/services/${slug}-640.webp 640w, /img/services/${slug}-1280.webp 1280w`,
});

const IMAGES: Record<string, { src?: string; srcSet?: string; alt: string }> = {
  'roof-lease': { ...img('roof-lease'), alt: '공장 지붕 전체에 설치된 태양광 패널 항공 사진' },
  'own-plant': { ...img('own-plant'), alt: '건물 옥상에 설치된 태양광 발전소' },
  'prepaid-lease': { ...img('prepaid-lease'), alt: '공장 철판 지붕 위 태양광 패널' },
};

const IMG_SIZES = '(min-width: 1024px) 40vw, 60vw';

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
              <Photo
                className="a-bento__img"
                src={IMAGES[s.slug].src}
                srcSet={IMAGES[s.slug].srcSet}
                sizes={IMG_SIZES}
                alt={IMAGES[s.slug].alt}
              />
            </Link>
          ))}
        </div>
        <p className="disclaimer">{DISCLAIMER}</p>
      </div>
    </section>
  );
}
