-- ============================================================
-- FORJANDO GUERREIROS — TABELA DE NOTIFICAÇÕES PUSH (Web Push)
-- Rodar no Supabase → SQL Editor → New query → Run
-- ============================================================
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "ps_select" on public.push_subscriptions;
drop policy if exists "ps_insert" on public.push_subscriptions;
drop policy if exists "ps_delete" on public.push_subscriptions;

create policy "ps_select" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "ps_insert" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "ps_delete" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

-- verificação: deve retornar 3
select count(*) as politicas from pg_policies
where schemaname = 'public' and tablename = 'push_subscriptions';
