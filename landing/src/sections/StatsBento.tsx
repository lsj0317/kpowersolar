import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { STAT_ICON_MAIN_ANIM, StatIcon } from '@/components/StatIcon';
import { useStats } from '@/hooks/useData';
import type { Stat } from '@/types/domain';
import '@/styles/stat-icons.css';

const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

/**
 * 실적 카드 한 칸. 아이콘 애니메이션은 .is-playing 동안 한 번 재생됩니다.
 * - 마우스 기기: 카드에 마우스를 올릴 때마다
 * - 터치 기기: 화면에 60% 이상 들어올 때 한 번(순서대로 시차) + 탭할 때마다
 * - 동작 줄이기 설정: 재생 안 함
 */
function StatCard({ stat, order }: { stat: Stat; order: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasIcon = stat.id in STAT_ICON_MAIN_ANIM;

  const play = useCallback(() => {
    if (!hasIcon || mq('(prefers-reduced-motion: reduce)')) return;
    setPlaying(true);
  }, [hasIcon]);

  // 터치 기기: 처음 화면에 들어올 때 한 번 자동 재생
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasIcon || mq('(hover: hover) and (pointer: fine)')) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timer = window.setTimeout(play, order * 180);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [hasIcon, order, play]);

  return (
    <div
      ref={ref}
      className={`a-stat a-stat--${stat.tone}${playing ? ' is-playing' : ''}`}
      onMouseEnter={() => mq('(hover: hover) and (pointer: fine)') && play()}
      onClick={play}
      onAnimationEnd={(e) => {
        if (e.animationName === STAT_ICON_MAIN_ANIM[stat.id]) setPlaying(false);
      }}
    >
      <StatIcon id={stat.id} />
      <p className="a-stat__label">{stat.label}</p>
      <p className="a-stat__value">
        <strong>{stat.value}</strong>
        <span>{stat.unit}</span>
      </p>
      {stat.caption && <p className="a-stat__caption">{stat.caption}</p>}
    </div>
  );
}

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
          {(data ?? []).map((s, i) => (
            <StatCard key={s.id} stat={s} order={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
