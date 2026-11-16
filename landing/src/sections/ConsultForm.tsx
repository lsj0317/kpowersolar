import { useState, type FormEvent } from 'react';
import { COMPANY, telHref } from '@/data/company';
import { submitConsultation } from '@/services/consultations';
import { REGIONS, ROOF_AREA_RANGES, ROOF_TYPES, type ConsultationInput, type Region } from '@/types/domain';

type Status = 'idle' | 'submitting' | 'done' | 'error';
type Errors = Partial<Record<'name' | 'phone' | 'agreePrivacy', string>>;

const initial: ConsultationInput = {
  name: '',
  phone: '',
  region: '',
  roofAreaPyeong: null,
  roofType: '',
  roofAreaRange: '',
  message: '',
  agreePrivacy: false,
};

function validate(v: ConsultationInput): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = '성함을 입력해 주세요.';
  if (!/^0\d{8,10}$/.test(v.phone.replace(/[^0-9]/g, ''))) e.phone = '연락처를 정확히 입력해 주세요.';
  if (!v.agreePrivacy) e.agreePrivacy = '개인정보 수집·이용에 동의해 주세요.';
  return e;
}

/** 탭해서 고르는 선택지 (라디오 버튼을 칩 모양으로) */
function ChipGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="field chip-group">
      <legend>{legend}</legend>
      <div className="chip-group__list">
        {options.map((o) => (
          <label key={o} className="chip-opt">
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              // 이미 고른 칩을 다시 누르면 선택 해제
              onClick={() => value === o && onChange('')}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function getUtmSource(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('utm_source');
  } catch {
    return null;
  }
}

export function ConsultForm() {
  const [values, setValues] = useState<ConsultationInput>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const set = <K extends keyof ConsultationInput>(key: K, value: ConsultationInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('submitting');
    try {
      await submitConsultation({ ...values, source: getUtmSource() });
      setStatus('done');
      setValues(initial);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="section" id="consult" aria-labelledby="consult-title">
      <div className="container consult">
        <div className="consult__copy">
          <p className="section-head__eyebrow">무료 상담</p>
          <h2 id="consult-title" className="h2">
            우리 공장 지붕,
            <br />
            설치가 가능할까요?
          </h2>
          <p className="consult__desc">
            지역과 지붕 면적만 알려주시면 한전 선로 여유와 예상 임대료를 무료로 확인해 드립니다.
            영업일 기준 1일 안에 연락드립니다.
          </p>
          <ul className="consult__checks">
            <li>한전 선로 무료 조회</li>
            <li>지붕 상태 현장 점검</li>
            <li>수익모델별 예상 금액 안내</li>
          </ul>
          <a className="consult__tel" href={telHref}>
            전화 상담 <strong>{COMPANY.phone}</strong>
          </a>
        </div>

        <div className="consult__card">
          {status === 'done' ? (
            <div className="consult__done" role="status">
              <h3 className="card-title">상담 신청이 접수되었습니다</h3>
              <p>담당자가 확인 후 연락드리겠습니다. 급하신 경우 {COMPANY.phone}로 전화 주세요.</p>
              <button type="button" className="btn btn--line" onClick={() => setStatus('idle')}>
                추가 신청하기
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="f-name">
                  성함 <em aria-hidden="true">*</em>
                </label>
                <input
                  id="f-name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'f-name-err' : undefined}
                  required
                />
                {errors.name && <p id="f-name-err" className="field__err">{errors.name}</p>}
              </div>

              <div className="field">
                <label htmlFor="f-phone">
                  연락처 <em aria-hidden="true">*</em>
                </label>
                <input
                  id="f-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="010-0000-0000"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'f-phone-err' : undefined}
                  required
                />
                {errors.phone && <p id="f-phone-err" className="field__err">{errors.phone}</p>}
              </div>

              <ChipGroup
                name="region"
                legend="공장 지역"
                options={REGIONS}
                value={values.region}
                onChange={(v) => set('region', v as Region | '')}
              />
              <ChipGroup
                name="roofType"
                legend="지붕 종류"
                options={ROOF_TYPES}
                value={values.roofType ?? ''}
                onChange={(v) => set('roofType', v)}
              />
              <ChipGroup
                name="roofArea"
                legend="지붕 면적"
                options={ROOF_AREA_RANGES}
                value={values.roofAreaRange ?? ''}
                onChange={(v) => set('roofAreaRange', v)}
              />

              <div className="field">
                <label htmlFor="f-msg">문의 내용 (선택)</label>
                <textarea
                  id="f-msg"
                  rows={3}
                  maxLength={1900}
                  placeholder="정확한 면적, 원하시는 수익모델 등 자유롭게 적어 주세요."
                  value={values.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </div>

              <div className="field field--check">
                <input
                  id="f-agree"
                  type="checkbox"
                  checked={values.agreePrivacy}
                  onChange={(e) => set('agreePrivacy', e.target.checked)}
                  aria-invalid={!!errors.agreePrivacy}
                  aria-describedby="f-agree-desc"
                />
                <label htmlFor="f-agree">
                  개인정보 수집·이용에 동의합니다 (필수)
                  <small id="f-agree-desc">
                    수집 항목: 성함, 연락처, 지역, 지붕 정보 · 목적: 상담 안내 · 보유기간: 상담 종료 후 1년{' '}
                    <a href={COMPANY.privacyUrl}>전문 보기</a>
                  </small>
                </label>
              </div>
              {errors.agreePrivacy && <p className="field__err">{errors.agreePrivacy}</p>}

              {status === 'error' && (
                <p className="field__err" role="alert">
                  전송에 실패했습니다. 잠시 후 다시 시도하시거나 {COMPANY.phone}로 전화 주세요.
                </p>
              )}

              <button type="submit" className="btn btn--navy btn--block btn--lg" disabled={status === 'submitting'}>
                {status === 'submitting' ? '보내는 중…' : '무료 상담 신청하기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
