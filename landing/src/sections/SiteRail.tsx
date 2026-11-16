import { Photo } from '@/components/Photo';
import { QuoteIcon } from '@/components/Icons';
import { SectionHeader } from '@/components/SectionHeader';
import { COMPANY } from '@/data/company';
import { useLatestSites } from '@/hooks/useData';
import { SITE_MODEL_LABEL, SITE_STATUS_LABEL, type Site } from '@/types/domain';

type RailItem = { kind: 'site'; site: Site } | { kind: 'review'; site: Site };

/** 현장 카드와 (동의받은) 후기 카드를 번갈아 배치 */
function toRailItems(sites: Site[]): RailItem[] {
  return sites.flatMap<RailItem>((site) =>
    site.review?.consent && site.review.text
      ? [{ kind: 'site', site }, { kind: 'review', site }]
      : [{ kind: 'site', site }],
  );
}

const fmt = (n: number) => (n > 0 ? n.toLocaleString('ko-KR') : '○○○');

function formatLease(krw: number | null) {
  if (!krw) return '연 임대료 약 ○,○○○만 원';
  return `연 임대료 약 ${Math.round(krw / 10_000).toLocaleString('ko-KR')}만 원`;
}

function SiteCard({ site }: { site: Site }) {
  return (
    <article className="rail-card site-card">
      <div className="site-card__media">
        <Photo
          src={site.images[0]}
          alt={`${site.region} ${site.name} 지붕 태양광 ${site.capacityKw || ''}kW 사진`}
          placeholderLabel="현장 사진 4:3"
        />
        <span className={`status status--${site.status.toLowerCase()}`}>{SITE_STATUS_LABEL[site.status]}</span>
      </div>
      <div className="site-card__body">
        <p className="site-card__meta">
          {site.region} · {SITE_MODEL_LABEL[site.model]}
        </p>
        <h3 className="site-card__name">{site.name}</h3>
        <p className="site-card__spec">
          지붕 {fmt(site.roofAreaPyeong)}평 · {fmt(site.capacityKw)}kW
        </p>
        <div className="price-box">
          {formatLease(site.annualLeaseKrw)}
          <small>지붕 {fmt(site.roofAreaPyeong)}평 기준</small>
        </div>
      </div>
    </article>
  );
}

function ReviewCard({ site }: { site: Site }) {
  const review = site.review!;
  return (
    <article className="rail-card review-card">
      <span className="review-card__quote">
        <QuoteIcon />
      </span>
      <blockquote className="review-card__text">{review.text}</blockquote>
      <footer className="review-card__author">
        {review.avatarUrl ? (
          <img className="avatar" src={review.avatarUrl} alt="" loading="lazy" />
        ) : (
          <span className="avatar avatar--empty" aria-hidden="true" />
        )}
        <span>
          <strong>
            {site.region} 공장 지붕 {fmt(site.roofAreaPyeong)}평
          </strong>
          <small>{review.author}</small>
        </span>
      </footer>
    </article>
  );
}

export function SiteRail() {
  const { data, loading, error } = useLatestSites();
  const items = data ? toRailItems(data) : [];

  return (
    <section className="section section--soft" id="sites" aria-labelledby="sites-title">
      <div className="container">
        <SectionHeader
          id="sites-title"
          eyebrow="시공현장 · 고객 후기"
          title="케이파워 솔라가 만든 현장"
          action={{ href: COMPANY.sitesUrl, label: '전체 보기', external: true }}
        />
      </div>

      <div className="rail-wrap">
        {loading && <div className="rail-skeleton" aria-busy="true" aria-label="현장 정보를 불러오는 중" />}
        {error && <p className="state-msg">현장 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
        {!loading && !error && (
          <div className="a-rail" tabIndex={0} role="region" aria-label="시공현장과 고객 후기 목록, 좌우로 스크롤">
            {items.map((item) =>
              item.kind === 'site' ? (
                <SiteCard key={`s-${item.site.id}`} site={item.site} />
              ) : (
                <ReviewCard key={`r-${item.site.id}`} site={item.site} />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
