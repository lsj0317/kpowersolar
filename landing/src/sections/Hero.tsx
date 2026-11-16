import { useEffect, useState } from 'react';
import { Photo } from '@/components/Photo';
import { ArrowIcon } from '@/components/Icons';
import { telHref } from '@/data/company';

interface Slide {
  id: string;
  title: [string, string];
  desc: string;
  image?: string;
  alt: string;
}

/** 히어로 슬라이드. image 에 드론 항공사진(16:9, 텍스트 쪽이 어두운 사진)을 넣습니다. */
const SLIDES: Slide[] = [
  {
    id: 'lease',
    title: ['놀고 있는 공장 지붕,', '이제 매년 임대료를 받으세요'],
    desc: '부산·울산·경남 공장 지붕 태양광. 설치비 부담 없이 지붕만 빌려주시면 됩니다.',
    alt: '공장 지붕 태양광 발전소 준공 항공사진',
  },
  {
    id: 'grid',
    title: ['한전 선로 조회부터', '준공 후 관리까지 한 번에'],
    desc: '우리 공장에 설치가 가능한지, 한전 선로 여유부터 무료로 확인해 드립니다.',
    alt: '공장 지붕 태양광 패널 시공 현장 사진',
  },
];

const AUTOPLAY_MS = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [index, paused]);

  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      id="top"
      className="hero"
      aria-roledescription="carousel"
      aria-label="주요 안내"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
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
          <Photo className="hero__bg" src={s.image} alt={s.alt} priority={i === 0} placeholderLabel="히어로 드론 사진 (2400×1350)" />
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
        </div>
      </div>
    </section>
  );
}
