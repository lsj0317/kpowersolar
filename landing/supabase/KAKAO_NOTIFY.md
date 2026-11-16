# 새 상담 카카오톡 알림 설정 (나에게 보내기)

상담 신청이 Supabase `consultations` 테이블에 저장되면, 대표님 카카오톡 **"나와의 채팅"**으로 알림이 옵니다.

```
[케이파워 솔라] 새 상담 신청
성함: 홍길동
연락처: 010-1234-5678
지역: 김해
지붕: 징크 / 300~1,000평
유입: naver
접수: 11/16 17:36
문의: 공장 지붕 누수 있어요
```

- 비용: 무료
- 받는 사람: 연결한 카카오 계정 1명
- 카카오 로그인 인증은 2개월이면 만료되지만, **매주 자동으로 갱신**하도록 설정하므로 다시 연결할 일은 거의 없습니다.
- 알림이 실패해도 상담 신청 저장에는 영향이 없습니다.

아래 `<프로젝트>`는 Supabase 프로젝트 주소의 앞부분입니다.
(Supabase > Project Settings > API 의 Project URL `https://<프로젝트>.supabase.co`)

---

## 1. Supabase: 테이블 준비 (1분)

SQL Editor > New query 에 [`kakao-notify.sql`](./kakao-notify.sql) 내용을 붙여넣고 **Run**.

- `kakao_tokens`: 카카오 인증 토큰 보관 (방문자는 읽기·쓰기 불가)
- `consultations.notified_at`: 알림 보낸 시각 (같은 상담으로 두 번 보내지 않도록)

## 2. 카카오 디벨로퍼스: 앱 만들기 (5분)

[developers.kakao.com](https://developers.kakao.com) 에 대표님 카카오 계정으로 로그인합니다. 메뉴 이름은 카카오 화면 개편에 따라 조금 다를 수 있습니다.

1. **내 애플리케이션 > 애플리케이션 추가하기**: 앱 이름 `케이파워 솔라 알림`, 회사명 입력 > 저장
2. **앱 키**: **REST API 키** 복사해 두기
3. **카카오 로그인**: 활성화 **ON**
   - **Redirect URI** 등록: `https://<프로젝트>.supabase.co/functions/v1/kakao-notify`
4. **카카오 로그인 > 동의항목**: **카카오톡 메시지 전송(talk_message)** 을 **선택 동의**로 설정 (목적: 상담 알림)
5. **플랫폼 > Web**: 사이트 도메인 `https://kpowersolar.vercel.app` 등록 (알림의 "사이트 열기" 버튼용)
6. **보안 > Client Secret**: "사용함"으로 되어 있으면 코드를 복사해 두기 (사용 안 함이면 건너뜀)

## 3. Supabase: 알림 함수 올리기 (3분)

1. **Edge Functions > Deploy a new function > Via Editor**
2. 함수 이름: `kakao-notify` (정확히 이 이름)
3. 기본 코드를 모두 지우고 [`functions/kakao-notify/index.ts`](./functions/kakao-notify/index.ts) 내용을 붙여넣기
   (GitHub 에서 **Raw** 를 누르면 복사하기 쉽습니다) > **Deploy**
4. 배포된 함수 > **Details(또는 Settings)** > **Enforce JWT Verification 끄기** > Save
   - 휴대폰 브라우저로 연결 주소를 열어야 해서 끕니다. 함수는 이 상태를 전제로 안전하게 만들어져 있습니다.

## 4. Supabase: 시크릿 넣기 (2분)

**Edge Functions > Secrets** 에 추가합니다.

| Name | Value |
|---|---|
| `KAKAO_REST_API_KEY` | 2-2 에서 복사한 REST API 키 |
| `KAKAO_SETUP_KEY` | **직접 정하는 설정 암호** (영문·숫자 20자 이상 권장, 다른 사람에게 알려주지 않기) |
| `KAKAO_CLIENT_SECRET` | 2-6 에서 복사한 코드 (Client Secret 을 쓰는 경우만) |

## 5. 내 카카오톡 연결 (1분)

휴대폰 브라우저에서 아래 주소를 엽니다. (`설정암호` 자리에 4번의 `KAKAO_SETUP_KEY`)

```
https://<프로젝트>.supabase.co/functions/v1/kakao-notify?action=connect&key=설정암호
```

카카오 로그인 > **카카오톡 메시지 전송** 동의 > "연결 완료" 화면이 나오고, 카카오톡 **나와의 채팅**에 연결 확인 메시지가 옵니다.

## 6. Supabase: 상담 저장 시 함수 호출 (2분)

**Database > Webhooks** (또는 Integrations > Database Webhooks) > **Create a new hook**

| 항목 | 값 |
|---|---|
| Name | `consult_kakao` |
| Table | `consultations` |
| Events | **Insert** 만 체크 |
| Type | **Supabase Edge Functions** |
| Edge Function | `kakao-notify` |
| Method | POST |

## 7. Supabase: 매주 인증 자동 갱신 (2분)

**Integrations > Cron** (처음이면 Enable) > **Create job**

| 항목 | 값 |
|---|---|
| Name | `kakao_refresh` |
| Schedule | `0 0 * * 1` (매주 월요일 오전 9시) |
| Type | **Supabase Edge Function** |
| Edge Function | `kakao-notify` |
| Method | POST |
| Body | `{"action":"refresh"}` |

## 8. 테스트

- 테스트 메시지: `https://<프로젝트>.supabase.co/functions/v1/kakao-notify?action=test&key=설정암호`
- 실제 흐름: https://kpowersolar.vercel.app 에서 상담 신청 > 몇 초 안에 카카오톡 알림

## 문제가 생기면

- **Edge Functions > kakao-notify > Logs** 에 오류 내용이 남습니다.
- 알림이 갑자기 안 오면: 5번 연결 주소를 다시 열어 카카오톡을 다시 연결하세요. (카카오 계정 비밀번호 변경, 연결 끊기 등으로 인증이 풀린 경우)
- 받는 사람을 바꾸려면: 새 사람의 카카오 계정으로 5번을 진행하면 그 계정으로 바뀝니다. (카카오 앱의 "팀원"으로 먼저 추가해야 할 수 있습니다)
