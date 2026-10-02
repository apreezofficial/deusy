-- Migration: 0002_posts.sql
-- Blog Posts table, policies, and updated_at trigger

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '{"type":"doc","content":[]}',
  cover_image text,
  category text,
  author text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- trigger for updated_at
drop trigger if exists posts_updated on posts;
create trigger posts_updated before update on posts for each row execute function set_updated_at();

-- Enable RLS
alter table posts enable row level security;

-- Policies
drop policy if exists "read posts" on posts;
create policy "read posts" on posts for select using (published or is_staff());

drop policy if exists "staff write posts" on posts;
create policy "staff write posts" on posts for all using (is_staff()) with check (is_staff());
