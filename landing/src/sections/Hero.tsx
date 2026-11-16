import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/components/Photo';
import { ArrowIcon, PauseIcon, PlayIcon } from '@/components/Icons';
import { telHref } from '@/data/company';

/** 히어로 예시 숫자. 금액은 data/services.ts 의 회사 기준 금액과 같아야 합니다. */
interface SlideFigure {
  /** 숫자 앞 문장 (예: 공장 지붕 2,000평이면) */
  lead: string;
  /** 크게 보여줄 금액 */
  value: string;
  /** 금액 뒤 설명 */
  unit: string;
  /** 숫자 아래 기준 (작은 글씨) */
  basis: string;
}

interface Slide {
  id: string;
  title: [string, string];
  desc: string;
  image?: string;
  /** 배경 동영상 (mp4, 소리 없음). 있으면 image 대신 재생 */
  video?: string;
  /** 동영상 로딩 전·동작 줄이기 설정 시 보여줄 정지 화면 */
  poster?: string;
  alt: string;
  figure?: SlideFigure;
}

/**
 * 히어로 슬라이드. image 에 드론 항공사진(16:9) 또는 video 에 8초 내외 무음 영상을 넣습니다.
 * 현재 영상은 임시(Pexels 무료 영상): 2249554(드론), 1276083(노을)
 */
const SLIDES: Slide[] = [
  {
    id: 'lease',
    title: ['놀고 있는 공장 지붕,', '이제 매년 임대료를 받으세요'],
    desc: '부산·울산·경남 공장 지붕 태양광. 설치비 부담 없이 지붕만 빌려주시면 됩니다.',
    video: '/video/hero-drone.mp4',
    poster: '/video/hero-drone.jpg',
    figure: {
      lead: '공장 지붕 2,000평이면',
      value: '3억 5천만 원',
      unit: '5년 치 임대료를 먼저',
      basis: '*발전용량 1,000kW · 임대료 선지급형 기준, 2026년 10월 기준 예시',
    },
    alt: '공장 지붕 태양광 발전소 준공 항공사진',
  },
  {
    id: 'grid',
    title: ['한전 선로 조회부터', '준공 후 관리까지 한 번에'],
    desc: '우리 공장에 설치가 가능한지, 한전 선로 여유부터 무료로 확인해 드립니다.',
    video: '/video/hero-sunset.mp4',
    poster: '/video/hero-sunset.jpg',
    figure: {
      lead: '공장 지붕 2,000평에 직접 지으면',
      value: '연 약 3억 원',
      unit: '발전 수익',
      basis: '*발전용량 1,000kW · 발전소 구축형 기준, 2026년 10월 기준 예시',
    },
    alt: '노을 지는 태양광 발전소',
  },
];

/** 영상 길이(8초)에 맞춘 슬라이드 전환 간격 */
const AUTOPLAY_MS = 8000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 보이는 슬라이드만 재생합니다. 슬라이드가 바뀌면 처음부터, 일시정지 후에는 이어서 재생. */
function HeroVideo({
  src,
  poster,
  active,
  playing,
  priority,
}: {
  src: string;
  poster?: string;
  active: boolean;
  playing: boolean;
  priority: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // 슬라이드에 새로 들어오면 처음부터
  useEffect(() => {
    if (active && ref.current) ref.current.currentTime = 0;
  }, [active]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && playing && !prefersReducedMotion()) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active, playing]);

  return (
    <video
      ref={ref}
      className="photo hero__bg"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={priority ? 'auto' : 'metadata'}
      aria-hidden="true"
    />
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  /** 마우스·포커스가 올라가 있는 동안 잠시 멈춤 */
  const [paused, setPaused] = useState(false);
  /** 사용자가 일시정지 버튼으로 멈춤 (다시 누를 때까지 유지) */
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (paused || stopped || prefersReducedMotion()) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, stopped]);

  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      id="top"
      className="hero"
      aria-roledescription="carousel"
      aria-label="주요 안내"
      // 마우스를 올려둔 동안만 잠시 멈춤 (터치 기기는 탭할 때 mouseenter 만 생기고 leave 가 없어 제외)
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      // 키보드로 들어온 포커스일 때만 잠시 멈춤 (마우스·터치로 버튼을 누른 뒤에도 계속 넘어가도록)
      onFocusCapture={(e) => (e.target as HTMLElement).matches(':focus-visible') && setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`hero__slide ${i === index ? 'is-active' : ''}`}
          aria-hidden={i !== index}
          aria-roledescription="slide"
          aria-label={`${i + 1} / ${SLIDES.length}`}
        >
          {s.video ? (
            <HeroVideo src={s.video} poster={s.poster} active={i === index} playing={!stopped} priority={i === 0} />
          ) : (
            <Photo className="hero__bg" src={s.image} alt={s.alt} priority={i === 0} placeholderLabel="히어로 드론 사진 (2400×1350)" />
          )}
          <div className="hero__overlay" />
        </div>
      ))}

      <div className="container hero__content">
        <div className="hero__text" aria-live="polite">
          <h1 className="hero__title">
            {SLIDES[index].title[0]}
            <br />
            {SLIDES[index].title[1]}
          </h1>
          <p className="hero__desc">{SLIDES[index].desc}</p>
          {SLIDES[index].figure && (
            <div className="hero__figure">
              <p className="hero__figure-lead">{SLIDES[index].figure.lead}</p>
              <p className="hero__figure-main">
                <strong>{SLIDES[index].figure.value}</strong>
                <span>{SLIDES[index].figure.unit}</span>
              </p>
              <p className="hero__figure-basis">{SLIDES[index].figure.basis}</p>
            </div>
          )}
          <div className="hero__btns">
            <a className="btn btn--outline-light" href="#consult">
              무료 상담 신청
            </a>
            <a className="btn btn--outline-light" href={telHref}>
              한전 선로 무료 조회
            </a>
          </div>
        </div>

        <div className="hero__pager">
          <button type="button" className="hero__arrow" aria-label="이전 슬라이드" onClick={() => go(-1)}>
            <ArrowIcon dir="left" />
          </button>
          <span className="hero__count">
            <strong>{pad(index + 1)}</strong>
            <span className="hero__bar" aria-hidden="true" />
            {pad(SLIDES.length)}
          </span>
          <button type="button" className="hero__arrow" aria-label="다음 슬라이드" onClick={() => go(1)}>
            <ArrowIcon />
          </button>
          <button
            type="button"
            className="hero__arrow hero__toggle"
            aria-label={stopped ? '자동 재생 시작' : '자동 재생 멈춤'}
            aria-pressed={stopped}
            onClick={() => setStopped((v) => !v)}
          >
            {stopped ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>
      </div>
    </section>
  );
}
