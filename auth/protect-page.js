import { getSupabaseClient, safeNextPath } from "./client.js";
import { mountAuthNavigation } from "./session-ui.js";

const protectedContent = document.querySelector("[data-protected-content]");
const protectedStatus = document.querySelector("[data-protected-status]");

async function protectPage() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) {
      const destination = safeNextPath(`${window.location.pathname}${window.location.search}`, "/new/");
      window.location.replace(`/login/?next=${encodeURIComponent(destination)}`);
      return;
    }
    protectedStatus.hidden = true;
    protectedContent.hidden = false;
    const email = protectedContent.querySelector("[data-user-email]");
    if (email) email.textContent = data.session.user.email || "로그인 사용자";
    await mountAuthNavigation();
  } catch {
    protectedStatus.textContent = "로그인 서비스를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

protectPage();
