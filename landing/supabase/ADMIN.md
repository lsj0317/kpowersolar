# 관리자 페이지 설정 (/admin)

주소: **https://kpowersolar.vercel.app/admin**

| 메뉴 | 할 수 있는 것 |
|---|---|
| 통계 | 오늘·이번 달(지난달 같은 기간과 비교)·미처리·전체 상담 수, 최근 30일 일별 추이, 처리 상태·지역·지붕 종류·지붕 면적·유입 경로별 분포 (30일 / 90일 / 전체) |
| 상담 관리 | 상태별 필터, 검색, 상담 상세(전화 걸기), 처리 상태 변경(신규·연락함·완료·보류), **댓글**(통화 내용·일정 기록), 상담 삭제, 엑셀(CSV) 내려받기 |
| 후기·현장 | 시공현장 사이트 표시 켜기·끄기, 고객 후기 내용·작성자 수정, 후기 공개 동의 |

- 관리자 명단에 등록한 계정만 쓸 수 있습니다. 다른 사람이 가입하거나 로그인해도 데이터는 보이지 않습니다 (DB 권한으로 막음).
- 검색엔진에는 노출되지 않습니다.

---

## 1. SQL 실행 (1분)

Supabase > **SQL Editor > New query** 에 [`admin.sql`](./admin.sql) 내용을 붙여넣고 **Run**.

- `admins`: 관리자 명단
- `consultations.status`, `handled_at`: 처리 상태
- `consultation_notes`: 상담 댓글
- 관리자만 상담 조회·수정·삭제, 현장·실적 수정 가능하도록 권한 설정
- 방문자는 지금처럼 상담 신청(저장)만 가능

## 2. 관리자 계정 만들기 (1분)

Supabase > **Authentication > Users > Add user > Create new user**

- Email: 관리자 이메일
- Password: 비밀번호 (12자 이상 권장)
- **Auto Confirm User** 체크 > Create user

## 3. 관리자 명단에 등록 (1분)

SQL Editor 에서 이메일만 바꿔 실행합니다.

```sql
insert into public.admins (user_id)
select id from auth.users where email = '관리자이메일@example.com'
on conflict do nothing;
```

`INSERT 0 1` 이 나오면 등록된 것입니다. (`INSERT 0 0` 이면 이메일 철자를 확인하세요)

직원을 추가할 때도 2~3번을 반복하면 됩니다. 관리자에서 빼려면:

```sql
delete from public.admins
where user_id = (select id from auth.users where email = '뺄이메일@example.com');
```

## 4. 회원가입 막기 (권장, 1분)

Supabase > **Authentication > Sign In / Providers** (또는 Providers > Email)
> **Allow new users to sign up** 끄기 > Save

관리자 명단에 없으면 어차피 데이터가 보이지 않지만, 모르는 계정이 생기지 않도록 막아 두는 것이 좋습니다.

## 5. 로그인

https://kpowersolar.vercel.app/admin 에서 2번의 이메일·비밀번호로 로그인합니다.
한 번 로그인하면 그 기기에서는 로그인 상태가 유지됩니다. 공용 PC 에서는 꼭 **로그아웃** 하세요.

---

## 참고

- **엑셀(CSV)** 파일에는 고객 성함·연락처가 들어 있습니다. 메신저·메일로 함부로 보내지 말고, 다 쓴 파일은 지워 주세요.
- 비밀번호를 잊었으면 Supabase > Authentication > Users 에서 해당 계정 > **Send password recovery** 또는 새 계정을 만들어 3번으로 등록하세요.
- 현장명·사진·용량 같은 다른 정보와 실적 숫자는 아직 Supabase Table Editor 의 `sites`, `stats` 에서 수정합니다.
