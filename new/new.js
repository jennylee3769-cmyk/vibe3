import { getSupabaseClient, safeNextPath } from "../auth/client.js";
import { mountAuthNavigation } from "../auth/session-ui.js";

const protectedContent = document.querySelector("[data-protected-content]");
const protectedStatus = document.querySelector("[data-protected-status]");
const form = document.querySelector("#item-form");
const formStatus = document.querySelector("[data-form-status]");
const submitButton = document.querySelector("[data-submit]");
const imageInput = form.elements.representative_image;
const imageSelection = document.querySelector("[data-image-selection]");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const editId = new URLSearchParams(window.location.search).get("edit");
let supabase;
let currentUser;
let accessToken = "";

function showError(message, field) { formStatus.className = "form-feedback"; formStatus.textContent = message; field?.focus(); }
function validateImage(file) {
  if (!file) return;
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw { message: "대표 이미지는 JPG, PNG, WebP 또는 GIF 파일만 선택해 주세요.", field: imageInput };
  if (file.size > MAX_IMAGE_BYTES) throw { message: "대표 이미지는 5MB 이하로 선택해 주세요.", field: imageInput };
}
function imageExtension(file) {
  return { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp", "image/gif":"gif" }[file.type];
}
async function uploadRepresentativeImage(file) {
  if (!file) return { image_path:null, image_url:null };
  validateImage(file);
  const imagePath = `${currentUser.id}/${crypto.randomUUID()}.${imageExtension(file)}`;
  const { error } = await supabase.storage.from("item-images").upload(imagePath, file, { cacheControl:"3600", contentType:file.type, upsert:false });
  if (error) throw { ...error, isImageUpload:true };
  const { data } = supabase.storage.from("item-images").getPublicUrl(imagePath);
  return { image_path:imagePath, image_url:data.publicUrl };
}
function requiredValue(formData, name, label) { const value = String(formData.get(name) || "").trim(); if (!value) throw { message: `${label}을(를) 입력해 주세요.`, field: form.elements[name] }; return value; }
function buildPayload() {
  const formData = new FormData(form);
  const targetGrades = formData.getAll("target_grades").map(Number).filter((grade) => [1, 2, 3].includes(grade));
  if (!targetGrades.length) throw { message: "대상 학년을 한 개 이상 선택해 주세요.", field: form.querySelector('[name="target_grades"]') };
  const location = requiredValue(formData, "location", "수업 장소");
  const capacityValue = String(formData.get("capacity") || "").trim();
  if (capacityValue && (!Number.isInteger(Number(capacityValue)) || Number(capacityValue) < 0)) throw { message: "정원은 0 이상의 정수로 입력해 주세요.", field: form.elements.capacity };
  return { author_id: currentUser.id, title: requiredValue(formData,"title","수업명"), target_grades:targetGrades, description:requiredValue(formData,"description","수업 소개"), category:requiredValue(formData,"category","학습 영역"), schedule_text:requiredValue(formData,"schedule_text","수업 일정"), region:location, location, start_date:formData.get("start_date")||null, material:String(formData.get("material")||"").trim()||null, capacity:capacityValue?Number(capacityValue):null, status:requiredValue(formData,"status","모집 상태") };
}
function friendlySaveError(error) { if (error?.isImageUpload) return `대표 이미지를 업로드하지 못했습니다. ${error.message || "잠시 후 다시 시도해 주세요."}`; if (error?.code === "42501") return "이 계정에는 수업을 등록할 권한이 없습니다. 다시 로그인한 뒤 시도해 주세요."; if (["23514","23502"].includes(error?.code)) return "입력값의 형식이 올바르지 않습니다. 필수 항목과 숫자 값을 확인해 주세요."; if (typeof error?.message === "string" && error.message.toLowerCase().includes("fetch")) return "서버에 연결하지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요."; return `수업을 저장하지 못했습니다. ${error?.message || "잠시 후 다시 시도해 주세요."}`; }
async function myItemsApi(path, options = {}) {
  const response = await fetch(`/api/my-items${path}`, { ...options, headers:{ Accept:"application/json", Authorization:`Bearer ${accessToken}`, ...(options.headers || {}) } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "수업 정보를 처리하지 못했습니다.");
  return result;
}
function fillEditForm(item) {
  form.elements.title.value = item.title || "";
  form.querySelectorAll('[name="target_grades"]').forEach((input) => { input.checked = Array.isArray(item.target_grades) && item.target_grades.includes(Number(input.value)); });
  ["description","category","schedule_text","location","start_date","material","capacity","status"].forEach((name) => { form.elements[name].value = item[name] ?? ""; });
  if (item.image_path) imageSelection.textContent = "기존 대표 이미지가 있습니다. 새 사진을 선택하면 교체됩니다.";
  document.querySelector("[data-mode-label]").textContent = "수업 수정하기";
  document.querySelector("[data-page-title]").innerHTML = "내 수업 정보를<br /><em>바르게 고쳐주세요.</em>";
  document.querySelector("[data-form-title]").textContent = "수업 수정";
  document.querySelector("[data-cancel-link]").href = "/mypage/";
  document.querySelector("[data-cancel-link]").textContent = "취소하고 마이페이지로";
  submitButton.textContent = "수정 내용 저장하기";
  document.title = "수업 수정 | ELC영어공부방";
}
async function initialize() {
  try {
    supabase = await getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user;
    if (!currentUser) { const destination = safeNextPath(`${window.location.pathname}${window.location.search}`, "/new/"); window.location.replace(`/login/?next=${encodeURIComponent(destination)}`); return; }
    accessToken = data.session.access_token;
    if (editId) { if (!/^[0-9a-f-]{36}$/i.test(editId)) throw new Error("수정할 수업 주소가 올바르지 않습니다."); const item = await myItemsApi(`?id=${encodeURIComponent(editId)}`); if (!item) throw new Error("본인이 등록한 수업을 찾지 못했습니다."); fillEditForm(item); }
    protectedStatus.hidden = true; protectedContent.hidden = false; protectedContent.querySelector("[data-user-email]").textContent = currentUser.email || "로그인 사용자"; await mountAuthNavigation();
  } catch (error) { protectedStatus.textContent = error.message || "로그인 서비스를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요."; }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault(); formStatus.textContent = "";
  let payload; try { payload = buildPayload(); } catch (error) { showError(error.message, error.field); return; }
  const imageFile = imageInput.files[0];
  try { validateImage(imageFile); } catch (error) { showError(error.message, error.field); return; }
  submitButton.disabled = true; submitButton.textContent = imageFile ? "사진 업로드 중…" : "저장 중…";
  try {
    const imageData = await uploadRepresentativeImage(imageFile); submitButton.textContent = "저장 중…";
    if (editId) {
      const updatePayload = { ...payload }; delete updatePayload.author_id; if (imageFile) updatePayload.image_path = imageData.image_path;
      await myItemsApi(`?id=${encodeURIComponent(editId)}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(updatePayload) });
      formStatus.className = "form-feedback is-success"; formStatus.textContent = "수업을 수정했습니다. 마이페이지로 이동합니다."; window.location.assign("/mypage/");
    } else {
      const { error } = await supabase.from("items").insert({ ...payload, ...imageData }); if (error) throw error;
      formStatus.className = "form-feedback is-success"; formStatus.textContent = "수업을 저장했습니다. 목록으로 이동합니다."; window.location.assign("/list/");
    }
  }
  catch (error) { showError(friendlySaveError(error)); submitButton.disabled = false; submitButton.textContent = editId ? "수정 내용 저장하기" : "수업 저장하기"; }
});
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  try { validateImage(file); imageSelection.textContent = file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)}MB` : "선택된 사진이 없습니다."; }
  catch (error) { imageInput.value = ""; imageSelection.textContent = "선택된 사진이 없습니다."; showError(error.message, error.field); }
});
initialize();
