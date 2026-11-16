import { Photo } from '@/components/Photo';

const POINTS = [
  {
    no: '01',
    title: '한전 선로부터 먼저 확인',
    desc: '설치 가능 여부를 계약 전에 무료로 조회합니다. 안 되는 곳은 안 된다고 말씀드립니다.',
  },
  {
    no: '02',
    title: '공장은 멈추지 않게',
    desc: '무타공 공법으로 지붕에 구멍을 내지 않고, 조업 중에도 공사를 진행합니다.',
  },
  {
    no: '03',
    title: '준공 후에도 곁에서',
    desc: '발전량 모니터링, 정기 점검, 보험까지 계약 기간 동안 직접 관리합니다.',
  },
];

export function WhySection() {
  return (
    <section className="section dark-photo" id="why" aria-labelledby="why-title">
      <Photo className="dark-photo__bg" alt="" placeholderLabel="" />
      <div className="dark-photo__overlay" aria-hidden="true" />
      <div className="container dark-photo__inner">
        <div className="dark-photo__head">
          <p className="section-head__eyebrow">왜 케이파워 솔라인가</p>
          <h2 id="why-title" className="h2">
            부산·울산·경남 공장 지붕만
            <br />
            직접 보고, 직접 짓습니다
          </h2>
        </div>
        <ul className="glass-list">
          {POINTS.map((p) => (
            <li key={p.no} className="glass-card">
              <span className="glass-card__no">{p.no}</span>
              <h3 className="glass-card__title">{p.title}</h3>
              <p>{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
