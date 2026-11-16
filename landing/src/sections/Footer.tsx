import { COMPANY } from '@/data/company';
import { isSupabaseEnabled } from '@/lib/supabase';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__brand">
          <strong>{COMPANY.name}</strong> {COMPANY.nameEn}
        </p>
        <address className="footer__info">
          <span>대표 {COMPANY.ceo}</span>
          <span>사업자등록번호 {COMPANY.bizNo}</span>
          <span>{COMPANY.licenseNo}</span>
          <br />
          <span>{COMPANY.address}</span>
          <span>
            전화 <a href={`tel:${COMPANY.phone.replace(/-/g, '')}`}>{COMPANY.phone}</a>
          </span>
          <span>
            이메일 <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </span>
        </address>
        <p className="footer__bottom">
          <a href={COMPANY.privacyUrl}>
            <strong>개인정보처리방침</strong>
          </a>
          <span>© {new Date().getFullYear()} K-POWER SOLAR. All rights reserved.</span>
          {import.meta.env.DEV && (
            <span className="footer__dev">데이터: {isSupabaseEnabled ? 'Supabase' : '목업'}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
