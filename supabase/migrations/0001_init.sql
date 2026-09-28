-- Deusy & Planners Services: schema, RLS and storage.
-- Run this once in the Supabase SQL editor, then run seed.sql.

-- ---------------------------------------------------------------- roles

create type user_role as enum ('admin', 'editor');

-- ---------------------------------------------------------------- functions

create function is_staff() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;

create function is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------- tables

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role user_role not null default 'editor',
  created_at timestamptz default now()
);

create table pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  template text not null default 'standard' check (template in ('standard','faq','contact')),
  content jsonb not null default '{"type":"doc","content":[]}',
  published boolean not null default false,
  show_in_nav boolean not null default false,
  nav_label text,
  nav_order int not null default 0,
  seo_title text,
  seo_desc text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger pages_updated before update on pages for each row execute function set_updated_at();

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  active boolean not null default true
);

create table services (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('practice','agency')),
  title text not null,
  slug text not null unique,
  summary text not null,
  scope text[] not null default '{}',
  body jsonb,
  image text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger services_updated before update on services for each row execute function set_updated_at();

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo text,
  sort_order int not null default 0,
  active boolean not null default true
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz default now()
);

create table media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  alt text,
  size_bytes int,
  created_at timestamptz default now()
);

-- key/value: 'site' (name, tagline, phone, email, whatsapp, address lines, hours, socials, logo_url)
--            'home' (hero_title, hero_intro, services_heading, agency_heading, closing_heading)
create table settings (
  key text primary key,
  value jsonb not null
);

-- ---------------------------------------------------------------- RLS

alter table profiles      enable row level security;
alter table pages         enable row level security;
alter table faqs          enable row level security;
alter table services      enable row level security;
alter table team_members  enable row level security;
alter table enquiries     enable row level security;
alter table media         enable row level security;
alter table settings      enable row level security;

create policy "own profile"        on profiles for select using (id = auth.uid() or is_admin());
create policy "admin manage profiles" on profiles for all using (is_admin()) with check (is_admin());

create policy "read pages"    on pages    for select using (published or is_staff());
create policy "read faqs"     on faqs     for select using (active or is_staff());
create policy "read services" on services for select using (active or is_staff());
create policy "read team"     on team_members for select using (active or is_staff());
create policy "read settings" on settings for select using (true);
create policy "read media"    on media    for select using (true);

create policy "staff write pages"    on pages    for all using (is_staff()) with check (is_staff());
create policy "staff write faqs"     on faqs     for all using (is_staff()) with check (is_staff());
create policy "staff write services" on services for all using (is_staff()) with check (is_staff());
create policy "staff write team"     on team_members for all using (is_staff()) with check (is_staff());
create policy "staff write settings" on settings for all using (is_staff()) with check (is_staff());
create policy "staff write media"    on media    for all using (is_staff()) with check (is_staff());

-- anyone can submit an enquiry; only staff can read or manage them
create policy "public submit enquiry" on enquiries for insert with check (status = 'new');
create policy "staff read enquiries"  on enquiries for select using (is_staff());
create policy "staff update enquiries" on enquiries for update using (is_staff());
create policy "staff delete enquiries" on enquiries for delete using (is_staff());

-- ---------------------------------------------------------------- storage

insert into storage.buckets (id, name, public) values ('media','media', true) on conflict do nothing;
create policy "public read media files" on storage.objects for select using (bucket_id = 'media');
create policy "staff upload media files" on storage.objects for insert with check (bucket_id = 'media' and is_staff());
create policy "staff update media files" on storage.objects for update using (bucket_id = 'media' and is_staff());
create policy "staff delete media files" on storage.objects for delete using (bucket_id = 'media' and is_staff());
