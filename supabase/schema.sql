-- Master of Commerce — Supabase schema
-- Run this once in your project's SQL editor (Project → SQL Editor → New query).
-- Every table is scoped to auth.uid() via row-level security, so each
-- business owner only ever sees their own data, synced across devices.

-- ── Dashboard preferences (widget show/hide + order) ───────────────────────
create table if not exists public.preferences (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  layout     jsonb not null default '[]'::jsonb, -- ordered array of widget ids
  hidden     jsonb not null default '[]'::jsonb, -- array of hidden widget ids
  updated_at timestamptz not null default now()
);

alter table public.preferences enable row level security;

create policy "preferences_owner_select" on public.preferences
  for select using (auth.uid() = user_id);
create policy "preferences_owner_upsert" on public.preferences
  for insert with check (auth.uid() = user_id);
create policy "preferences_owner_update" on public.preferences
  for update using (auth.uid() = user_id);
create policy "preferences_owner_delete" on public.preferences
  for delete using (auth.uid() = user_id);

-- ── Tasks (daily to-dos) ────────────────────────────────────────────────────
create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  done       boolean not null default false,
  due_date   date,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "tasks_owner_select" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks_owner_insert" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks_owner_update" on public.tasks
  for update using (auth.uid() = user_id);
create policy "tasks_owner_delete" on public.tasks
  for delete using (auth.uid() = user_id);

-- ── Cash flow entries (daily income / expense log) ─────────────────────────
create table if not exists public.cash_flow_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  kind       text not null check (kind in ('income','expense')),
  amount     numeric(12,2) not null check (amount >= 0),
  note       text,
  created_at timestamptz not null default now()
);

alter table public.cash_flow_entries enable row level security;

create policy "cash_flow_owner_select" on public.cash_flow_entries
  for select using (auth.uid() = user_id);
create policy "cash_flow_owner_insert" on public.cash_flow_entries
  for insert with check (auth.uid() = user_id);
create policy "cash_flow_owner_update" on public.cash_flow_entries
  for update using (auth.uid() = user_id);
create policy "cash_flow_owner_delete" on public.cash_flow_entries
  for delete using (auth.uid() = user_id);

-- ── Invoices ────────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_name text not null,
  amount      numeric(12,2) not null check (amount >= 0),
  status      text not null default 'unpaid' check (status in ('unpaid','paid')),
  due_date    date,
  created_at  timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "invoices_owner_select" on public.invoices
  for select using (auth.uid() = user_id);
create policy "invoices_owner_insert" on public.invoices
  for insert with check (auth.uid() = user_id);
create policy "invoices_owner_update" on public.invoices
  for update using (auth.uid() = user_id);
create policy "invoices_owner_delete" on public.invoices
  for delete using (auth.uid() = user_id);

-- ── Inventory items ─────────────────────────────────────────────────────────
create table if not exists public.inventory_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name          text not null,
  quantity      integer not null default 0 check (quantity >= 0),
  low_stock_at  integer not null default 5 check (low_stock_at >= 0),
  unit          text not null default 'units',
  created_at    timestamptz not null default now()
);

alter table public.inventory_items enable row level security;

create policy "inventory_owner_select" on public.inventory_items
  for select using (auth.uid() = user_id);
create policy "inventory_owner_insert" on public.inventory_items
  for insert with check (auth.uid() = user_id);
create policy "inventory_owner_update" on public.inventory_items
  for update using (auth.uid() = user_id);
create policy "inventory_owner_delete" on public.inventory_items
  for delete using (auth.uid() = user_id);
