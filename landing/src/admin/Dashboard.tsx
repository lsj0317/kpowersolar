import { useMemo, useState } from 'react';
import { ROOF_AREA_RANGES } from '@/types/domain';
import {
  STATUSES,
  STATUS_LABEL,
  countBy,
  dailyCounts,
  formatDateTime,
  parseMessage,
  sortByOrder,
  summarize,
  withinDays,
  type Consultation,
  type CountItem,
} from './stats';

const PERIODS: { label: string; days: number | null }[] = [
  { label: '최근 30일', days: 30 },
  { label: '최근 90일', days: 90 },
  { label: '전체', days: null },
];

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="adm-card adm-kpi">
      <p className="adm-kpi__label">{label}</p>
      <p className="adm-kpi__value">{value}</p>
      {sub && <p className="adm-kpi__sub">{sub}</p>}
    </div>
  );
}

/** 일별 상담 수 막대 (한 가지 색, 마우스·터치·키보드로 값 확인) */
function DailyChart({ data }: { data: { day: string; count: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  // 눈금: 0, 중간, 최대 (정수)
  const top = max <= 4 ? max : Math.ceil(max / 2) * 2;
  const ticks = top <= 1 ? [0, top] : [0, top / 2, top];
  const shown = hover ?? data.length - 1;
  const fmt = (k: string) => `${Number(k.slice(5, 7))}/${Number(k.slice(8, 10))}`;

  return (
    <figure className="adm-card adm-chart">
      <figcaption className="adm-chart__head">
        <h3>일별 상담 신청 (최근 30일)</h3>
        <p className="adm-chart__readout" aria-live="polite">
          {fmt(data[shown].day)} <strong>{data[shown].count}건</strong>
        </p>
      </figcaption>
      <div className="adm-cols" onMouseLeave={() => setHover(null)}>
        <div className="adm-cols__axis" aria-hidden="true">
          {[...ticks].reverse().map((t) => (
            <span key={t}>{Number.isInteger(t) ? t : ''}</span>
          ))}
        </div>
        <div className="adm-cols__plot">
          {ticks.map((t) => (
            <span key={t} className="adm-cols__grid" style={{ bottom: `${(t / top) * 100}%` }} aria-hidden="true" />
          ))}
          {data.map((d, i) => (
            <button
              key={d.day}
              type="button"
              className={`adm-cols__hit ${hover === i ? 'is-on' : ''}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => setHover(i)}
              aria-label={`${fmt(d.day)} ${d.count}건`}
            >
              <span className="adm-cols__bar" style={{ height: d.count ? `${(d.count / top) * 100}%` : 0 }} />
            </button>
          ))}
        </div>
      </div>
      <div className="adm-cols__x" aria-hidden="true">
        <span>{fmt(data[0].day)}</span>
        <span>{fmt(data[Math.floor(data.length / 2)].day)}</span>
        <span>오늘</span>
      </div>
      <details className="adm-table-toggle">
        <summary>표로 보기</summary>
        <table className="adm-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>건수</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.day}>
                <td>{d.day}</td>
                <td>{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** 항목별 개수 가로 막대 */
function BarList({ title, items, total }: { title: string; items: CountItem[]; total: number }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <section className="adm-card adm-bars">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="adm-muted">기간 안에 상담이 없습니다.</p>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.label} title={`${it.label}: ${it.count}건`}>
              <span className="adm-bars__label">{it.label}</span>
              <span className="adm-bars__track" aria-hidden="true">
                <span className="adm-bars__bar" style={{ width: `${(it.count / max) * 100}%` }} />
              </span>
              <span className="adm-bars__value">
                {it.count}건 <small>{Math.round((it.count / total) * 100)}%</small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Dashboard({ items, onOpenList }: { items: Consultation[] | null; onOpenList: () => void }) {
  const [period, setPeriod] = useState<number | null>(30);

  const view = useMemo(() => {
    if (!items) return null;
    const inPeriod = withinDays(items, period);
    return {
      summary: summarize(items),
      daily: dailyCounts(items, 30),
      total: inPeriod.length,
      status: sortByOrder(
        countBy(inPeriod, (c) => STATUS_LABEL[c.status] ?? c.status),
        STATUSES.map((x) => STATUS_LABEL[x]),
      ),
      region: countBy(inPeriod, (c) => c.region),
      roofType: countBy(inPeriod, (c) => parseMessage(c.message).roofType),
      roofArea: sortByOrder(
        countBy(inPeriod, (c) => parseMessage(c.message).roofArea),
        ROOF_AREA_RANGES,
      ),
      source: countBy(inPeriod, (c) => c.source, '직접 방문'),
      recentNew: items.filter((c) => c.status === 'new').slice(0, 5),
    };
  }, [items, period]);

  if (!view) return <p className="adm-muted">불러오는 중…</p>;
  const s = view.summary;
  const diff = s.thisMonth - s.lastMonthSamePeriod;

  return (
    <div className="adm-stack">
      <div className="adm-kpis">
        <Kpi label="오늘" value={`${s.today}건`} />
        <Kpi
          label="이번 달"
          value={`${s.thisMonth}건`}
          sub={`지난달 같은 기간 ${s.lastMonthSamePeriod}건 (${diff >= 0 ? '+' : ''}${diff})`}
        />
        <Kpi label="미처리 (신규)" value={`${s.pending}건`} />
        <Kpi label="전체" value={`${s.total}건`} sub={`처리 시작 ${Math.round(s.handledRate * 100)}%`} />
      </div>

      {view.recentNew.length > 0 && (
        <section className="adm-card">
          <div className="adm-row-between">
            <h3>처리 안 된 상담</h3>
            <button className="adm-link" onClick={onOpenList}>
              상담 관리로 →
            </button>
          </div>
          <ul className="adm-mini-list">
            {view.recentNew.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong> · {c.region ?? '지역 미입력'}
                <span className="adm-muted"> {formatDateTime(c.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DailyChart data={view.daily} />

      <div className="adm-row-between">
        <h2 className="adm-h2">항목별 분포</h2>
        <div className="adm-seg" role="group" aria-label="기간">
          {PERIODS.map((p) => (
            <button key={p.label} className={period === p.days ? 'is-on' : ''} onClick={() => setPeriod(p.days)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="adm-muted">선택한 기간의 상담 {view.total}건 기준</p>
      <div className="adm-grid2">
        <BarList title="처리 상태" items={view.status} total={view.total} />
        <BarList title="지역" items={view.region} total={view.total} />
        <BarList title="지붕 종류" items={view.roofType} total={view.total} />
        <BarList title="지붕 면적" items={view.roofArea} total={view.total} />
        <BarList title="유입 경로 (utm_source)" items={view.source} total={view.total} />
      </div>
    </div>
  );
}
