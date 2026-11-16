import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ConsultForm } from '@/sections/ConsultForm';
import { COMPANY, telHref } from '@/data/company';
import {
  BASIS,
  COMMON_FAQ,
  COMMON_NOTES,
  SERVICES,
  getService,
  servicePath,
  type ContentBlock,
} from '@/data/services';

function Block({ block }: { block: ContentBlock }) {
  return (
    <div className="d-block">
      <h3 className="d-block__title">{block.title}</h3>
      {block.desc && <p className="d-block__desc">{block.desc}</p>}

      {block.kind === 'table' ? (
        <>
          <div className="d-table-wrap" tabIndex={0} role="region" aria-label={block.title}>
            <table className={`d-table ${block.head.length > 2 ? 'd-table--wide' : ''}`}>
              <thead>
                <tr>
                  {block.head.map((h, i) => (
                    <th key={i} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className={block.emphasize?.includes(r) ? 'is-em' : undefined}>
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={c} data-label={block.head[c]}>
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.notes?.map((n) => (
            <p key={n} className="disclaimer">
              {n}
            </p>
          ))}
        </>
      ) : (
        <ul className="d-points">
          {block.items.map((it) => (
            <li key={it.title} className="d-point">
              <strong>{it.title}</strong>
              <p>{it.desc}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getService(slug);

  useEffect(() => {
    if (service) document.title = `${service.label} | 공장 지붕 태양광 | 케이파워 솔라`;
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const notes = [...COMMON_NOTES, ...(service.extraNotes ?? [])];

  return (
    <>
      {/* 페이지 상단 */}
      <section className={`d-hero d-hero--${service.tone}`} aria-labelledby="d-title">
        <div className="container">
          <nav className="breadcrumb" aria-label="현재 위치">
            <ol>
              <li>
                <Link to="/">홈</Link>
              </li>
              <li>
                <Link to="/#service">사업안내</Link>
              </li>
              <li aria-current="page">{service.label}</li>
            </ol>
          </nav>

          <nav className="d-tabs" aria-label="사업 방식">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to={servicePath(s.slug)}
                aria-current={s.slug === service.slug ? 'page' : undefined}
              >
                {s.label}
              </Link>
            ))}
          </nav>

          <span className="chip">{service.label}</span>
          <h1 id="d-title" className="d-hero__title">
            {service.title}
          </h1>
          <p className="d-hero__sub">{service.subtitle}</p>

          <dl className="d-highlights">
            {service.highlights.map((h) => (
              <div key={h.label} className="d-highlight">
                <dt>{h.label}</dt>
                <dd>
                  <strong>{h.value}</strong>
                  {h.caption && <small>{h.caption}</small>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="d-hero__btns">
            <a className="btn btn--navy btn--lg" href="#consult">
              무료 상담 신청
            </a>
            <a className="btn btn--line btn--lg" href={telHref}>
              전화 상담 {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>

      {/* 이런 분께 */}
      <section className="section d-section" aria-labelledby="d-fit">
        <div className="container d-grid">
          <h2 id="d-fit" className="h2">
            이런 분께 맞습니다
          </h2>
          <ul className="d-fit">
            {service.fit.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 구조 / 숫자 */}
      <section className="section section--soft d-section" aria-labelledby="d-structure">
        <div className="container">
          <p className="section-head__eyebrow">{BASIS}</p>
          <h2 id="d-structure" className="h2 d-section__title">
            {service.slug === 'own-plant' ? '자금 방식과 수익 구조' : '수익 구조'}
          </h2>
          <div className="d-blocks">
            {service.blocks.map((b) => (
              <Block key={b.title} block={b} />
            ))}
          </div>
        </div>
      </section>

      {/* 장점 */}
      <section className="section d-section" aria-labelledby="d-benefits">
        <div className="container">
          <h2 id="d-benefits" className="h2 d-section__title">
            {service.label}의 장점
          </h2>
          <ol className="d-benefits">
            {service.benefits.map((b, i) => (
              <li key={b.title} className={`d-benefit a-stat--${['mint', 'sky', 'lavender', 'sand'][i % 4]}`}>
                <span className="d-benefit__no">{String(i + 1).padStart(2, '0')}</span>
                <strong>{b.title}</strong>
                <p>{b.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 진행 절차 */}
      <section className="section section--soft d-section" aria-labelledby="d-process">
        <div className="container">
          <h2 id="d-process" className="h2 d-section__title">
            진행 절차
          </h2>
          <ol
            className="d-process"
            // 단계가 많으면 두 줄(5열)로, 아니면 한 줄에 모두
            style={{ '--cols': service.process.length > 7 ? 5 : service.process.length } as React.CSSProperties}
          >
            {service.process.map((p, i) => (
              <li key={p}>
                <span className="d-process__no">{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section d-section" aria-labelledby="d-faq">
        <div className="container d-grid">
          <h2 id="d-faq" className="h2">
            자주 묻는 질문
          </h2>
          <div className="d-faq">
            {COMMON_FAQ.map((q) => (
              <details key={q.title}>
                <summary>{q.title}</summary>
                <p>{q.desc}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="container d-notes">
          {notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </section>

      {/* 다른 방식 */}
      <section className="section section--tight d-section" aria-labelledby="d-others">
        <div className="container">
          <h2 id="d-others" className="d-block__title">
            다른 방식도 비교해 보세요
          </h2>
          <div className="d-others">
            {others.map((s) => (
              <Link key={s.slug} to={servicePath(s.slug)} className={`d-other d-other--${s.tone}`}>
                <span className="chip">{s.label}</span>
                <strong>{s.cardTitle.replace('\n', ' ')}</strong>
                <span className="d-other__point">{s.cardPoint}</span>
                <span className="a-bento__more">
                  자세히 보기 <span aria-hidden="true">›</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConsultForm />
    </>
  );
}
