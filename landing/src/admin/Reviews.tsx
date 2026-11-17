import { useEffect, useState } from 'react';
import { adminSupabase as sb } from './adminClient';

interface SiteReview {
  id: string;
  name: string;
  region: string;
  completed_at: string;
  is_published: boolean;
  review_text: string | null;
  review_author: string | null;
  review_consent: boolean;
}

const FIELDS = 'id,name,region,completed_at,is_published,review_text,review_author,review_consent';

function SiteCard({ site, onSaved }: { site: SiteReview; onSaved: (s: SiteReview) => void }) {
  const [form, setForm] = useState(site);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const dirty = JSON.stringify(form) !== JSON.stringify(site);

  useEffect(() => setForm(site), [site]);

  async function save() {
    setBusy(true);
    setMsg('');
    const patch = {
      is_published: form.is_published,
      review_text: form.review_text?.trim() || null,
      review_author: form.review_author?.trim() || null,
      review_consent: form.review_consent,
    };
    const { error } = await sb!.from('sites').update(patch).eq('id', site.id);
    setBusy(false);
    if (error) setMsg(`저장 실패: ${error.message}`);
    else {
      onSaved({ ...site, ...patch });
      setMsg('저장했습니다. 사이트를 새로고침하면 반영됩니다.');
    }
  }

  const reviewShown = form.is_published && form.review_consent && !!form.review_text?.trim() && !!form.review_author?.trim();

  return (
    <section className="adm-card adm-review">
      <div className="adm-row-between">
        <div>
          <strong>{site.name}</strong>
          <p className="adm-muted">
            {site.region} · {site.completed_at}
          </p>
        </div>
        <label className="adm-switch">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          <span>사이트에 현장 표시</span>
        </label>
      </div>

      <label className="adm-field">
        후기 내용
        <textarea
          rows={3}
          value={form.review_text ?? ''}
          onChange={(e) => setForm({ ...form, review_text: e.target.value })}
          placeholder="고객 후기 (3~4줄)"
        />
      </label>
      <label className="adm-field">
        작성자 표기
        <input
          value={form.review_author ?? ''}
          onChange={(e) => setForm({ ...form, review_author: e.target.value })}
          placeholder="예: 50대 · 금속가공 대표"
        />
      </label>
      <label className="adm-switch">
        <input
          type="checkbox"
          checked={form.review_consent}
          onChange={(e) => setForm({ ...form, review_consent: e.target.checked })}
        />
        <span>고객이 후기 공개에 동의함</span>
      </label>
      <p className="adm-muted">
        {reviewShown ? '✓ 사이트에 후기 카드가 표시됩니다.' : '후기 카드는 표시되지 않습니다 (현장 표시·동의·내용·작성자가 모두 있어야 표시).'}
      </p>

      <div className="adm-row-between">
        <span className="adm-muted" role="status">
          {msg}
        </span>
        <button className="adm-btn adm-btn--primary" disabled={!dirty || busy} onClick={save}>
          {busy ? '저장 중…' : '저장'}
        </button>
      </div>
    </section>
  );
}

export function Reviews() {
  const [sites, setSites] = useState<SiteReview[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    sb!
      .from('sites')
      .select(FIELDS)
      .order('completed_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setSites(data as SiteReview[]);
      });
  }, []);

  if (err) return <p className="adm-err">현장 목록을 불러오지 못했습니다: {err}</p>;
  if (!sites) return <p className="adm-muted">불러오는 중…</p>;

  return (
    <div className="adm-stack">
      <p className="adm-muted">
        시공현장 {sites.length}곳. 현장명·사진·용량 등 다른 정보는 Supabase Table Editor 의 sites 테이블에서 수정하세요.
      </p>
      {sites.map((s) => (
        <SiteCard key={s.id} site={s} onSaved={(u) => setSites((all) => all!.map((x) => (x.id === u.id ? u : x)))} />
      ))}
    </div>
  );
}
