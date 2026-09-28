export default function supabaseConfigHandler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "GET 요청만 사용할 수 있습니다." });
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return response.status(503).json({ error: "Supabase 인증 설정이 아직 완료되지 않았습니다." });
  }

  response.setHeader("Cache-Control", "private, no-store");
  return response.status(200).json({ url, anonKey });
}
