import { Link } from 'react-router-dom';

/**
 * 회사 로고 (K파워솔라_2.png 에서 배경을 제거해 만든 이미지)
 * - logo-light.png: 흰 글씨 — 어두운 배경(히어로 위 투명 헤더)
 * - logo-dark.png : 네이비 글씨 — 흰 배경(스크롤 후 헤더, 모바일 메뉴)
 * 두 장을 함께 두고 CSS 로 전환해 헤더 색이 바뀔 때 깜빡임이 없게 합니다.
 */
export function Logo({ inverse = false, onClick }: { inverse?: boolean; onClick?: () => void }) {
  return (
    <Link to="/" className={`logo ${inverse ? 'logo--inverse' : ''}`} aria-label="케이파워 솔라 홈" onClick={onClick}>
      <img className="logo__img logo__img--light" src="/img/logo-light.png" alt="" width={402} height={120} />
      <img className="logo__img logo__img--dark" src="/img/logo-dark.png" alt="" width={402} height={120} />
    </Link>
  );
}
