-- 기존 데이터는 유지한다. 운영 DB 적용은 별도 승인 후 진행한다.
begin;
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
commit;
