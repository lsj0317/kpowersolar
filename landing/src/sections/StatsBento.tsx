import { SectionHeader } from '@/components/SectionHeader';
import { useStats } from '@/hooks/useData';

export function StatsBento() {
  const { data, loading, error } = useStats();

  return (
    <section className="section" id="record" aria-labelledby="record-title">
      <div className="container">
        <SectionHeader
          id="record-title"
          eyebrow="실적"
          title={
            <>
              숫자로 확인하는
              <br />
              케이파워 솔라
            </>
          }
        />

        {error && <p className="state-msg">실적 정보를 불러오지 못했습니다.</p>}
        <div className="a-stats" aria-busy={loading}>
          {(data ?? []).map((s) => (
            <div key={s.id} className={`a-stat a-stat--${s.tone}`}>
              <p className="a-stat__label">{s.label}</p>
              <p className="a-stat__value">
                <strong>{s.value}</strong>
                <span>{s.unit}</span>
              </p>
              {s.caption && <p className="a-stat__caption">{s.caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
