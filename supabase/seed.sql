-- ELC 영어 목록 화면 확인용 샘플 데이터 3건
-- 실제 수업 정보가 확정되면 [샘플] 항목을 실제 데이터로 교체합니다.
-- id와 created_at은 기본값으로 자동 생성되고 author_id는 NULL로 남습니다.

insert into public.items (
  title,
  target_grades,
  description,
  category,
  schedule_text,
  region,
  location,
  status
)
select
  '[샘플] 중1 영어 내신 기본기',
  array[1]::smallint[],
  '중학교 1학년 영어 내신의 기본 문법과 독해 흐름을 확인하는 예시 수업입니다.',
  'exam',
  '상담 후 안내',
  '인천 부평구 부개동',
  '인천광역시 부평구 부개동',
  'open'
where not exists (
  select 1 from public.items
  where title = '[샘플] 중1 영어 내신 기본기'
    and region = '인천 부평구 부개동'
);

insert into public.items (
  title,
  target_grades,
  description,
  category,
  schedule_text,
  region,
  location,
  status
)
select
  '[샘플] 중2 문법·독해 집중',
  array[2]::smallint[],
  '중학교 2학년 문법과 독해의 연결을 점검하는 예시 수업입니다.',
  'grammar',
  '상담 후 안내',
  '인천 부평구 부개동',
  '인천광역시 부평구 부개동',
  'open'
where not exists (
  select 1 from public.items
  where title = '[샘플] 중2 문법·독해 집중'
    and region = '인천 부평구 부개동'
);

insert into public.items (
  title,
  target_grades,
  description,
  category,
  schedule_text,
  region,
  location,
  status
)
select
  '[샘플] 중3 영어 내신 실전 대비',
  array[3]::smallint[],
  '중학교 3학년 시험 범위와 반복 오답을 점검하는 예시 수업입니다.',
  'exam',
  '상담 후 안내',
  '인천 부평구 부개동',
  '인천광역시 부평구 부개동',
  'open'
where not exists (
  select 1 from public.items
  where title = '[샘플] 중3 영어 내신 실전 대비'
    and region = '인천 부평구 부개동'
);
