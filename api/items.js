export default async function itemsHandler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "GET 요청만 사용할 수 있습니다." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(503).json({ error: "수업 정보를 준비하고 있습니다. 전화 상담으로 안내받으실 수 있습니다." });
  }

  try {
    const endpoint = new URL("/rest/v1/items", supabaseUrl);
    endpoint.searchParams.set("select", "id,title,region,created_at,target_grades,schedule_text,status");
    endpoint.searchParams.set("order", "created_at.desc");
    endpoint.searchParams.set("status", "in.(open,closed)");

    const supabaseResponse = await fetch(endpoint, {
      signal: AbortSignal.timeout(8000),
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!supabaseResponse.ok) {
      console.error("Supabase items request failed", supabaseResponse.status);
      return response.status(502).json({ error: "수업 데이터를 불러오지 못했습니다." });
    }

    const items = await supabaseResponse.json();
    if (!Array.isArray(items)) throw new Error("Invalid items response");
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return response.status(200).json(items.filter((item) => item && ["open", "closed"].includes(item.status)).map(({ id, title, region, created_at, target_grades, schedule_text, status }) => ({ id, title, region, created_at, target_grades, schedule_text, status })));
  } catch (error) {
    console.error("Supabase items connection failed");
    return response.status(502).json({ error: "수업 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." });
  }
};
