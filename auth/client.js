import { createClient } from "@supabase/supabase-js";

let clientPromise;

export function getSupabaseClient() {
  if (!clientPromise) {
    clientPromise = fetch("/api/supabase-config", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.url || !result.anonKey) {
          throw new Error(result.error || "로그인 서비스에 연결하지 못했습니다.");
        }
        return createClient(result.url, result.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        });
      });
  }
  return clientPromise;
}

export function safeNextPath(value, fallback = "/") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
