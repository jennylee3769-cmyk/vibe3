import { getSupabaseClient, safeNextPath } from "./client.js";
import { mountAuthNavigation } from "./session-ui.js";

const form = document.querySelector("[data-auth-form]");
const status = document.querySelector("[data-auth-status]");
const submitButton = form?.querySelector('button[type="submit"]');
const nextPath = safeNextPath(new URLSearchParams(window.location.search).get("next"));

function showStatus(message, type = "") {
  status.textContent = message;
  status.className = `auth-status${type ? ` is-${type}` : ""}`;
}

function friendlyError(error) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("confirmation mismatch")) return "비밀번호 확인이 일치하지 않습니다.";
  if (message.includes("invalid login credentials")) return "이메일 또는 비밀번호가 맞지 않습니다.";
  if (message.includes("already registered")) return "이미 가입된 이메일입니다. 로그인해 주세요.";
  if (message.includes("password")) return "비밀번호는 8자 이상으로 입력해 주세요.";
  if (message.includes("email")) return "이메일 주소를 확인해 주세요.";
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

async function initialize() {
  const mounted = await mountAuthNavigation();
  if (!mounted) {
    showStatus("로그인 서비스 설정을 확인해 주세요.", "error");
    if (submitButton) submitButton.disabled = true;
    return;
  }
  if (mounted.session?.user) window.location.replace(nextPath);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  submitButton.disabled = true;
  showStatus(form.dataset.authForm === "signup" ? "회원가입을 처리하고 있습니다…" : "로그인하고 있습니다…");

  try {
    const supabase = await getSupabaseClient();
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (form.dataset.authForm === "signup") {
      const confirmation = String(formData.get("passwordConfirmation") || "");
      if (password !== confirmation) throw new Error("password confirmation mismatch");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login/?confirmed=1` },
      });
      if (error) throw error;
      if (data.session) return window.location.assign(nextPath);
      form.reset();
      showStatus("가입 확인 메일을 보냈습니다. 이메일의 확인 링크를 누른 뒤 로그인해 주세요.", "success");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.assign(nextPath);
    }
  } catch (error) {
    showStatus(friendlyError(error), "error");
  } finally {
    submitButton.disabled = false;
  }
});

if (new URLSearchParams(window.location.search).get("confirmed") === "1") {
  showStatus("이메일 확인이 완료됐다면 로그인해 주세요.", "success");
}
initialize();
