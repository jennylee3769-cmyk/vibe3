export const slides = [
{kind:'cover',label:'3회차',title:'터미널로 내려간다',description:'검은 화면을 무서워하지 않게 됩니다. 그리고 로그인이 붙습니다.'},
{kind:'safety',label:'안전장치',title:'오늘의 안전장치',highlight:'설치가 25분 안에 안 되면 앱으로 돌아갑니다.',description:'오늘 만들 기능은 Codex 앱으로도 똑같이 됩니다. 설치는 5회차에 다시 도전합니다. 설치 때문에 결과물을 못 만드는 일은 없습니다. 안 되면 손을 들고, 앱으로 6번 슬라이드부터 따라오세요.'},
{label:'단계 1',tag:'터미널',title:'준비물 확인',description:'먼저 검은 창을 엽니다. 맥은 Spotlight(⌘+Space)에서 터미널, 윈도우는 시작 메뉴에서 PowerShell을 검색합니다.',code:'node -v',success:'v20.x.x처럼 v로 시작하는 숫자가 나오면 준비 완료입니다.',errors:[['command not found / 인식할 수 없습니다','Node.js가 없습니다. nodejs.org에서 LTS 버전을 설치하고 터미널을 껐다 다시 켠 뒤 명령을 다시 실행하세요.'],['v18 이하가 나온다','최신 LTS로 다시 설치하세요.']]},
{label:'단계 2',tag:'터미널',title:'Codex CLI 설치하고 로그인',description:'한 줄씩 붙여넣고 Enter를 누릅니다. 한 줄이 끝난 뒤에 다음 줄로 갑니다.',code:'npm install -g @openai/codex\n\ncodex login',success:'codex login을 실행하면 브라우저가 열리고, ChatGPT 로그인 후 터미널에 성공 메시지가 뜹니다.',errors:[['EACCES / 권한 오류(맥)','앞에 sudo를 붙여 sudo npm install -g @openai/codex 로 실행하고 컴퓨터 비밀번호를 입력하세요.'],['윈도우에서 실행 정책 오류','PowerShell을 관리자 권한으로 다시 열어 시도하세요.'],['25분이 지났다','여기서 멈추고 손을 드세요. 오늘은 Codex 앱으로 진행합니다.']]},
{label:'단계 3',tag:'터미널',title:'내 코드를 컴퓨터로 가져오기',description:'내아이디와 my-platform을 자기 것으로 바꾸세요. GitHub 저장소 페이지의 초록색 Code 버튼에서 주소를 복사할 수 있습니다.',code:'git clone https://github.com/내아이디/my-platform.git\n\ncd my-platform\n\nnpm install',success:'added ... packages가 나오면 완료입니다. 2~3분 걸립니다.',errors:[['git이 없다고 나온다','git-scm.com에서 Git을 설치하고 터미널을 다시 켜세요.'],['cd에서 폴더가 없다고 나온다','clone이 성공했는지 확인하세요. ls 또는 dir로 폴더가 보이는지 봅니다.']]},
{label:'단계 4',tag:'터미널',title:'내 컴퓨터에서 사이트 띄우기',steps:['폴더 안의 .env.example 파일을 복사해 .env.local이라는 이름으로 만듭니다.','그 파일을 열어 1회차에 Vercel에 넣었던 같은 값 2개를 채웁니다.','터미널에서 npm run dev를 실행합니다.','브라우저에서 http://localhost:3000을 엽니다.'],success:'내 사이트가 내 컴퓨터에서 열립니다. 이제 고치면 즉시 반영됩니다.',errors:[['화면이 하얗다','1회차와 같은 원인입니다. .env.local 값 2개를 확인하세요.'],['포트가 사용 중이라고 나온다','이미 떠 있는 것입니다. 터미널에서 Ctrl+C로 끄고 다시 실행하세요.']],warning:'.env.local은 절대 GitHub에 올리지 마세요. 템플릿에 이미 제외 설정이 되어 있으니 그대로 두면 됩니다.'},
{kind:'modes',label:'승인 모드',title:'얘가 내 컴퓨터 파일을 고칩니다. 어디까지 허락할지 정합니다.',cards:[['읽기만','보기만 하고 고치지 않음'],['자동 편집(오늘 이것)','파일은 고치되 위험한 건 물어봄'],['전체 허용','다 알아서 함, 오늘은 쓰지 않습니다.']]},
{label:'단계 5',tag:'터미널',title:'세이브하고 · 망가뜨리고 · 되돌리기',description:'게임에서 어려운 구간 전에 세이브하듯, 코드도 똑같습니다. 직접 한 번 망가뜨렸다가 되돌려 보세요.',code:'# 1. 세이브\n\ngit checkout -b 실험\ngit add -A\ngit commit -m "여기까지 저장"\n\n# 2. 이제 Codex로 아무거나 망가뜨려 봅니다\n\n# 3. 모든 수정 사항을 저장한 시점으로 되돌리기\n\ngit restore .',success:'망가뜨린 화면이 원래대로 돌아옵니다. 망가져도 됩니다. 되돌리면 됩니다.',errors:[['restore 해도 안 돌아온다','git status로 상태를 보고, 그 출력을 Codex에 붙여넣어 물어보세요.']]},
{label:'단계 6',tag:'Supabase',title:'수업 전 필수 설정',steps:['Supabase → Authentication → Sign In / Providers로 갑니다.','Email 항목을 엽니다.','Confirm email을 끕니다.','저장합니다.'],success:'이제 가입하면 확인 메일 없이 바로 로그인됩니다.',errors:[['메뉴 이름이 다르다','Supabase 화면은 자주 바뀝니다. Authentication 안에서 Email 설정을 찾아 확인 메일 요구를 끄면 됩니다.']],warning:'이걸 안 끄면 가입은 되는데 로그인이 안 됩니다. 실습용 설정이며 실제 서비스로 운영할 땐 다시 켜야 합니다.'},
{label:'프롬프트 카드 5',tag:'복사해서 사용하세요',title:'로그인 붙이기',code:'AGENTS.md 와 docs/spec.md 를 먼저 읽어줘.\n\nSupabase 인증을 사용해서 이메일 회원가입과 로그인을 붙여줘.\n\n- /signup 회원가입, /login 로그인 페이지\n- 로그인하면 상단에 내 이메일과 로그아웃 버튼이 보이게\n- 로그인하지 않은 사람이 /new에 들어오면 로그인 페이지로 보내줘\n\n작업 전에 무엇을 바꿀지 계획을 먼저 알려주고,\n내가 "진행"이라고 답하면 그때 수정해줘.',after:'로그인은 건드리는 파일이 많습니다. 계획을 먼저 받아 읽고 "진행"이라고 답하세요.'},
{label:'단계 7',tag:'직접 확인',title:'로그인 직접 확인하기',steps:['PR을 합치고 배포를 기다립니다.','내 사이트 /signup에서 진짜 쓰는 이메일로 가입합니다.','상단에 내 이메일이 보이는지 확인합니다.','로그아웃을 눌러 사라지는지 확인합니다.','다시 /login에서 로그인해 봅니다.'],success:'가입 → 로그인 → 로그아웃이 모두 됩니다. Supabase Authentication → Users에도 내 계정이 보입니다.',errors:[['가입은 되는데 로그인이 안 된다','단계 6 — Confirm email을 껐는지 확인하세요.'],['비밀번호가 짧다고 거절','6자 이상으로 만드세요.']]},
{label:'등록 폼 만들기',tag:'복사해서 사용하세요',title:'등록 폼 만들기',code:'/new 경로에 등록 폼을 만들어줘.\ndocs/spec.md의 데이터 항목 표를 그대로 입력 항목으로 써줘.\n\n- 저장하면 Supabase items 테이블에 저장되고 /list로 이동\n- 필수 항목이 비어 있으면 저장 전에 한국어로 알려줘\n- 저장에 실패하면 사용자에게 무엇이 잘못됐는지 보여줘\n- 목록 화면에 "올리기" 버튼을 추가해 이 페이지로 연결해줘'},
{kind:'finish',label:'완성 게이트',title:'오늘 여기까지',checks:['(CLI 성공자) 내 폴더에서 npm run dev가 된다','회원가입 → 로그인 → 로그아웃이 배포된 사이트에서 된다','로그인한 상태로 글을 올리면 목록에 나타난다','로그아웃 상태로 /new에 가면 로그인 화면으로 보내진다']}
];

// 1·2·4·5강은 참고 이미지의 페이지 수와 표지 문구를 기준으로 연결한 HTML 교안입니다.
// 각 페이지는 이미지 자체를 화면에 띄우지 않고, 공통 SlideLayout으로 렌더링됩니다.
const makeLecture = (number, title, description, count, folder) => [
  {kind:'cover', label:`${number}회차`, title, description},
  ...Array.from({length:count - 1}, (_, i) => ({
    label:`${number}회차 · ${String(i + 2).padStart(2, '0')}`,
    tag:'참고 교안 기반',
    title:`${title} · ${i + 2}장`,
    description:'참고 이미지의 흐름을 따라 구성한 강의 페이지입니다. 슬라이드의 텍스트는 선택할 수 있으며 발표 화면에서 바로 읽을 수 있습니다.',
    steps:['핵심 내용을 화면에서 함께 확인합니다.','막히는 부분은 발표자에게 손을 들어 알려주세요.'],
    sourceFolder:folder
  }))
];

export const lectures = {
  1: makeLecture(1, '배포부터 뚫는다', '오늘 집에 갈 때, 모두가 자기 사이트 주소를 가지고 갑니다.', 17, '이신우 강의 3기 1강'),
  2: makeLecture(2, '말 대신 문서로 시킨다', 'Codex가 매번 다르게 만드는 문제를, 문서로 잡습니다.', 14, '이신우 강의 3기 2강 교안'),
  3: slides,
  4: makeLecture(4, '버그를 스스로 잡는다', '빨간 글씨가 떠도 혼자 빠져나옵니다.', 12, '이신우강의 3기 4강'),
  5: makeLecture(5, '남에게 보여줄 물건으로', '링크를 남에게 보내도 부끄럽지 않게 만듭니다.', 11, '이신우 강의 3기 5강')
};
