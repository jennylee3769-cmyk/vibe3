const ITEM_FIELDS = ["title", "target_grades", "description", "category", "schedule_text", "region", "location", "start_date", "material", "capacity", "status", "image_path"];
const ITEM_SELECT = "id,author_id,title,target_grades,description,category,schedule_text,region,location,start_date,material,capacity,status,image_path,image_url,created_at,updated_at";

function send(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(body);
}

function bearerToken(request) {
  const value = request.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

async function authenticatedUser(supabaseUrl, anonKey, token) {
  const authResponse = await fetch(new URL("/auth/v1/user", supabaseUrl), {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!authResponse.ok) return null;
  const user = await authResponse.json();
  return user?.id ? user : null;
}

function itemEndpoint(supabaseUrl, userId, itemId) {
  const endpoint = new URL("/rest/v1/items", supabaseUrl);
  endpoint.searchParams.set("select", ITEM_SELECT);
  endpoint.searchParams.set("author_id", `eq.${userId}`);
  if (itemId) endpoint.searchParams.set("id", `eq.${itemId}`);
  endpoint.searchParams.set("order", "created_at.desc");
  return endpoint;
}

function validatePatch(input, userId, supabaseUrl) {
  const result = {};
  ITEM_FIELDS.forEach((field) => { if (Object.hasOwn(input, field)) result[field] = input[field]; });
  if (Object.hasOwn(result, "title") && (typeof result.title !== "string" || !result.title.trim() || result.title.trim().length > 100)) throw new Error("수업명은 1~100자로 입력해 주세요.");
  if (Object.hasOwn(result, "target_grades") && (!Array.isArray(result.target_grades) || !result.target_grades.length || result.target_grades.some((grade) => ![1,2,3].includes(grade)))) throw new Error("대상 학년을 올바르게 선택해 주세요.");
  if (Object.hasOwn(result, "description") && (typeof result.description !== "string" || !result.description.trim())) throw new Error("수업 소개를 입력해 주세요.");
  if (Object.hasOwn(result, "category") && !["grammar","reading","vocabulary","exam"].includes(result.category)) throw new Error("학습 영역을 올바르게 선택해 주세요.");
  if (Object.hasOwn(result, "schedule_text") && (typeof result.schedule_text !== "string" || !result.schedule_text.trim() || result.schedule_text.length > 200)) throw new Error("수업 일정을 200자 이내로 입력해 주세요.");
  if (Object.hasOwn(result, "location") && (typeof result.location !== "string" || !result.location.trim() || result.location.length > 200)) throw new Error("수업 장소를 200자 이내로 입력해 주세요.");
  if (Object.hasOwn(result, "status") && !["draft","open","closed"].includes(result.status)) throw new Error("모집 상태를 올바르게 선택해 주세요.");
  if (Object.hasOwn(result, "capacity") && result.capacity !== null && (!Number.isInteger(result.capacity) || result.capacity < 0)) throw new Error("정원은 0 이상의 정수로 입력해 주세요.");
  if (Object.hasOwn(result, "image_path")) {
    if (result.image_path !== null && (typeof result.image_path !== "string" || !result.image_path.startsWith(`${userId}/`))) throw new Error("대표 이미지 경로가 올바르지 않습니다.");
    result.image_url = result.image_path ? `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/item-images/${encodeURI(result.image_path)}` : null;
  }
  if (Object.hasOwn(result, "location")) result.region = result.location.trim();
  return result;
}

export default async function myItemsHandler(request, response) {
  if (!["GET", "PATCH", "DELETE"].includes(request.method)) {
    response.setHeader("Allow", "GET, PATCH, DELETE");
    return send(response, 405, { error: "지원하지 않는 요청입니다." });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return send(response, 503, { error: "수업 관리 서비스를 준비하고 있습니다." });
  const token = bearerToken(request);
  if (!token) return send(response, 401, { error: "로그인이 필요합니다." });

  try {
    const user = await authenticatedUser(supabaseUrl, anonKey, token);
    if (!user) return send(response, 401, { error: "로그인이 만료되었습니다. 다시 로그인해 주세요." });
    const headers = { apikey: anonKey, Authorization: `Bearer ${token}` };
    const itemId = typeof request.query?.id === "string" ? request.query.id : "";
    if (request.method !== "GET" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(itemId)) return send(response, 400, { error: "수업 식별자가 올바르지 않습니다." });

    if (request.method === "GET") {
      const result = await fetch(itemEndpoint(supabaseUrl, user.id, itemId), { headers, signal: AbortSignal.timeout(8000) });
      if (!result.ok) return send(response, 502, { error: "내 수업을 불러오지 못했습니다." });
      const items = await result.json();
      return send(response, 200, itemId ? (items[0] || null) : items);
    }

    const ownershipCheck = await fetch(itemEndpoint(supabaseUrl, user.id, itemId), { headers, signal: AbortSignal.timeout(8000) });
    const ownedItems = ownershipCheck.ok ? await ownershipCheck.json() : [];
    if (!ownedItems.length || ownedItems[0].author_id !== user.id) return send(response, 403, { error: "본인이 등록한 수업만 수정하거나 삭제할 수 있습니다." });

    if (request.method === "DELETE") {
      const result = await fetch(itemEndpoint(supabaseUrl, user.id, itemId), { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" }, signal: AbortSignal.timeout(8000) });
      if (!result.ok) return send(response, result.status === 401 || result.status === 403 ? 403 : 502, { error: "수업을 삭제하지 못했습니다." });
      return response.status(204).end();
    }

    const patch = validatePatch(request.body || {}, user.id, supabaseUrl);
    if (!Object.keys(patch).length) return send(response, 400, { error: "수정할 내용이 없습니다." });
    const result = await fetch(itemEndpoint(supabaseUrl, user.id, itemId), {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(patch),
      signal: AbortSignal.timeout(8000),
    });
    const updated = await result.json().catch(() => []);
    if (!result.ok || !updated.length) return send(response, result.status === 401 || result.status === 403 ? 403 : 502, { error: "수업을 수정하지 못했습니다." });
    return send(response, 200, updated[0]);
  } catch (error) {
    if (error instanceof Error && error.message && !error.message.includes("fetch")) return send(response, 400, { error: error.message });
    return send(response, 502, { error: "수업 관리 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요." });
  }
}
