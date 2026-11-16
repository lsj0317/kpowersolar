import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { CloseIcon, MenuIcon, PhoneIcon } from '@/components/Icons';
import { COMPANY, NAV_ITEMS, telHref } from '@/data/company';

export function Header() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 라우트가 바뀌면 메뉴 닫기
  useEffect(() => setOpen(false), [pathname]);

  // 모바일 시트: 스크롤 잠금 + ESC 닫기 + 포커스 이동
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      menuBtnRef.current?.focus();
    };
  }, [open]);

  // 랜딩 히어로 위에서만 투명, 상세페이지는 항상 흰 배경
  const solid = !isLanding || scrolled || open;
  const close = () => setOpen(false);

  return (
    <header className={`header ${solid ? 'header--solid' : ''}`}>
      <div className="container header__inner">
        <Logo inverse={!solid} />

        <nav className="header__nav" aria-label="주요 메뉴">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a className="header__tel" href={telHref}>
            <PhoneIcon size={18} />
            <span>{COMPANY.phone}</span>
          </a>
          <a className="btn btn--navy btn--sm header__cta" href="#consult">
            무료 상담
          </a>
          <a className="icon-btn header__tel-icon" href={telHref} aria-label={`전화 상담 ${COMPANY.phone}`}>
            <PhoneIcon />
          </a>
          <button
            ref={menuBtnRef}
            type="button"
            className="icon-btn header__menu-btn"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="sheet" role="dialog" aria-modal="true" aria-label="전체 메뉴">
          <div className="container sheet__top">
            <Logo onClick={close} />
            <button ref={closeBtnRef} type="button" className="icon-btn" aria-label="메뉴 닫기" onClick={close}>
              <CloseIcon />
            </button>
          </div>
          <nav className="container sheet__body" aria-label="모바일 메뉴">
            <a className="btn btn--navy btn--block" href="#consult" onClick={close}>
              무료 상담 신청
            </a>
            <ul className="sheet__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a className="sheet__tel" href={telHref}>
              <PhoneIcon /> {COMPANY.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
