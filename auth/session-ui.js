import { getSupabaseClient } from "./client.js";

function renderSignedOut(container) {
  const login = document.createElement("a");
  login.href = "/login/";
  login.textContent = "로그인";
  const signup = document.createElement("a");
  signup.href = "/signup/";
  signup.textContent = "회원가입";
  container.replaceChildren(login, signup);
}

function renderSignedIn(container, supabase, email) {
  const mypage = document.createElement("a");
  mypage.href = "/mypage/";
  mypage.textContent = "마이페이지";
  const identity = document.createElement("span");
  identity.className = "auth-email";
  identity.textContent = email || "로그인 사용자";
  identity.title = email || "로그인 사용자";
  const logout = document.createElement("button");
  logout.type = "button";
  logout.textContent = "로그아웃";
  logout.addEventListener("click", async () => {
    logout.disabled = true;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      logout.disabled = false;
      logout.textContent = "다시 시도";
      return;
    }
    window.location.assign("/");
  });
  container.replaceChildren(mypage, identity, logout);
}

export async function mountAuthNavigation() {
  const containers = [...document.querySelectorAll("[data-auth-nav]")];
  if (!containers.length) return null;

  try {
    const supabase = await getSupabaseClient();
    const render = (session) => containers.forEach((container) => {
      if (session?.user) renderSignedIn(container, supabase, session.user.email);
      else renderSignedOut(container);
    });
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    render(data.session);
    supabase.auth.onAuthStateChange((_event, session) => render(session));
    return { supabase, session: data.session };
  } catch {
    containers.forEach(renderSignedOut);
    return null;
  }
}
