module.exports = async function itemsHandler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "GET 요청만 사용할 수 있습니다." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(503).json({ error: "Supabase 연결 설정이 아직 완료되지 않았습니다." });
  }

  try {
    const endpoint = new URL("/rest/v1/items", supabaseUrl);
    endpoint.searchParams.set("select", "title,region,created_at");
    endpoint.searchParams.set("order", "created_at.desc");

    const supabaseResponse = await fetch(endpoint, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!supabaseResponse.ok) {
      const detail = await supabaseResponse.text();
      console.error("Supabase items request failed", supabaseResponse.status, detail);
      return response.status(502).json({ error: "수업 데이터를 불러오지 못했습니다." });
    }

    const items = await supabaseResponse.json();
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return response.status(200).json(items);
  } catch (error) {
    console.error("Supabase items connection failed", error);
    return response.status(502).json({ error: "데이터베이스 연결에 실패했습니다." });
  }
};
