import { getSupabaseClient, safeNextPath } from "../auth/client.js";
import { mountAuthNavigation } from "../auth/session-ui.js";

const list = document.querySelector("[data-list]");
const statusPanel = document.querySelector("[data-status]");
const email = document.querySelector("[data-user-email]");
let accessToken = "";

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "날짜 확인 중" : new Intl.DateTimeFormat("ko-KR", { year:"numeric", month:"long", day:"numeric" }).format(date);
}
function statusLabel(value) { return { draft:"작성 중", open:"모집 중", closed:"마감" }[value] || "상태 확인 중"; }
async function api(path = "", options = {}) {
  const response = await fetch(`/api/my-items${path}`, { ...options, headers:{ Accept:"application/json", Authorization:`Bearer ${accessToken}`, ...(options.headers || {}) } });
  const result = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error || "요청을 처리하지 못했습니다.");
  return result;
}
function render(items) {
  list.replaceChildren();
  if (!items.length) { statusPanel.hidden = false; statusPanel.textContent = "아직 직접 등록한 수업이 없어요. ‘새 수업 올리기’로 첫 수업을 등록해 보세요."; return; }
  statusPanel.hidden = true;
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const article = document.createElement("article"); article.className = "my-card";
    const content = document.createElement("div");
    const title = document.createElement("h3"); title.textContent = item.title;
    const meta = document.createElement("p"); meta.className = "meta";
    [statusLabel(item.status), item.location || "장소 확인 중", `등록 ${formatDate(item.created_at)}`].forEach((value) => { const span = document.createElement("span"); span.textContent = value; meta.append(span); });
    content.append(title, meta);
    const actions = document.createElement("div"); actions.className = "card-actions";
    const edit = document.createElement("a"); edit.href = `/new/?edit=${encodeURIComponent(item.id)}`; edit.textContent = "수정"; edit.setAttribute("aria-label", `${item.title} 수정`);
    const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "삭제"; remove.setAttribute("aria-label", `${item.title} 삭제`);
    remove.addEventListener("click", async () => {
      if (!window.confirm("정말 삭제할까요?")) return;
      remove.disabled = true; remove.textContent = "삭제 중…";
      try { await api(`?id=${encodeURIComponent(item.id)}`, { method:"DELETE" }); article.remove(); if (!list.children.length) render([]); }
      catch (error) { statusPanel.hidden = false; statusPanel.textContent = error.message; remove.disabled = false; remove.textContent = "삭제"; }
    });
    actions.append(edit, remove); article.append(content, actions); fragment.append(article);
  });
  list.append(fragment);
}
async function initialize() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) { const next = safeNextPath(`${location.pathname}${location.search}`, "/mypage/"); location.replace(`/login/?next=${encodeURIComponent(next)}`); return; }
    accessToken = data.session.access_token; email.textContent = data.session.user.email || "로그인 사용자"; await mountAuthNavigation(); render(await api());
  } catch (error) { statusPanel.hidden = false; statusPanel.textContent = error.message || "내 수업을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."; }
}
initialize();
