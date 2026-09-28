import { mountAuthNavigation } from "../auth/session-ui.js";

const elements = Object.fromEntries(["loading", "empty", "error", "error-message", "retry", "list", "count", "grade", "query", "region", "clear", "empty-title", "empty-description"].map((key) => [key, document.querySelector(`[data-${key}]`)]));
const config = window.ELC_LIST_CONFIG ?? { apiUrl: "/api/items" };
const ALLOWED_REGIONS = new Set([...elements.region.options].map((option) => option.value));
const ALLOWED_GRADES = new Set([...elements.grade.options].map((option) => option.value));
let items = [];
let loading = false;

function showOnly(name) {
  ["loading", "empty", "error"].forEach((key) => { elements[key].hidden = key !== name; });
}
function text(value, fallback) { return typeof value === "string" && value.trim() ? value : fallback; }
function normalizeRemoteItem(item) {
  if (!item || typeof item !== "object" || !["open", "closed"].includes(item.status)) return null;
  // Existing Supabase target_grades 1/2/3 continue to mean middle-school grades.
  const grades = Array.isArray(item.target_grades) ? [...new Set(item.target_grades.filter((n) => [1, 2, 3].includes(n)))].sort() : [];
  return {
    id: typeof item.id === "string" ? item.id : "",
    title: text(item.title, "수업명 확인 중"),
    region: text(item.region, "인천 부평구 부개동"),
    grade_keys: grades.map((grade) => `m${grade}`),
    target_label: grades.length ? grades.map((grade) => `중학교 ${grade}학년`).join(" · ") : "확정 후 안내",
    schedule_text: text(item.schedule_text, "확정 후 안내"),
    description: text(item.description, "자세한 수업 내용은 상담 시 안내해 드립니다."),
    status: item.status,
    status_label: item.status === "open" ? "모집 중" : "모집 마감",
  };
}
function createCard(item, index) {
  const article = document.createElement("article"); article.className = "class-card";
  const cardHeader = document.createElement("div"); cardHeader.className = "card-header";
  const number = document.createElement("span"); number.className = "card-number"; number.textContent = String(index + 1).padStart(2, "0");
  const status = document.createElement("span"); status.className = `class-status ${item.status}`; status.textContent = item.status_label;
  cardHeader.append(number, status);
  const title = document.createElement("h3"); title.textContent = item.title;
  const meta = document.createElement("dl");
  [["대상", item.target_label], ["수업", item.schedule_text], ["내용", item.description]].forEach(([label, value]) => {
    const dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = label; dd.textContent = value; meta.append(dt, dd);
  });
  const actions = document.createElement("div"); actions.className = "card-links";
  if (item.id) { const detail = document.createElement("a"); detail.className = "class-detail"; detail.href = `/detail/?id=${encodeURIComponent(item.id)}`; detail.textContent = "자세히 보기"; detail.setAttribute("aria-label", `${item.title} 상세 보기`); actions.append(detail); }
  const consultation = document.createElement("a");
  consultation.className = "class-consultation";
  consultation.href = "/#contact";
  consultation.textContent = "상담 신청";
  consultation.setAttribute("aria-label", `${item.title} 상담 신청`);
  actions.append(consultation); article.append(cardHeader, title, meta, actions);
  return article;
}
function renderItems() {
  const grade = elements.grade.value;
  const region = elements.region.value;
  const query = elements.query.value.trim().toLocaleLowerCase("ko-KR");
  const filtered = items.filter((item) => (grade === "all" || item.grade_keys.includes(grade)) && (region === "all" || item.region === region) && (!query || item.title.toLocaleLowerCase("ko-KR").includes(query)));
  elements.list.replaceChildren();
  elements.count.textContent = `${filtered.length}개의 수업`;
  showOnly(filtered.length ? "list" : "empty");
  const hasFilters = grade !== "all" || region !== "all" || Boolean(query);
  elements["empty-title"].textContent = hasFilters ? "검색 결과가 없어요" : "아직 등록된 수업이 없어요";
  elements["empty-description"].textContent = hasFilters ? "검색어나 지역, 학년 조건을 바꾸거나 조건을 지워 보세요." : "새로운 수업이 등록되면 이곳에서 바로 확인할 수 있습니다.";
  const fragment = document.createDocumentFragment();
  filtered.forEach((item, index) => fragment.append(createCard(item, index)));
  elements.list.append(fragment);
}
function writeFiltersToUrl() {
  const params = new URLSearchParams();
  const query = elements.query.value.trim();
  if (query) params.set("q", query);
  if (elements.region.value !== "all") params.set("region", elements.region.value);
  if (elements.grade.value !== "all") params.set("grade", elements.grade.value);
  const nextUrl = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}
function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  elements.query.value = (params.get("q") || "").slice(0, 100);
  const region = params.get("region") || "all";
  const grade = params.get("grade") || "all";
  elements.region.value = ALLOWED_REGIONS.has(region) ? region : "all";
  elements.grade.value = ALLOWED_GRADES.has(grade) ? grade : "all";
}
function applyFilters() { writeFiltersToUrl(); renderItems(); }
async function loadItems() {
  if (loading) return;
  loading = true;
  elements.retry.disabled = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(config.apiUrl, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) throw new Error("Course API unavailable");
    const result = await response.json();
    if (!Array.isArray(result)) throw new Error("Invalid course response");
    const remoteItems = result.map(normalizeRemoteItem).filter(Boolean);
    items = remoteItems;
    renderItems();
  } catch (error) {
    items = [];
    elements.list.replaceChildren();
    elements.count.textContent = "0개의 수업";
    elements["error-message"].textContent = error?.name === "AbortError"
      ? "수업 정보를 불러오는 데 시간이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요."
      : "수업 정보를 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.";
    showOnly("error");
  } finally {
    clearTimeout(timeout);
    loading = false;
    elements.retry.disabled = false;
  }
}
elements.retry.addEventListener("click", loadItems);
elements.query.addEventListener("input", applyFilters);
elements.region.addEventListener("change", applyFilters);
elements.grade.addEventListener("change", applyFilters);
elements.clear.addEventListener("click", () => { elements.query.value = ""; elements.region.value = "all"; elements.grade.value = "all"; applyFilters(); elements.query.focus(); });
window.addEventListener("popstate", () => { readFiltersFromUrl(); renderItems(); });
readFiltersFromUrl();
loadItems();
mountAuthNavigation();
