const MAX_BODY_LENGTH = 2000;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

module.exports = async function contactHandler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "POST 요청만 사용할 수 있습니다." });
  }

  const { name, phone, email, message, website } = request.body || {};
  if (website) return response.status(200).json({ ok: true });
  if (![name, phone, email, message].every((value) => typeof value === "string" && value.trim())) {
    return response.status(400).json({ error: "필수 항목을 모두 입력해 주세요." });
  }
  if (message.length > MAX_BODY_LENGTH || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ error: "이메일 주소와 문의 내용 길이를 확인해 주세요." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "jennylee3769@gmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "ELC 홈페이지 <onboarding@resend.dev>";
  if (!apiKey) return response.status(503).json({ error: "메일 전송 설정이 아직 완료되지 않았습니다." });

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email.trim(),
        subject: `[ELC 강의 문의] ${name.trim()}`,
        html: `<h2>ELC 홈페이지 강의 문의</h2><p><strong>이름:</strong> ${escapeHtml(name.trim())}</p><p><strong>연락처:</strong> ${escapeHtml(phone.trim())}</p><p><strong>이메일:</strong> ${escapeHtml(email.trim())}</p><hr><p style="white-space:pre-wrap">${escapeHtml(message.trim())}</p>`,
      }),
    });
    if (!resendResponse.ok) {
      console.error("Resend request failed", resendResponse.status, await resendResponse.text());
      return response.status(502).json({ error: "메일 전송 서비스에 연결하지 못했습니다." });
    }
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return response.status(502).json({ error: "문의 내용을 보내지 못했습니다." });
  }
};
