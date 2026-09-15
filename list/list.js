import { DEFAULT_COURSES } from "./default-courses.js";

const elements = Object.fromEntries(["loading", "empty", "error", "retry", "list", "count", "grade", "empty-title", "empty-description"].map((key) => [key, document.querySelector(`[data-${key}]`)]));
const config = window.ELC_LIST_CONFIG ?? { apiUrl: "/api/items" };
let items = DEFAULT_COURSES;
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
    title: text(item.title, "수업명 확인 중"),
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
  const consultation = document.createElement("a");
  consultation.className = "class-consultation";
  consultation.href = "/#contact";
  consultation.textContent = "상담 신청";
  consultation.setAttribute("aria-label", `${item.title} 상담 신청`);
  article.append(cardHeader, title, meta, consultation);
  return article;
}
function renderItems() {
  const grade = elements.grade.value;
  const filtered = items.filter((item) => grade === "all" || item.grade_keys.includes(grade));
  elements.list.replaceChildren();
  elements.count.textContent = `${filtered.length}개의 수업`;
  showOnly(filtered.length ? "list" : "empty");
  elements["empty-title"].textContent = grade !== "all" ? "선택한 학년의 수업이 없어요" : "아직 등록된 수업이 없어요";
  elements["empty-description"].textContent = "다른 학년을 선택하거나 전화로 상담해 주세요.";
  const fragment = document.createDocumentFragment();
  filtered.forEach((item, index) => fragment.append(createCard(item, index)));
  elements.list.append(fragment);
}
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
    items = remoteItems.length ? remoteItems : DEFAULT_COURSES;
    renderItems();
  } catch {
    // Offline, missing configuration, timeouts, and invalid responses retain the approved courses.
    items = DEFAULT_COURSES;
    renderItems();
  } finally {
    clearTimeout(timeout);
    loading = false;
    elements.retry.disabled = false;
  }
}
elements.retry.addEventListener("click", loadItems);
elements.grade.addEventListener("change", renderItems);
// Filters and consultations are usable immediately, even while the API is pending.
renderItems();
loadItems();
