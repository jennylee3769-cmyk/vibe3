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

// 1·2·4·5강은 참고 이미지의 각 페이지를 읽어 HTML 교안으로 재구성한 데이터입니다.
const page = (number, i, title, description, extra={}) => ({label:`${number}회차 · ${String(i).padStart(2,'0')}`, ...extra, title, description});
const makeLecture = (number, title, description, pages, folder) => [{kind:'cover', label:`${number}회차`, title, description, referenceImage:`/lecture-crops/lecture${number}/01.png`}, ...pages.map((x,i)=>({...x, label:x.label||`${number}회차 · ${String(i+2).padStart(2,'0')}`, sourceFolder:folder, referenceImage:`/lecture-crops/lecture${number}/${String(i+2).padStart(2,'0')}.png`}))];

const lecture1Pages = [
 page(1,2,'대부분의 수업은 마지막 날 배포하다 끝납니다.','그래서 이 과정은 순서를 뒤집습니다. 오늘 만드는 건 거의 텅 빈 페이지지만, 주소는 진짜입니다.',{highlight:'마지막 날 배포하다 끝납니다.'}),
 page(1,3,'이 순서로 갑니다','각 단계마다 성공 화면을 확인하고 다음으로 넘어갑니다.',{steps:['템플릿 복제 — GitHub에 내 코드 창고 만들기','Vercel 연결 — 인터넷 주소 받기','Supabase 만들고 열쇠 넣기 — 화면이 살아납니다','Codex 연결하고 첫 변경 — 내 서비스 이름 넣기','갤러리에 등록 — 4주 동안 자라는 걸 봅니다.']}),
 page(1,4,'내 코드 창고 만들기','GitHub에서 내 코드를 보관할 저장소를 만듭니다.',{steps:['github.com/mintorain/vibe-template 열기','Use this template 선택하기','저장소 이름과 공개 여부 확인하기'],success:'내 GitHub 저장소 주소가 생기면 성공입니다.',errors:[['저장소가 보이지 않는다','GitHub 계정으로 로그인했는지 확인하세요.']]}),
 page(1,5,'인터넷 주소 받기','Vercel에서 저장소를 가져와 배포합니다.',{steps:['Vercel에서 Add New → Project','GitHub 저장소 Import','Deploy 버튼 누르기'],success:'화면이 하얗게 나와도 주소가 생기면 정상입니다.',errors:[['배포가 실패한다','Build Logs의 마지막 오류를 복사해 Codex에 보여주세요.']]}),
 page(1,6,'열쇠 만들기','Supabase에서 앱이 사용할 URL과 anon key를 준비합니다.',{steps:['Supabase 프로젝트 만들기','Project Settings → API 열기','Project URL과 anon key 복사'],success:'두 개의 값을 안전하게 복사했으면 다음으로 갑니다.'}),
 page(1,7,'열쇠 넣고 다시 배포','Vercel 환경변수에 Supabase 값을 넣습니다.',{code:'NEXT_PUBLIC_SUPABASE_URL=여기에_URL\nNEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_키',success:'환경변수를 저장하고 Redeploy하면 화면이 살아납니다.',errors:[['화면이 하얗다','변수 이름과 값 앞뒤 공백을 확인하세요.']]}),
 page(1,8,'Codex에 내 저장소 연결','Codex가 내 저장소를 읽고 수정하도록 연결합니다.',{steps:['Codex에서 GitHub 저장소 열기','AGENTS.md와 docs/spec.md 읽히기','첫 요청은 계획부터 받기'],success:'Codex가 저장소 구조를 설명하면 연결 완료입니다.'}),
 page(1,9,'잘 숨겨야 하는 네 가지','환경변수와 비밀값은 화면과 저장소에 노출하지 않습니다.',{cards:[['URL','Supabase 프로젝트 주소'],['anon key','클라이언트용 공개 키'],['service role key','절대 브라우저에 넣지 않기'],['.env.local','GitHub에 올리지 않기']]}),
 page(1,10,'첫 화면 바꾸기','이제 내 서비스 이름을 첫 화면에 넣습니다.',{code:'npm run dev\n\n# 브라우저에서 http://localhost:3000 열기',success:'내 컴퓨터에서 첫 화면이 열리면 성공입니다.'}),
 page(1,11,'시키고 · 보고 · 올리기','Codex에게 작은 변경을 시키고 결과를 확인한 뒤 배포합니다.',{steps:['한 번에 한 가지를 요청합니다.','브라우저에서 직접 확인합니다.','괜찮으면 커밋하고 배포합니다.'],success:'변경 → 확인 → 배포의 루프가 굴러갑니다.'}),
 page(1,12,'갤러리에 내 주소 올리기','완성한 링크를 공유 목록에 등록합니다.',{steps:['제목과 설명 작성','Vercel 주소 붙여넣기','저장 후 목록에서 확인'],success:'갤러리에서 내 링크를 클릭해 사이트가 열립니다.'}),
 page(1,13,'막히면 여기부터','문제 상황을 작게 나누어 확인합니다.',{steps:['브라우저 주소를 확인합니다.','Vercel 배포 상태를 확인합니다.','터미널 마지막 오류를 복사합니다.','Codex에 화면과 오류를 함께 보여줍니다.']}),
 page(1,14,'오늘 할 것 정리','오늘의 결과물을 체크합니다.',{checks:['GitHub 저장소가 있다','Vercel 주소가 열린다','Supabase 열쇠 2개를 넣었다','Codex가 저장소를 읽었다']}),
 page(1,15,'지난주 못 끝냈다면 10분 안에 따라잡기','1회차 자료 단계 1~5와 같은 순서입니다. 이 네 개만 되면 오늘 진도를 따라올 수 있습니다.',{steps:['템플릿 복제','Vercel Deploy','Supabase 환경변수','Codex 저장소 연결']}),
 page(1,16,'왜 엉망이 나올까요?','요청이 크거나 기준 문서가 없을 때 결과가 흔들립니다.',{description:'작은 단위로 요청하고, 파일을 먼저 읽히고, 성공 기준을 문장으로 적습니다.',cards:[['작게','한 번에 한 기능'],['읽고','문서와 현재 코드'],['확인','브라우저에서 직접']]}),
 page(1,17,'할 일 정리하고, 엉망이면 나를 부르세요.','오늘은 주소가 생기는 경험까지 완성합니다.',{success:'내 사이트 주소를 가지고 집에 갑니다.'})
];

const lecture2Pages = [
 page(2,2,'데이터 3건 손으로 넣기','Supabase에 첫 데이터를 넣어 화면이 비어 있지 않게 합니다.',{steps:['table editor 열기','title·description·image_url 입력','저장하고 목록 확인']}),
 page(2,3,'목록 화면 만들기','Supabase의 items를 읽어 카드 목록으로 보여줍니다.',{code:'const { data, error } = await supabase\n  .from("items")\n  .select("*")',success:'데이터 3건이 카드로 보이면 성공입니다.'}),
 page(2,4,'목록 화면 확인하기','정상 화면과 오류 화면을 함께 확인합니다.',{steps:['1~3번 카드가 보이는지 확인','새로고침 후에도 유지되는지 확인','빈 목록일 때 문구 확인'],errors:[['목록이 비어 있다','테이블 이름과 select 결과를 확인하세요.']]}),
 page(2,5,'오늘 여기까지','완성 기준을 읽고 다음 실습으로 넘어갑니다.',{checks:['docs/spec.md와 AGENTS.md가 저장소에 있다','Supabase에 데이터 3건이 들어갔다','배포된 사이트 /list에서 3건이 보인다','첫 화면 버튼이 목록으로 연결된다']}),
 page(2,6,'휴대폰으로 내 사이트를 열고 깨진 곳을 사진 찍으세요.','모바일에서 직접 보면 데스크톱에서 놓친 문제가 보입니다.',{description:'사진과 함께 어떤 화면에서 무엇이 깨졌는지 적어 보내세요.'}),
 page(2,7,'10분 안에 따라잡기','1회차 자료 단계 1~5와 같은 순서로 핵심만 다시 확인합니다.',{steps:['템플릿 복제','Vercel Import → Deploy','Supabase 열쇠 2개','Codex 저장소 연결']}),
 page(2,8,'왜 엉망에게 나올까요?','기준 문서와 성공 조건이 없으면 매번 결과가 달라집니다.',{cards:[['현재 상태','무엇이 이미 되는가'],['원하는 결과','어떤 화면이어야 하는가'],['확인 방법','무엇을 보면 성공인가']]}),
 page(2,9,'코드 말고 기획서부터','먼저 파일과 데이터의 모양을 문서로 고정합니다.',{code:'docs/spec.md\n\n# 화면\n- /list 목록\n- /new 등록\n\n# 데이터\n- title\n- description\n- image_url'}),
 page(2,10,'내 기획서 만들기','Codex가 읽을 수 있도록 짧고 구체적으로 적습니다.',{steps:['화면 목록 적기','데이터 항목 적기','성공 기준 적기','하지 않을 일 적기'],success:'문서만 읽어도 다음 작업을 설명할 수 있으면 성공입니다.'}),
 page(2,11,'데이터 표는 이렇게 생깁니다','항목 이름과 타입을 먼저 합의합니다.',{steps:['title — 제목 — text','description — 설명 — text','region — 지역 — text','image_url — 이미지 주소 — text']}),
 page(2,12,'매번 반복해서 말할 필요 없어집니다.','AGENTS.md와 spec.md가 반복 설명을 대신합니다.',{description:'Codex에게 먼저 문서를 읽으라고 요청하면 같은 기준으로 계속 작업합니다.'}),
 page(2,13,'규칙 파일 채우기','프로젝트에서 지켜야 할 규칙을 한곳에 모읍니다.',{code:'# 작업 규칙\n- 한국어 화면\n- 모바일에서 가로 스크롤 금지\n- 변경 전 계획부터 제시'}),
 page(2,14,'데이터 표 만들기','오늘 만든 문서가 다음 작업의 출발점이 됩니다.',{success:'기획서 → 코드 → 확인의 순서가 생겼습니다.'})
];

const lecture4Pages = [
 page(4,2,'오류가 나면 심장이 뜁니다. 그래도 하는 일은 정해져 있습니다.','오늘 배우는 복구 루프가 이 과정에서 가장 오래 쓰이는 기술입니다.',{highlight:'오류가 나도 하는 일은 정해져 있습니다.'}),
 page(4,3,'막혔을 때 이 한 장','오류 메시지를 읽고 원인을 좁힙니다.',{code:'git status\nnpm run build\n# 브라우저 콘솔의 마지막 오류 확인'}),
 page(4,4,'이것만 지키면 대개 끝납니다','재현 → 기록 → 작은 수정 → 다시 확인의 순서입니다.',{steps:['어떤 버튼을 눌렀는지 기록','오류 문장을 그대로 복사','한 파일만 바꾸기','같은 행동으로 다시 확인'],warning:'오류 문장을 임의로 요약하지 말고 그대로 남겨두세요.'}),
 page(4,5,'오류 메시지는 여기 있습니다','브라우저, 터미널, Vercel 로그를 각각 확인합니다.',{steps:['브라우저 Console','터미널 마지막 20줄','Vercel Deployment Logs'],success:'오류가 발생한 위치를 찾으면 절반은 해결된 것입니다.'}),
 page(4,6,'대표 사진 올리기','이미지 주소가 맞는지 작은 데이터부터 확인합니다.',{code:'image_url: "https://.../photo.jpg"',success:'카드에 사진 한 장이 보이면 성공입니다.'}),
 page(4,7,'사진 업로드 확인하기','파일과 URL을 차례로 확인합니다.',{steps:['파일 이름에 공백이 없는지 확인','Storage 공개 여부 확인','브라우저에서 URL 직접 열기'],errors:[['사진이 깨진다','URL을 새 탭에서 열어 200 응답인지 확인하세요.']]}),
 page(4,8,'검색과 지역 필터','목록을 검색하고 지역별로 좁혀 봅니다.',{code:'items.filter(item =>\n  item.region === selectedRegion &&\n  item.title.includes(keyword)\n)',success:'검색어와 지역을 바꿀 때 카드가 줄어들면 성공입니다.'}),
 page(4,9,'마이페이지','내가 등록한 항목을 따로 확인합니다.',{code:'supabase.from("items")\n  .select("*")\n  .eq("user_id", user.id)'}),
 page(4,10,'진짜 막혔는지 확인하기','작은 단위로 화면을 나누어 확인합니다.',{steps:['로그인 상태 확인','데이터 응답 확인','화면 렌더링 확인','모바일 화면 확인'],warning:'한꺼번에 고치려 하지 말고 한 단계씩 멈춰 확인하세요.'}),
 page(4,11,'코드 검토 시키기','변경 전에 Codex에게 위험한 부분을 먼저 찾게 합니다.',{code:'변경한 파일을 읽고,\n오류가 생길 수 있는 부분과\n확인할 테스트를 먼저 알려줘.',success:'수정 전에 확인 목록을 받으면 복구가 쉬워집니다.'}),
 page(4,12,'다음 주는 계속 만들겠습니다.','오류를 피하는 것이 아니라 복구하는 방법을 익혔습니다.',{description:'오늘의 핵심은 오류가 나도 멈추지 않고 원인을 찾는 순서입니다.'})
];

const lecture5Pages = [
 page(5,2,'오늘은 새 기능을 만들지 않습니다.','만들고 싶은 게 떠올라도 참으세요. 오늘 할 일은 세 가지입니다. 다듬고, 안전한지 보고, 발표합니다.',{highlight:'오늘은 새 기능을 만들지 않습니다.'}),
 page(5,3,'이것만은','마지막 화면을 발표 가능한 상태로 정리합니다.',{cards:[['작동','핵심 흐름이 끝까지 된다'],['안전','비밀값이 노출되지 않는다'],['설명','다른 사람이 따라 할 수 있다']]}),
 page(5,4,'보안 점검','배포 전에 비밀값과 공개 파일을 확인합니다.',{code:'git grep -n "service_role\|password\|secret"\n\n# 발견되면 즉시 키를 폐기하고 교체합니다.',warning:'service_role key와 실제 비밀번호는 브라우저와 GitHub에 올리지 마세요.'}),
 page(5,5,'마감 품질 점검','마지막 커밋 전 핵심 흐름을 다시 실행합니다.',{code:'npm run build\ngit status\ngit add -A\ngit commit -m "마감 점검"',success:'빌드가 통과하고 변경 파일을 알고 있으면 제출 준비 완료입니다.'}),
 page(5,6,'휴대폰 화면 직접 확인하기','실제 휴대폰에서 글자와 버튼을 확인합니다.',{steps:['첫 화면 열기','목록과 상세 이동','등록·로그인 흐름 확인','가로 스크롤 없는지 확인'],errors:[['버튼이 잘린다','작은 화면에서 padding과 글자 줄바꿈을 조정하세요.']]}),
 page(5,7,'사용설명서 만들기','처음 보는 사람이 따라 할 수 있는 세 줄을 적습니다.',{code:'# 시작하기\nnpm install\nnpm run dev\n\n# 배포 주소\nhttps://내-사이트.vercel.app'}),
 page(5,8,'최종 제출','제목, 설명, 이미지, 링크를 함께 확인합니다.',{steps:['대표 화면 캡처','Vercel 링크 복사','짧은 설명 작성','등록 버튼 누르기'],success:'다른 사람이 링크를 열어 결과물을 볼 수 있으면 제출 완료입니다.'}),
 page(5,9,'3분, 이 순서로','발표는 만든 기능의 목록이 아니라 사용 흐름으로 보여줍니다.',{steps:['문제 한 문장','내 사이트 한 장면','핵심 흐름 세 단계','다음에 고칠 한 가지']}),
 page(5,10,'이 다섯 개만 완주합니다','오늘 배운 내용을 체크합니다.',{checks:['내 사이트 주소가 열린다','휴대폰에서 흐름이 된다','비밀값을 숨겼다','사용설명서가 있다','발표 링크를 보냈다']}),
 page(5,11,'계속 만들 때는 막히는 만큼 배웁니다.','오늘 만든 링크를 기준으로 다음 기능을 계획합니다.',{description:'완성한 결과물을 지키고, 작은 변경을 반복하면 됩니다.'})
];

export const lectures = {
  1: makeLecture(1, '배포부터 뚫는다', '오늘 집에 갈 때, 모두가 자기 사이트 주소를 가지고 갑니다.', lecture1Pages, '이신우 강의 3기 1강'),
  2: makeLecture(2, '말 대신 문서로 시킨다', 'Codex가 매번 다르게 만드는 문제를, 문서로 잡습니다.', lecture2Pages, '이신우 강의 3기 2강 교안'),
  3: slides,
  4: makeLecture(4, '버그를 스스로 잡는다', '빨간 글씨가 떠도 혼자 빠져나옵니다.', lecture4Pages, '이신우강의 3기 4강'),
  5: makeLecture(5, '남에게 보여줄 물건으로', '링크를 남에게 보내도 부끄럽지 않게 만듭니다.', lecture5Pages, '이신우 강의 3기 5강')
};
