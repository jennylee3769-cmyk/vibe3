-- ELC 영어 수업 정보 테이블
-- 기준 문서: docs/spec.md > 3. 저장해야 할 데이터 > 수업 정보

create extension if not exists pgcrypto;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  author_id uuid null references auth.users (id) on delete set null,
  title varchar(100) not null,
  target_grades smallint[] not null,
  description text not null,
  category text not null,
  schedule_text varchar(200) not null,
  location varchar(200) not null,
  start_date date null,
  material text null,
  capacity integer null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint items_target_grades_not_empty
    check (cardinality(target_grades) > 0),
  constraint items_target_grades_valid
    check (target_grades <@ array[1, 2, 3]::smallint[]),
  constraint items_category_valid
    check (category in ('grammar', 'reading', 'vocabulary', 'exam')),
  constraint items_capacity_valid
    check (capacity is null or capacity >= 0),
  constraint items_status_valid
    check (status in ('draft', 'open', 'closed'))
);

comment on table public.items is 'ELC 영어 오프라인 중등 내신 수업 정보';
comment on column public.items.author_id is
  '작성자 Supabase Auth 사용자 ID. 비워둘 수 있지만, NULL 항목은 일반 사용자가 수정하거나 삭제할 수 없다.';
comment on column public.items.target_grades is '대상 중학교 학년 배열. 허용 값은 1, 2, 3';
comment on column public.items.category is '학습 영역: grammar, reading, vocabulary, exam';
comment on column public.items.status is '모집 상태: draft, open, closed';

create index if not exists items_author_id_idx on public.items (author_id);
create index if not exists items_created_at_idx on public.items (created_at desc);
create index if not exists items_category_idx on public.items (category);
create index if not exists items_status_idx on public.items (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

alter table public.items enable row level security;

-- 정책을 다시 실행해도 같은 이름의 정책과 충돌하지 않도록 교체한다.
drop policy if exists "items_are_publicly_readable" on public.items;
create policy "items_are_publicly_readable"
on public.items
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated_users_create_own_items" on public.items;
create policy "authenticated_users_create_own_items"
on public.items
for insert
to authenticated
with check (author_id = (select auth.uid()));

drop policy if exists "authors_update_own_items" on public.items;
create policy "authors_update_own_items"
on public.items
for update
to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

drop policy if exists "authors_delete_own_items" on public.items;
create policy "authors_delete_own_items"
on public.items
for delete
to authenticated
using (author_id = (select auth.uid()));

grant select on table public.items to anon, authenticated;
grant insert, update, delete on table public.items to authenticated;
revoke insert, update, delete on table public.items from anon;
