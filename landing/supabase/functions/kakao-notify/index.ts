/**
 * 새 상담 카카오톡 알림 (카카오톡 "나에게 보내기")
 *
 * Supabase Edge Function. 설정 방법은 supabase/KAKAO_NOTIFY.md 참고.
 *
 * 호출 경로 (함수 주소 = {SUPABASE_URL}/functions/v1/kakao-notify)
 *  - POST (Database Webhook, consultations INSERT) : 새 상담을 카카오톡으로 전송
 *  - GET  ?action=connect&key=설정암호            : 카카오 로그인으로 내 카카오톡 연결
 *  - GET  ?code=...&state=...                     : 카카오 로그인 후 돌아오는 주소 (자동)
 *  - GET  ?action=test&key=설정암호               : 테스트 메시지 보내기
 *  - POST/GET ?action=refresh                     : 토큰 미리 갱신 (매주 Cron 으로 호출)
 *
 * 함수는 "Enforce JWT verification" 을 끄고 배포합니다 (브라우저로 연결 주소를 열어야 하므로).
 * 그래서 아무나 호출할 수 있다고 가정하고 만들었습니다.
 *  - 연결·테스트는 설정 암호(KAKAO_SETUP_KEY)가 있어야 함
 *  - 웹훅은 요청 본문을 믿지 않고, DB 에서 상담을 다시 읽어 "아직 알림을 안 보낸 최근 상담"일 때만 보냄
 *  - refresh 는 토큰만 갱신하므로 누가 불러도 해가 없음
 *
 * 필요한 Secrets (Edge Functions > Secrets)
 *  - KAKAO_REST_API_KEY   : 카카오 디벨로퍼스 앱의 REST API 키
 *  - KAKAO_CLIENT_SECRET  : (앱에서 Client Secret 을 "사용함"으로 둔 경우만)
 *  - KAKAO_SETUP_KEY      : 연결·테스트 주소에 붙일 설정 암호 (직접 정한 아무 문자열)
 *  - SITE_URL             : (선택) 메시지 버튼이 열 주소. 기본 https://kpowersolar.vercel.app
 *  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 는 Supabase 가 자동으로 넣어 줍니다.
 */

const env = (k: string) => Deno.env.get(k) ?? '';

const SUPABASE_URL = env('SUPABASE_URL');
const SERVICE_KEY = env('SUPABASE_SERVICE_ROLE_KEY');
const REST_KEY = env('KAKAO_REST_API_KEY');
const CLIENT_SECRET = env('KAKAO_CLIENT_SECRET');
const SETUP_KEY = env('KAKAO_SETUP_KEY');
const SITE_URL = env('SITE_URL') || 'https://kpowersolar.vercel.app';
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/kakao-notify`;

const KAUTH = 'https://kauth.kakao.com';
const KAPI = 'https://kapi.kakao.com';

/** 이보다 오래된 상담은 알림을 보내지 않음 (웹훅 재전송·악의적 호출 방지) */
const MAX_AGE_MS = 60 * 60 * 1000;

// ---------------------------------------------------------------- DB (PostgREST)

async function db(path: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`DB ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

interface TokenRow {
  access_token: string;
  access_expires_at: string;
  refresh_token: string;
  refresh_expires_at: string | null;
}

interface KakaoTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

const inSec = (s: number) => new Date(Date.now() + s * 1000).toISOString();

async function saveToken(t: KakaoTokenResponse, prev?: TokenRow) {
  const row = {
    id: 1,
    access_token: t.access_token,
    access_expires_at: inSec(t.expires_in),
    // 카카오는 만료 1개월 이내에 갱신할 때만 새 refresh_token 을 줌
    refresh_token: t.refresh_token ?? prev?.refresh_token,
    refresh_expires_at: t.refresh_token_expires_in
      ? inSec(t.refresh_token_expires_in)
      : (prev?.refresh_expires_at ?? null),
    updated_at: new Date().toISOString(),
  };
  await db('kakao_tokens?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
}

async function loadToken(): Promise<TokenRow | null> {
  const rows = await db('kakao_tokens?id=eq.1&select=*');
  return rows?.[0] ?? null;
}

// ---------------------------------------------------------------- 카카오 인증

async function kakaoToken(params: Record<string, string>): Promise<KakaoTokenResponse> {
  const body = new URLSearchParams({ client_id: REST_KEY, ...params });
  if (CLIENT_SECRET) body.set('client_secret', CLIENT_SECRET);
  const res = await fetch(`${KAUTH}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`카카오 토큰 오류 ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function refresh(prev: TokenRow): Promise<TokenRow> {
  const t = await kakaoToken({ grant_type: 'refresh_token', refresh_token: prev.refresh_token });
  await saveToken(t, prev);
  return (await loadToken())!;
}

/** 유효한 access token (만료 2분 전이면 갱신) */
async function accessToken(): Promise<string> {
  const row = await loadToken();
  if (!row) throw new Error('카카오톡이 아직 연결되지 않았습니다. ?action=connect 로 먼저 연결하세요.');
  if (new Date(row.access_expires_at).getTime() - Date.now() > 120_000) return row.access_token;
  return (await refresh(row)).access_token;
}

async function sendMemo(text: string) {
  const template = {
    object_type: 'text',
    text,
    link: { web_url: SITE_URL, mobile_web_url: SITE_URL },
    button_title: '사이트 열기',
  };
  const res = await fetch(`${KAPI}/v2/api/talk/memo/default/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({ template_object: JSON.stringify(template) }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.result_code !== 0) {
    throw new Error(`카카오톡 전송 오류 ${res.status}: ${JSON.stringify(json)}`);
  }
}

// ---------------------------------------------------------------- 메시지 만들기

interface Consultation {
  id: string;
  name: string;
  phone: string;
  region: string | null;
  message: string | null;
  source: string | null;
  created_at: string;
  notified_at: string | null;
}

export function formatPhone(p: string) {
  const d = p.replace(/\D/g, '');
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) {
    return d.startsWith('02')
      ? `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`
      : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (d.length === 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
  return d;
}

function formatKst(iso: string) {
  const d = new Date(new Date(iso).getTime() + 9 * 3600_000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

/** 카카오 텍스트 메시지는 최대 200자 */
export const MAX_TEXT = 200;

export function buildText(c: Pick<Consultation, 'name' | 'phone' | 'region' | 'message' | 'source' | 'created_at'>) {
  const lines = [
    '[케이파워 솔라] 새 상담 신청',
    `성함: ${c.name}`,
    `연락처: ${formatPhone(c.phone)}`,
  ];
  if (c.region) lines.push(`지역: ${c.region}`);

  // 상담 폼은 "지붕 종류: …\n지붕 면적: …\n\n문의 내용" 형태로 저장함
  let body = c.message?.trim() ?? '';
  const head: string[] = [];
  for (const key of ['지붕 종류', '지붕 면적']) {
    const m = body.match(new RegExp(`^${key}: (.+)$`, 'm'));
    if (m) {
      head.push(m[1].trim());
      body = body.replace(m[0], '');
    }
  }
  if (head.length) lines.push(`지붕: ${head.join(' / ')}`);
  if (c.source) lines.push(`유입: ${c.source}`);
  lines.push(`접수: ${formatKst(c.created_at)}`);

  body = body.trim().replace(/\s+/g, ' ');
  let text = lines.join('\n');
  if (body) {
    const room = MAX_TEXT - text.length - '\n문의: '.length;
    if (room > 10) text += `\n문의: ${body.length > room ? body.slice(0, room - 1) + '…' : body}`;
  }
  return text.length > MAX_TEXT ? text.slice(0, MAX_TEXT - 1) + '…' : text;
}

// ---------------------------------------------------------------- 요청 처리

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

const html = (title: string, msg: string, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<title>${esc(title)}</title><body style="font-family:sans-serif;padding:24px;line-height:1.6">` +
      `<h2>${esc(title)}</h2><p>${esc(msg)}</p></body>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

/** 설정 암호 비교 (암호가 비어 있으면 항상 거부) */
const keyOk = (k: string | null) => !!SETUP_KEY && k === SETUP_KEY;

async function notifyConsultation(id: string) {
  const rows: Consultation[] = await db(
    `consultations?id=eq.${encodeURIComponent(id)}&select=id,name,phone,region,message,source,created_at,notified_at`,
  );
  const c = rows?.[0];
  if (!c) return { skipped: 'not_found' };
  if (c.notified_at) return { skipped: 'already_notified' };
  if (Date.now() - new Date(c.created_at).getTime() > MAX_AGE_MS) return { skipped: 'too_old' };

  // 먼저 표시해서 동시에 두 번 불려도 한 번만 보내도록 (notified_at 이 비어 있을 때만 갱신)
  const claimed = await db(`consultations?id=eq.${encodeURIComponent(id)}&notified_at=is.null`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ notified_at: new Date().toISOString() }),
  });
  if (!claimed?.length) return { skipped: 'already_notified' };

  try {
    await sendMemo(buildText(c));
  } catch (e) {
    // 실패하면 표시를 되돌려 다시 시도할 수 있게
    await db(`consultations?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ notified_at: null }),
    }).catch(() => {});
    throw e;
  }
  return { sent: true };
}

export async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  // POST 본문(웹훅·Cron)은 한 번만 읽을 수 있어 미리 읽어 둠
  const payload = req.method === 'POST' ? await req.json().catch(() => null) : null;
  // Cron 은 주소(?action=refresh) 또는 본문({"action":"refresh"}) 어느 쪽으로 불러도 됨
  const action = url.searchParams.get('action') ?? (typeof payload?.action === 'string' ? payload.action : null);

  try {
    // 1) 카카오 로그인 시작
    if (action === 'connect') {
      if (!keyOk(url.searchParams.get('key'))) return html('설정 암호가 맞지 않습니다', '주소 끝의 key 값을 확인하세요.', 403);
      if (!REST_KEY) return html('설정이 덜 됐습니다', 'KAKAO_REST_API_KEY 시크릿을 먼저 넣어 주세요.', 500);
      const auth = new URL(`${KAUTH}/oauth/authorize`);
      auth.searchParams.set('client_id', REST_KEY);
      auth.searchParams.set('redirect_uri', REDIRECT_URI);
      auth.searchParams.set('response_type', 'code');
      auth.searchParams.set('scope', 'talk_message');
      auth.searchParams.set('state', SETUP_KEY);
      return Response.redirect(auth.toString(), 302);
    }

    // 2) 카카오 로그인 후 돌아옴
    const code = url.searchParams.get('code');
    if (req.method === 'GET' && (code || url.searchParams.get('error'))) {
      if (!keyOk(url.searchParams.get('state'))) return html('연결 실패', '잘못된 요청입니다. 연결 주소로 다시 시도하세요.', 403);
      if (!code) {
        return html('연결 취소', `카카오 로그인이 취소되었습니다. (${url.searchParams.get('error_description') ?? ''})`, 400);
      }
      const t = await kakaoToken({ grant_type: 'authorization_code', redirect_uri: REDIRECT_URI, code });
      await saveToken(t);
      await sendMemo('[케이파워 솔라] 카카오톡 알림이 연결되었습니다. 새 상담이 들어오면 이 채팅으로 알려드립니다.');
      return html('연결 완료', '카카오톡 "나와의 채팅"에 확인 메시지를 보냈습니다. 이 창은 닫아도 됩니다.');
    }

    // 3) 테스트 메시지
    if (action === 'test') {
      if (!keyOk(url.searchParams.get('key'))) return html('설정 암호가 맞지 않습니다', '주소 끝의 key 값을 확인하세요.', 403);
      await sendMemo(
        buildText({
          name: '테스트',
          phone: '01000000000',
          region: '김해',
          message: '지붕 종류: 샌드위치 패널\n지붕 면적: 300~1,000평\n\n알림 테스트입니다.',
          source: null,
          created_at: new Date().toISOString(),
        }),
      );
      return html('테스트 전송 완료', '카카오톡 "나와의 채팅"을 확인하세요.');
    }

    // 4) 토큰 미리 갱신 (매주 Cron)
    if (action === 'refresh') {
      const row = await loadToken();
      if (!row) return json({ ok: false, reason: 'not_connected' }, 409);
      const next = await refresh(row);
      return json({ ok: true, access_expires_at: next.access_expires_at, refresh_expires_at: next.refresh_expires_at });
    }

    // 5) Database Webhook: consultations INSERT
    if (req.method === 'POST') {
      const id = payload?.record?.id;
      if (payload?.type !== 'INSERT' || payload?.table !== 'consultations' || typeof id !== 'string') {
        return json({ ok: false, reason: 'ignored' }, 400);
      }
      const result = await notifyConsultation(id);
      return json({ ok: true, ...result });
    }

    return html('케이파워 솔라 상담 알림', '이 주소는 알림용입니다.', 404);
  } catch (e) {
    console.error('[kakao-notify]', e);
    const msg = e instanceof Error ? e.message : String(e);
    return action === 'connect' || action === 'test' || req.method === 'GET'
      ? html('오류', msg, 500)
      : json({ ok: false, error: msg }, 500);
  }
}

Deno.serve(handler);
