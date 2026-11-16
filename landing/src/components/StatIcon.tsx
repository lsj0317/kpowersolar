/**
 * 실적 카드용 애니메이션 아이콘.
 * 정지 상태가 "완성된 모습"(배터리 가득, 동전이 손 위, 수화기 내려놓음)이고,
 * 부모 카드에 .is-playing 이 붙으면 한 번 재생된 뒤 같은 모습으로 끝납니다.
 * 스타일·애니메이션: styles/stat-icons.css
 */

const Battery = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <rect x="4" y="20" width="40" height="24" rx="5" stroke="currentColor" strokeWidth="3" />
    <rect x="44" y="27" width="4" height="10" rx="1.5" fill="currentColor" />
    <rect className="si-battery__fill" x="8" y="24" width="32" height="16" rx="2.5" />
    <path
      className="si-battery__bolt"
      d="M58 12 50 31h7l-4 19 9-23h-7l3-15Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const Excavator = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* 무한궤도 */}
    <rect x="3" y="47" width="32" height="10" rx="5" />
    <circle cx="9" cy="52" r="1.6" fill="currentColor" />
    <circle cx="19" cy="52" r="1.6" fill="currentColor" />
    <circle cx="29" cy="52" r="1.6" fill="currentColor" />
    {/* 차체 + 운전석 */}
    <path d="M6 47V37h8l4-10h12v20" />
    <path d="M20 31h7v6h-9" strokeWidth="2.4" />
    {/* 붐 → 암 → 버킷 (각각 관절에서 회전) */}
    <g className="si-exc__boom">
      <path d="M30 36 44 18" />
      <g className="si-exc__arm">
        <path d="M44 18 54 32" />
        <g className="si-exc__bucket">
          <path d="M52 31h9l-2 8h-7Z" fill="currentColor" fillOpacity="0.15" />
          <g className="si-exc__dirt" fill="currentColor" stroke="none">
            <circle cx="54.5" cy="29.5" r="2.2" />
            <circle cx="58" cy="28" r="2.6" />
            <circle cx="61" cy="30" r="1.8" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const HandCoins = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* 동전 (위에서 떨어져 손바닥에 쌓임) */}
    <g className="si-coin si-coin--1">
      <ellipse cx="44" cy="37" rx="7" ry="3" fill="currentColor" fillOpacity="0.15" />
    </g>
    <g className="si-coin si-coin--2">
      <ellipse cx="44" cy="32" rx="7" ry="3" fill="currentColor" fillOpacity="0.15" />
    </g>
    <g className="si-coin si-coin--3">
      <ellipse cx="44" cy="27" rx="7" ry="3" fill="currentColor" fillOpacity="0.15" />
    </g>
    {/* 손바닥 + 소매 */}
    <path d="M4 44h7l10-4h9a3 3 0 0 1 0 6h-8" />
    <path d="M11 56h22l22-11a3.5 3.5 0 0 0-3-6l-17 6" />
    <path d="M4 42v16" strokeWidth="4" />
  </svg>
);

const Telephone = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* 벨 소리 */}
    <g className="si-tel__ring">
      <path d="M6 16q-3 5 0 10M58 16q3 5 0 10" />
      <path d="M11 18q-2 3 0 6M53 18q2 3 0 6" strokeWidth="2.4" />
    </g>
    {/* 본체 + 다이얼 */}
    <path d="M18 38h28l8 16c.6 1.4-.4 3-2 3H12c-1.6 0-2.6-1.6-2-3l8-16Z" fill="currentColor" fillOpacity="0.1" />
    <circle cx="32" cy="48" r="4.5" />
    {/* 수화기 */}
    <g className="si-tel__handset">
      <path
        d="M10 30c0-11 44-11 44 0l-.8 4c-.3 1.3-1.4 2-2.7 2h-6c-1.4 0-2.5-1.1-2.5-2.5V31c-6-2-14-2-20 0v2.5c0 1.4-1.1 2.5-2.5 2.5h-6c-1.3 0-2.4-.7-2.7-2L10 30Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </g>
  </svg>
);

/** 경선 6개(60° 간격)를 위상만 다르게 회전시켜 지구본이 도는 것처럼 보이게 합니다. */
const Globe = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <circle cx="32" cy="32" r="24" />
    <path d="M8 32h48M12 20h40M12 44h40" strokeWidth="2.2" />
    <path className="si-globe__m si-globe__m--1" d="M32 8a24 24 0 0 1 0 48" strokeWidth="2.4" />
    <path className="si-globe__m si-globe__m--2" d="M32 8a24 24 0 0 1 0 48" strokeWidth="2.4" />
    <path className="si-globe__m si-globe__m--3" d="M32 8a24 24 0 0 1 0 48" strokeWidth="2.4" />
    <path className="si-globe__m si-globe__m--4" d="M32 8a24 24 0 0 1 0 48" strokeWidth="2.4" />
    <path className="si-globe__m si-globe__m--5" d="M32 8a24 24 0 0 1 0 48" strokeWidth="2.4" />
    <path className="si-globe__m si-globe__m--6" d="M32 8a24 24 0 0 1 0 48" strokeWidth="2.4" />
  </svg>
);

const ICONS: Record<string, () => JSX.Element> = {
  capacity: Battery,
  sites: Excavator,
  lease: HandCoins,
  consult: Telephone,
  region: Globe,
};

/** 실적 id 에 맞는 아이콘. 매칭되는 아이콘이 없으면 아무것도 렌더링하지 않습니다. */
export function StatIcon({ id }: { id: string }) {
  const Icon = ICONS[id];
  if (!Icon) return null;
  return (
    <span className={`stat-ic stat-ic--${id}`} aria-hidden="true">
      <Icon />
      {id === 'capacity' && <span className="si-battery__pct" />}
    </span>
  );
}

/** 재생이 끝났는지 판단할 기준 애니메이션 이름 (아이콘별로 가장 긴 것) */
export const STAT_ICON_MAIN_ANIM: Record<string, string> = {
  capacity: 'si-battery-fill',
  sites: 'si-exc-boom',
  lease: 'si-coin-3',
  consult: 'si-tel-lift',
  region: 'si-globe-1',
};
