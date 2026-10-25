-- Waste Less, Live Better: visit log for the login page.
-- Run once in the Supabase SQL editor. Codes are NOT stored in this repo:
-- set them afterwards with the two statements at the bottom.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.app_config (
  key text primary key,
  code_hash text not null
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null check (char_length(visitor_name) between 1 and 60),
  role text not null check (role in ('teacher', 'student', 'visitor')),
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  scenes_viewed int[] not null default '{}',
  seconds_active int not null default 0,
  quiz_score int,
  quiz_total int,
  user_agent text
);

-- No policies: the anon key cannot read or write tables directly.
alter table public.app_config enable row level security;
alter table public.visits enable row level security;
revoke all on public.app_config, public.visits from anon, authenticated;

create or replace function public.check_code(p_key text, p_code text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.app_config
    where key = p_key and code_hash = extensions.crypt(upper(trim(p_code)), code_hash)
  );
$$;
revoke all on function public.check_code(text, text) from public, anon, authenticated;

create or replace function public.start_visit(p_name text, p_role text, p_code text, p_user_agent text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.check_code('access_code', p_code) then
    raise exception 'invalid_code';
  end if;
  insert into public.visits (visitor_name, role, user_agent)
  values (left(trim(p_name), 60), p_role, left(p_user_agent, 300))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.touch_visit(p_id uuid, p_scene int, p_seconds int, p_quiz_score int, p_quiz_total int)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.visits set
    last_seen_at = now(),
    scenes_viewed = case
      when p_scene between 1 and 8 and not (p_scene = any(scenes_viewed)) then array_append(scenes_viewed, p_scene)
      else scenes_viewed end,
    seconds_active = seconds_active + least(greatest(coalesce(p_seconds, 0), 0), 120),
    quiz_score = coalesce(p_quiz_score, quiz_score),
    quiz_total = coalesce(p_quiz_total, quiz_total)
  where id = p_id and started_at > now() - interval '1 day';
end;
$$;

create or replace function public.get_visits(p_code text)
returns table (
  visitor_name text, role text, started_at timestamptz, last_seen_at timestamptz,
  scenes_viewed int[], seconds_active int, quiz_score int, quiz_total int, user_agent text
) language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.check_code('log_code', p_code) then
    raise exception 'invalid_code';
  end if;
  return query
    select v.visitor_name, v.role, v.started_at, v.last_seen_at, v.scenes_viewed,
           v.seconds_active, v.quiz_score, v.quiz_total, v.user_agent
    from public.visits v order by v.started_at desc limit 200;
end;
$$;

revoke all on function public.start_visit(text, text, text, text) from public;
revoke all on function public.touch_visit(uuid, int, int, int, int) from public;
revoke all on function public.get_visits(text) from public;
grant execute on function public.start_visit(text, text, text, text) to anon, authenticated;
grant execute on function public.touch_visit(uuid, int, int, int, int) to anon, authenticated;
grant execute on function public.get_visits(text) to anon, authenticated;

-- Set your own codes (UPPERCASE). Keep them out of git.
-- insert into public.app_config values ('access_code', extensions.crypt('YOUR-ACCESS-CODE', extensions.gen_salt('bf')))
--   on conflict (key) do update set code_hash = excluded.code_hash;
-- insert into public.app_config values ('log_code', extensions.crypt('YOUR-LOG-CODE', extensions.gen_salt('bf')))
--   on conflict (key) do update set code_hash = excluded.code_hash;
