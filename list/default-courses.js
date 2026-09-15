// 사용자 제공 기본 수업. 서버 연결을 기다리지 않고 표시한다.
export const DEFAULT_COURSES = [
  { title: "중1 영어", grade_keys: ["m1"], target_label: "중학교 1학년", schedule_text: "주 3회", description: "학교별 내신, 문법, 독해, 어휘, 듣기", status: "consultation", status_label: "상담 가능" },
  { title: "중2 영어", grade_keys: ["m2"], target_label: "중학교 2학년", schedule_text: "주 3회", description: "학교별 시험 분석, 문법, 독해, 어휘", status: "open", status_label: "모집 중" },
  { title: "중3 영어", grade_keys: ["m3"], target_label: "중학교 3학년", schedule_text: "주 3회", description: "중학교 내신 완성 및 고등 영어 준비", status: "consultation", status_label: "상담 가능" },
  { title: "고1 영어", grade_keys: ["h1"], target_label: "고등학교 1학년", schedule_text: "주 3회", description: "학교 내신, 모의고사, 독해, 문법, 어휘", status: "inquiry", status_label: "상담 문의" },
  { title: "고2 영어", grade_keys: ["h2"], target_label: "고등학교 2학년", schedule_text: "주 3회", description: "학교 내신, 모의고사, 수능 독해와 어휘", status: "inquiry", status_label: "상담 문의" },
  { title: "고3 영어", grade_keys: ["h3"], target_label: "고등학교 3학년", schedule_text: "주 3회", description: "학교 내신, 모의고사, 수능 영어 대비", status: "inquiry", status_label: "상담 문의" },
];
