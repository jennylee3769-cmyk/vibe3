const elements = {
  loading: document.querySelector("[data-loading]"),
  empty: document.querySelector("[data-empty]"),
  error: document.querySelector("[data-error]"),
  errorMessage: document.querySelector("[data-error-message]"),
  retry: document.querySelector("[data-retry]"),
  list: document.querySelector("[data-list]"),
  count: document.querySelector("[data-count]"),
};

const config = window.ELC_SUPABASE_CONFIG ?? {};
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function showOnly(name) {
  ["loading", "empty", "error"].forEach((key) => {
    elements[key].hidden = key !== name;
  });
}

function createCard(item, index) {
  const article = document.createElement("article");
  article.className = "class-card";

  const number = document.createElement("span");
  number.className = "card-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const title = document.createElement("h3");
  title.textContent = item.title || "제목 없는 수업";

  const meta = document.createElement("dl");
  const regionLabel = document.createElement("dt");
  const regionValue = document.createElement("dd");
  const dateLabel = document.createElement("dt");
  const dateValue = document.createElement("dd");

  regionLabel.textContent = "지역";
  regionValue.textContent = item.region || "지역 미정";
  dateLabel.textContent = "등록일";
  dateValue.textContent = item.created_at
    ? dateFormatter.format(new Date(item.created_at))
    : "날짜 미정";

  meta.append(regionLabel, regionValue, dateLabel, dateValue);
  article.append(number, title, meta);
  return article;
}

async function loadItems() {
  elements.list.replaceChildren();
  elements.count.textContent = "";
  showOnly("loading");

  if (!config.url || !config.anonKey) {
    elements.errorMessage.textContent =
      "Supabase 연결 정보가 필요합니다. list/config.js에 프로젝트 URL과 anon key를 입력해 주세요.";
    showOnly("error");
    return;
  }

  try {
    const endpoint = new URL("/rest/v1/items", config.url);
    endpoint.searchParams.set("select", "title,region:location,created_at");
    endpoint.searchParams.set("order", "created_at.desc");

    const response = await fetch(endpoint, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`요청 실패 (${response.status})`);
    }

    const items = await response.json();
    elements.loading.hidden = true;

    if (!items.length) {
      elements.count.textContent = "0개의 수업";
      showOnly("empty");
      return;
    }

    elements.empty.hidden = true;
    elements.error.hidden = true;
    elements.count.textContent = `${items.length}개의 수업`;
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => fragment.append(createCard(item, index)));
    elements.list.append(fragment);
  } catch (error) {
    elements.errorMessage.textContent = `${error.message}. 연결 정보와 RLS 읽기 정책을 확인해 주세요.`;
    showOnly("error");
  }
}

elements.retry?.addEventListener("click", loadItems);
loadItems();
