import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { adminSupabase as sb } from './adminClient';
import {
  STATUSES,
  STATUS_LABEL,
  formatDateTime,
  formatPhone,
  kstDayKey,
  parseMessage,
  toCsv,
  type Consultation,
  type ConsultStatus,
  type Note,
} from './stats';

function StatusBadge({ status }: { status: ConsultStatus }) {
  return <span className={`adm-status adm-status--${status}`}>{STATUS_LABEL[status] ?? status}</span>;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  // 일부 브라우저는 문서에 붙어 있는 링크만 파일 이름을 지켜 줌
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** 상담 1건 상세: 상태 변경, 댓글, 삭제 */
function Detail({
  item,
  userEmail,
  onClose,
  onUpdated,
  onDeleted,
}: {
  item: Consultation;
  userEmail: string;
  onClose: () => void;
  onUpdated: (c: Consultation) => void;
  onDeleted: (id: string) => void;
}) {
  const { roofType, roofArea, body } = parseMessage(item.message);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setNotes(null);
    setErr('');
    sb!
      .from('consultation_notes')
      .select('*')
      .eq('consultation_id', item.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) setErr(`댓글을 불러오지 못했습니다: ${error.message}`);
        else setNotes(data as Note[]);
      });
  }, [item.id]);

  async function setStatus(status: ConsultStatus) {
    if (status === item.status) return;
    setBusy(true);
    setErr('');
    const patch = { status, handled_at: status === 'new' ? null : new Date().toISOString() };
    const { error } = await sb!.from('consultations').update(patch).eq('id', item.id);
    setBusy(false);
    if (error) setErr(`상태 변경 실패: ${error.message}`);
    else onUpdated({ ...item, ...patch });
  }

  async function addNote(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    setErr('');
    const { data, error } = await sb!
      .from('consultation_notes')
      .insert({ consultation_id: item.id, body: text, author_email: userEmail || null })
      .select()
      .single();
    setBusy(false);
    if (error) return setErr(`댓글 저장 실패: ${error.message}`);
    setNotes((n) => [...(n ?? []), data as Note]);
    setDraft('');
    // 댓글을 달면 신규 → 연락함 으로 자동 변경
    if (item.status === 'new') setStatus('contacted');
  }

  async function removeNote(id: string) {
    if (!confirm('이 댓글을 삭제할까요?')) return;
    const { error } = await sb!.from('consultation_notes').delete().eq('id', id);
    if (error) setErr(`댓글 삭제 실패: ${error.message}`);
    else setNotes((n) => n?.filter((x) => x.id !== id) ?? null);
  }

  async function removeItem() {
    if (!confirm(`${item.name} 님의 상담 기록과 댓글을 모두 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const { error } = await sb!.from('consultations').delete().eq('id', item.id);
    if (error) setErr(`삭제 실패: ${error.message}`);
    else onDeleted(item.id);
  }

  return (
    <div className="adm-sheet" role="dialog" aria-modal="true" aria-label={`${item.name} 상담 상세`}>
      <div className="adm-sheet__backdrop" onClick={onClose} />
      <div className="adm-sheet__panel">
        <div className="adm-row-between">
          <h2 className="adm-h2">{item.name}</h2>
          <button className="adm-btn" onClick={onClose}>
            닫기
          </button>
        </div>

        <dl className="adm-dl">
          <dt>연락처</dt>
          <dd>
            <a href={`tel:${item.phone}`}>{formatPhone(item.phone)}</a>
          </dd>
          <dt>지역</dt>
          <dd>{item.region ?? '-'}</dd>
          <dt>지붕 종류</dt>
          <dd>{roofType ?? '-'}</dd>
          <dt>지붕 면적</dt>
          <dd>{roofArea ?? (item.roof_area_pyeong ? `${item.roof_area_pyeong}평` : '-')}</dd>
          <dt>접수</dt>
          <dd>{formatDateTime(item.created_at)}</dd>
          <dt>유입</dt>
          <dd>{item.source ?? '직접 방문'}</dd>
        </dl>
        {body && <p className="adm-msg">{body}</p>}

        <h3 className="adm-h3">처리 상태</h3>
        <div className="adm-seg" role="group" aria-label="처리 상태">
          {STATUSES.map((s) => (
            <button key={s} className={item.status === s ? 'is-on' : ''} disabled={busy} onClick={() => setStatus(s)}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <h3 className="adm-h3">댓글 {notes ? `(${notes.length})` : ''}</h3>
        {notes === null && !err && <p className="adm-muted">불러오는 중…</p>}
        {notes?.length === 0 && <p className="adm-muted">통화 내용, 현장 방문 일정 등을 남겨 두세요.</p>}
        <ul className="adm-notes">
          {notes?.map((n) => (
            <li key={n.id}>
              <p>{n.body}</p>
              <div className="adm-notes__meta">
                <span>
                  {n.author_email ?? '관리자'} · {formatDateTime(n.created_at)}
                </span>
                <button className="adm-link adm-link--danger" onClick={() => removeNote(n.id)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form className="adm-note-form" onSubmit={addNote}>
          <textarea
            rows={3}
            maxLength={2000}
            placeholder="댓글 입력 (예: 11/18 통화, 지붕 사진 받기로 함)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="댓글"
          />
          <button className="adm-btn adm-btn--primary" disabled={busy || !draft.trim()}>
            댓글 등록
          </button>
        </form>

        {err && (
          <p className="adm-err" role="alert">
            {err}
          </p>
        )}

        <button className="adm-link adm-link--danger adm-delete" onClick={removeItem}>
          이 상담 기록 삭제
        </button>
      </div>
    </div>
  );
}

export function Consultations({
  items,
  onChange,
  reload,
  userEmail,
}: {
  items: Consultation[] | null;
  onChange: (items: Consultation[]) => void;
  reload: () => Promise<void>;
  userEmail: string;
}) {
  const [status, setStatus] = useState<ConsultStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: items?.length ?? 0 };
    for (const c of items ?? []) m[c.status] = (m[c.status] ?? 0) + 1;
    return m;
  }, [items]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const digits = term.replace(/\D/g, '');
    return (items ?? []).filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        (digits.length >= 3 && c.phone.includes(digits)) ||
        (c.region ?? '').includes(term) ||
        (c.message ?? '').toLowerCase().includes(term)
      );
    });
  }, [items, status, q]);

  const open = items?.find((c) => c.id === openId) ?? null;

  if (!items) return <p className="adm-muted">불러오는 중…</p>;

  return (
    <div className="adm-stack">
      <div className="adm-toolbar">
        <div className="adm-seg adm-seg--wrap" role="group" aria-label="상태 필터">
          {(['all', ...STATUSES] as const).map((s) => (
            <button key={s} className={status === s ? 'is-on' : ''} onClick={() => setStatus(s)}>
              {s === 'all' ? '전체' : STATUS_LABEL[s]} <small>{counts[s] ?? 0}</small>
            </button>
          ))}
        </div>
        <div className="adm-toolbar__row">
          <input
            className="adm-search"
            type="search"
            placeholder="검색 (이름·연락처·지역)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="검색"
          />
          <button className="adm-btn" onClick={() => reload()}>
            새로고침
          </button>
          <button
            className="adm-btn"
            disabled={!filtered.length}
            onClick={() => download(`kpowersolar_consultations_${kstDayKey(new Date())}.csv`, toCsv(filtered))}
          >
            엑셀(CSV)
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="adm-muted">조건에 맞는 상담이 없습니다.</p>
      ) : (
        <ul className="adm-list">
          {filtered.map((c) => {
            const { roofType, roofArea, body } = parseMessage(c.message);
            return (
              <li key={c.id}>
                <button className="adm-card adm-item" onClick={() => setOpenId(c.id)}>
                  <div className="adm-row-between">
                    <strong className="adm-item__name">{c.name}</strong>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="adm-item__meta">
                    {formatPhone(c.phone)} · {c.region ?? '지역 미입력'}
                    {(roofType || roofArea) && ` · ${[roofType, roofArea].filter(Boolean).join(' / ')}`}
                  </p>
                  {body && <p className="adm-item__body">{body}</p>}
                  <p className="adm-item__date">{formatDateTime(c.created_at)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open && (
        <Detail
          item={open}
          userEmail={userEmail}
          onClose={() => setOpenId(null)}
          onUpdated={(u) => onChange(items.map((c) => (c.id === u.id ? u : c)))}
          onDeleted={(id) => {
            setOpenId(null);
            onChange(items.filter((c) => c.id !== id));
          }}
        />
      )}
    </div>
  );
}
