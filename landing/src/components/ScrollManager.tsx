import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 라우트 이동 시 스크롤 처리
 * - 해시(/#consult 등)가 있으면 해당 섹션으로 이동
 * - 없으면 맨 위로
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // 모바일 메뉴 닫힘(스크롤 잠금 해제)과 페이지 렌더가 끝난 뒤 이동
    const id = window.requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, hash, key]);

  return null;
}
