import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { adminSupabase as sb } from './adminClient';
import type { Consultation } from './stats';
import { Dashboard } from './Dashboard';
import { Consultations } from './Consultations';
import { Reviews } from './Reviews';
import './admin.css';

type Tab = 'dashboard' | 'consultations' | 'reviews';
const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: '통계' },
  { id: 'consultations', label: '상담 관리' },
  { id: 'reviews', label: '후기·현장' },
];

/** 검색엔진에 관리자 페이지가 노출되지 않도록 */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = '관리자 | 케이파워 솔라';
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);
}

function Login({ onError, error }: { onError: (m: string) => void; error: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    onError('');
    const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) onError(err.message.includes('Invalid login') ? '이메일 또는 비밀번호가 맞지 않습니다.' : err.message);
  }

  return (
    <div className="adm-login">
      <form className="adm-card adm-login__card" onSubmit={submit}>
        <h1>케이파워 솔라 관리자</h1>
        <label>
          이메일
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && (
          <p className="adm-err" role="alert">
            {error}
          </p>
        )}
        <button className="adm-btn adm-btn--primary" disabled={busy}>
          {busy ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
}

export default function AdminApp() {
  useNoIndex();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [items, setItems] = useState<Consultation[] | null>(null);
  const [loadError, setLoadError] = useState('');

  // 로그인 상태
  useEffect(() => {
    if (!sb) return setChecking(false);
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // 관리자 명단에 있는지
  useEffect(() => {
    if (!sb || !session) return setIsAdmin(null);
    sb.rpc('is_admin').then(({ data, error: err }) => {
      if (err) {
        setError(`권한 확인 실패: ${err.message}`);
        setIsAdmin(false);
      } else setIsAdmin(data === true);
    });
  }, [session]);

  const load = useCallback(async () => {
    if (!sb) return;
    setLoadError('');
    const { data, error: err } = await sb
      .from('consultations')
      .select('id,name,phone,region,roof_area_pyeong,message,source,created_at,status,handled_at')
      .order('created_at', { ascending: false })
      .limit(5000);
    if (err) setLoadError(err.message);
    else setItems(data as Consultation[]);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const logout = () => sb?.auth.signOut();

  if (!sb) {
    return (
      <div className="adm-login">
        <div className="adm-card adm-login__card">
          <h1>설정이 필요합니다</h1>
          <p>Supabase 환경 변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 없어 관리자 페이지를 열 수 없습니다.</p>
        </div>
      </div>
    );
  }
  if (checking) return <div className="adm-center">불러오는 중…</div>;
  if (!session) return <Login error={error} onError={setError} />;
  if (isAdmin === null) return <div className="adm-center">권한 확인 중…</div>;
  if (!isAdmin) {
    return (
      <div className="adm-login">
        <div className="adm-card adm-login__card">
          <h1>관리자 권한이 없습니다</h1>
          <p>
            {session.user.email} 계정은 관리자 명단에 없습니다. supabase/ADMIN.md 의 "관리자 등록"을 진행한 뒤 다시
            로그인하세요.
          </p>
          {error && <p className="adm-err">{error}</p>}
          <button className="adm-btn" onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  const pending = items?.filter((c) => c.status === 'new').length ?? 0;

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top__in">
          <strong className="adm-top__brand">케이파워 솔라 관리자</strong>
          <div className="adm-top__right">
            <a className="adm-link" href="/" target="_blank" rel="noreferrer">
              사이트 보기
            </a>
            <button className="adm-link" onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>
        <nav className="adm-tabs" aria-label="관리 메뉴">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`adm-tab ${tab === t.id ? 'is-on' : ''}`}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'consultations' && pending > 0 && <span className="adm-badge">{pending}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="adm-main">
        {loadError && (
          <p className="adm-err" role="alert">
            상담 기록을 불러오지 못했습니다: {loadError}{' '}
            <button className="adm-link" onClick={load}>
              다시 시도
            </button>
          </p>
        )}
        {tab === 'dashboard' && <Dashboard items={items} onOpenList={() => setTab('consultations')} />}
        {tab === 'consultations' && (
          <Consultations items={items} onChange={setItems} reload={load} userEmail={session.user.email ?? ''} />
        )}
        {tab === 'reviews' && <Reviews />}
      </main>
    </div>
  );
}
