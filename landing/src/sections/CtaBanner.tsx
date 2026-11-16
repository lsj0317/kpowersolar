import { COMPANY, telHref } from '@/data/company';

export function CtaBanner() {
  return (
    <section className="section section--tight" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-banner">
          <div>
            <h2 id="cta-title" className="cta-banner__title">
              지붕 면적만 알려주세요.
              <br />
              예상 임대료를 바로 계산해 드립니다.
            </h2>
            <p className="cta-banner__desc">상담·현장 점검·선로 조회 모두 무료입니다.</p>
          </div>
          <div className="cta-banner__btns">
            <a className="btn btn--white" href="#consult">
              무료 상담 신청
            </a>
            <a className="btn btn--outline-light" href={telHref}>
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
