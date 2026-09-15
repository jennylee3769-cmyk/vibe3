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
  region varchar(100) not null,
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

-- 기존 items 테이블에도 region 열을 안전하게 추가한다.
alter table public.items add column if not exists region varchar(100);
update public.items set region = location where region is null;
alter table public.items alter column region set not null;

comment on table public.items is 'ELC 영어 오프라인 중등 내신 수업 정보';
comment on column public.items.author_id is
  '작성자 Supabase Auth 사용자 ID. 비워둘 수 있지만, NULL 항목은 일반 사용자가 수정하거나 삭제할 수 없다.';
comment on column public.items.target_grades is '대상 중학교 학년 배열. 허용 값은 1, 2, 3';
comment on column public.items.category is '학습 영역: grammar, reading, vocabulary, exam';
comment on column public.items.region is '카드 목록에 표시할 지역명';
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

-- 공개 수업만 조회하고, 서버에서 지정한 운영자만 관리한다.
-- app_metadata.elc_role은 신뢰할 수 있는 관리자 도구에서만 지정한다.
-- user_metadata는 권한 판단에 사용하지 않는다.
drop policy if exists "items_are_publicly_readable" on public.items;
drop policy if exists "authenticated_users_create_own_items" on public.items;
drop policy if exists "authors_update_own_items" on public.items;
drop policy if exists "authors_delete_own_items" on public.items;
drop policy if exists "elc_admins_manage_items" on public.items;
create policy "items_are_publicly_readable"
on public.items for select to anon, authenticated
using (status in ('open', 'closed'));
create policy "elc_admins_manage_items"
on public.items for all to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'elc_role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'elc_role') = 'admin');
grant select on table public.items to anon, authenticated;
grant insert, update, delete on table public.items to authenticated;
revoke insert, update, delete on table public.items from anon;
