# ELC 영어공부방 저장소 작업 지침

## 1. 목적과 우선순위

- 이 저장소에서는 ELC 영어공부방 홈페이지만 작업한다.
- 사용자의 최신 명시적 지시를 우선한다. 작업 범위를 임의로 확대하지 않는다.
- 확인·설명만 요청받은 경우 파일 수정, 의존성 설치, 빌드, 배포를 진행하지 않는다.
- 작업 전 이 파일, `README.md`, `docs/spec.md`와 해당 작업 대상 파일을 읽는다. 명시적으로 요청된 스킬이 있으면 해당 `SKILL.md`도 먼저 읽는다.
- README에는 강의 자료 설명이 섞여 있다. ELC 홈페이지의 실제 진입점은 `index.html`이다.

## 2. 수정 가능한 범위

ELC 관련 구현 변경은 다음 경로로 한정한다.

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `list/`
- `api/`
- `supabase/`
- `docs/spec.md`

`AGENTS.md`는 사용자가 요청한 프로젝트 지침 파일이다. 이 파일 생성 요청을 다른 설정 파일 변경 권한으로 확대 해석하지 않는다.

## 3. 보호 대상

다음 파일과 폴더는 수정·삭제·이동·덮어쓰기하지 않으며, 내부에 새 파일도 추가하지 않는다.

- 모든 이신우 강의 자료 폴더와 파일
- `slides.html`
- `src/`
- `public/`
- `qa/`
- `backups/`
- `records/`

그 밖의 `package.json`, `package-lock.json`, `vite.config.js`, `README.md`, `WORK_HISTORY.md`, `PRESERVATION_POLICY.md` 등도 현재 허용된 수정 범위 밖이다. 변경이 꼭 필요하면 이유와 구체적인 변경안을 먼저 제시한다.

## 4. 원본과 Git 기록 보존

- 기존 파일, 참고 자료, 중간 결과, 작업 기록을 삭제하지 않는다.
- 허용된 파일을 수정할 때에도 수정 직전 원본을 날짜·시간별로 보존한다. 기존 백업을 덮어쓰지 않는다.
- 백업과 작업 기록이 필요하면 저장소 바깥의 형제 폴더 `../vibe3-elc-worklogs/`에 작업별 새 폴더를 만들어 보관한다. 원본은 원래 위치에 유지한다.
- `PRESERVATION_POLICY.md`의 보존 취지는 따르되, 기존 `backups/`, `records/`, `WORK_HISTORY.md`에 쓰라는 지침은 사용자가 지정한 최신 작업 범위보다 우선하지 않는다.
- 사용자의 기존 변경은 그대로 보존하며, 작업 시작과 종료에 `git status --short --branch`를 확인한다.
- `git reset --hard`, `git clean`, 강제 푸시, 기존 커밋 수정·재작성, 임의 체크아웃 복원 등 파일이나 Git 기록을 잃을 수 있는 작업을 하지 않는다.
- 커밋, 푸시, 배포는 사용자가 요청하거나 명시적으로 승인한 범위에서만 진행한다.

## 5. 현재 구조와 실행

- 홈페이지: `index.html` + `styles.css` + `script.js`
- 수업 목록: `list/index.html`, `list/list.js`, `list/list.css`, `list/config.js`
- 수업 조회 API: `api/items.js` → Supabase `items` 테이블
- 상담 이메일 API: `api/contact.js` → Resend
- 데이터베이스 정의와 초기 데이터: `supabase/schema.sql`, `supabase/seed.sql`
- 기획 기준: `docs/spec.md`. 기획된 기능을 구현 완료된 기능으로 설명하지 않는다.

설치와 실행이 작업 범위에 포함된 경우 PowerShell에서 다음을 사용한다.

```powershell
cd D:\260914_codex3-3\vibe3
npm.cmd ci
npm.cmd run dev
```

- 홈페이지 주소: `http://localhost:3000/`
- 수업 목록 주소: `http://localhost:3000/list/`
- `npm.cmd run build`: Vite 빌드
- `npm.cmd run preview`: 빌드 결과 미리보기, 기본 포트 4173
- Vite 개발 서버만으로 `api/`의 서버 함수가 실행되지는 않는다. API 검증에는 이를 지원하는 실행 환경이 별도로 필요하다.
- 현재 빌드 설정에는 강의용 `slides.html`도 포함된다. 이를 이유로 강의 코드나 빌드 설정을 임의로 수정하지 않는다.

## 6. 환경변수와 외부 서비스

- 수업 조회: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- 상담 이메일: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- 설정 형식은 `.env.example`을 참고한다. 실제 키·토큰·개인정보를 코드, Git, 로그 또는 답변에 노출하지 않는다.
- Resend 키와 서버 전용 자격증명은 브라우저 코드에 넣지 않는다.
- SQL 파일이 존재한다는 사실만으로 실제 DB에 적용되었다고 판단하지 않는다.
- 외부 DB 변경, 실제 상담 이메일 발송, 운영 데이터 변경은 해당 행동에 대한 사용자 요청 없이 테스트 목적으로 실행하지 않는다.

## 7. 구현 및 검증 기준

- ELC 브랜드 문구, 사용자 제공 이미지와 실제 정보를 보존한다. 수업 일정·모집 상태·경력 등 확인되지 않은 내용을 만들지 않는다.
- 홈페이지와 수업 목록의 모바일·데스크톱 가독성, 키보드 조작, 폼 레이블과 오류 안내를 유지한다.
- 변경에 맞는 검증만 수행하며, 검증 산출물을 보호 폴더에 저장하지 않는다.
- 정적 파일 검토, 서버 실행, 브라우저 확인, API 연결, 실제 배포 검증을 구분해 보고한다. 실행하지 않은 검증은 완료했다고 말하지 않는다.
- 마무리에는 변경 파일, 변경 내용, 수행한 검증, 남은 제약을 간단히 보고한다.
