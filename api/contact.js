import { createHmac } from "node:crypto";

const WINDOW_SECONDS = 600;
const counters = new Map();
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const RATE_SCRIPT = `
local a = tonumber(redis.call('GET', KEYS[1]) or '0')
local b = tonumber(redis.call('GET', KEYS[2]) or '0')
if a >= 5 or b >= 30 then return 0 end
for i = 1, 2 do
  local n = redis.call('INCR', KEYS[i])
  if n == 1 then redis.call('EXPIRE', KEYS[i], ARGV[1]) end
end
return 1`;

async function allowRequest(identity, secret) {
  const key = createHmac("sha256", secret).update(identity).digest("hex");
  const url = process.env.CONTACT_RATE_LIMIT_URL;
  const token = process.env.CONTACT_RATE_LIMIT_TOKEN;
  if (url && token) {
    const response = await fetch(url, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", RATE_SCRIPT, "2", `elc:contact:${key}`, "elc:contact:global", String(WINDOW_SECONDS)]),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error("Rate limit service unavailable");
    const data = await response.json();
    if (data.error || ![0, 1].includes(data.result)) throw new Error("Invalid rate limit response");
    return data.result === 1;
  }
  // Memory fallback is restricted to local development, never production serverless instances.
  if (process.env.NODE_ENV !== "development") throw new Error("Durable rate limit not configured");
  const now = Date.now();
  for (const [id, entry] of counters) if (entry.until <= now) counters.delete(id);
  const keys = [key, "global"];
  if (keys.some((id, i) => (counters.get(id)?.count ?? 0) >= [5, 30][i])) return false;
  for (const id of keys) {
    const entry = counters.get(id) ?? { count: 0, until: now + WINDOW_SECONDS * 1000 };
    entry.count++; counters.set(id, entry);
  }
  return true;
}

export default async function contactHandler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "POST 요청만 사용할 수 있습니다." });
  }
  const body = request.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return response.status(400).json({ error: "문의 내용을 확인해 주세요." });
  if (typeof body.website === "string" && body.website) return response.status(200).json({ ok: true });
  if (body.privacy !== "on" && body.privacy !== true) return response.status(400).json({ error: "개인정보 수집·이용에 동의해 주세요." });
  if (![body.name, body.phone, body.email, body.message].every((v) => typeof v === "string")) return response.status(400).json({ error: "필수 항목을 모두 입력해 주세요." });
  const {name: rawName, phone: rawPhone, email: rawEmail, message: rawMessage} = body;
  const name = rawName.trim(), phone = rawPhone.trim(), email = rawEmail.trim(), message = rawMessage.trim();
  if (rawName.length > 50 || name.length < 2 || /[\r\n\x00-\x1f]/.test(name)) return response.status(400).json({ error: "이름은 2~50자로 입력해 주세요." });
  if (rawPhone.length > 30 || !/^[0-9+() -]+$/.test(phone) || !/^0\d{8,10}$/.test(phone.replace(/\D/g, ""))) return response.status(400).json({ error: "연락처를 국내 전화번호 형식으로 입력해 주세요." });
  if (rawEmail.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ error: "이메일 주소를 확인해 주세요." });
  if (!message || rawMessage.length > 2000) return response.status(400).json({ error: "상담 내용은 1~2,000자로 입력해 주세요." });
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return response.status(503).json({ error: "현재 온라인 상담을 접수할 수 없습니다. 전화로 문의해 주세요." });
  const toEmail = process.env.CONTACT_TO_EMAIL || "jennylee3769@gmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "ELC 홈페이지 <onboarding@resend.dev>";
  try {
    if (!await allowRequest(email.toLowerCase(), apiKey)) {
      response.setHeader("Retry-After", String(WINDOW_SECONDS));
      return response.status(429).json({ error: "문의가 여러 번 접수되었습니다. 10분 후 다시 시도하거나 전화로 문의해 주세요." });
    }
  } catch {
    return response.status(503).json({ error: "현재 온라인 상담을 접수할 수 없습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요." });
  }
  // Stable body and key let Resend deduplicate identical retries for 24 hours.
  const emailBody = {
    from: fromEmail, to: [toEmail], reply_to: email,
    subject: `[ELC 영어 학습 상담] ${name}`,
    html: `<h2>ELC 영어 학습 상담</h2><p><strong>이름:</strong> ${escapeHtml(name)}</p><p><strong>연락처:</strong> ${escapeHtml(phone)}</p><p><strong>이메일:</strong> ${escapeHtml(email)}</p><p>개인정보 수집·이용 동의: 확인</p><hr><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  };
  const serialized = JSON.stringify(emailBody);
  const idempotencyKey = createHmac("sha256", apiKey).update(serialized).digest("hex");
  try {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `elc-${idempotencyKey}` },
      body: serialized, signal: AbortSignal.timeout(10000),
    });
    if (!sent.ok) return response.status(502).json({ error: "접수 결과를 확인하지 못했습니다. 같은 내용으로 다시 시도하거나 전화로 확인해 주세요." });
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(504).json({ error: "접수 결과 확인이 지연되고 있습니다. 같은 내용으로 다시 시도하거나 전화로 확인해 주세요." });
  }
}
