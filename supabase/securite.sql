-- ============================================================
-- AL BASIRAH — règles de sécurité Supabase (RLS)
-- À exécuter dans Supabase > SQL Editor. Relisez avant d'appliquer :
-- les noms de tables/colonnes sont déduits du code de l'app.
-- La vraie sécurité est ICI : les vérifications côté app ne sont que du confort.
-- ============================================================

-- 1. Fonction : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- 2. PROFILES : chacun lit/modifie son profil, mais personne ne change son propre rôle
alter table public.profiles enable row level security;

drop policy if exists "profil lecture" on public.profiles;
create policy "profil lecture" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profil maj" on public.profiles;
create policy "profil maj" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Empêche l'élévation de privilège : seul un admin peut modifier la colonne role
create or replace function public.protect_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Modification du rôle interdite';
  end if;
  return new;
end $$;

drop trigger if exists protect_role_trg on public.profiles;
create trigger protect_role_trg before update on public.profiles
  for each row execute function public.protect_role();

-- 3. CONTENU PUBLIC : lecture pour tous, écriture réservée aux admins
do $$
declare t text;
begin
  foreach t in array array[
    'savants','livres','audios','hadiths','rapporteurs','coran_audios','sourates',
    'prophetes','sahaba','videos','actualites','mises_en_garde'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "lecture publique" on public.%I', t);
    execute format('create policy "lecture publique" on public.%I for select using (true)', t);
    execute format('drop policy if exists "ecriture admin" on public.%I', t);
    execute format('create policy "ecriture admin" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- 4. SUPPORT : un utilisateur crée et lit uniquement ses tickets ; les admins gèrent tout
alter table public.support_tickets enable row level security;
drop policy if exists "ticket creation" on public.support_tickets;
create policy "ticket creation" on public.support_tickets
  for insert with check (user_id = auth.uid());
drop policy if exists "ticket lecture" on public.support_tickets;
create policy "ticket lecture" on public.support_tickets
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "ticket admin" on public.support_tickets;
create policy "ticket admin" on public.support_tickets
  for update using (public.is_admin()) with check (public.is_admin());

-- 5. NOTIFICATIONS PUSH : chacun gère uniquement ses abonnements
alter table public.push_subscriptions enable row level security;
drop policy if exists "push propre" on public.push_subscriptions;
create policy "push propre" on public.push_subscriptions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 6. VERSIONS DE L'APP : lecture publique des versions actives, écriture admin
--    (le workflow GitHub utilise la clé service, qui contourne la RLS)
alter table public.app_versions enable row level security;
drop policy if exists "versions lecture" on public.app_versions;
create policy "versions lecture" on public.app_versions for select using (actif = true or public.is_admin());
drop policy if exists "versions admin" on public.app_versions;
create policy "versions admin" on public.app_versions for all using (public.is_admin()) with check (public.is_admin());

-- 7. STORAGE : lecture publique des buckets de contenu, envoi réservé aux admins
do $$
declare b text;
begin
  foreach b in array array['audios','livres','covers','coran','actualites','mises'] loop
    execute format('drop policy if exists "lecture %1$s" on storage.objects', b);
    execute format('create policy "lecture %1$s" on storage.objects for select using (bucket_id = %2$L)', b, b);
    execute format('drop policy if exists "envoi %1$s" on storage.objects', b);
    execute format('create policy "envoi %1$s" on storage.objects for insert with check (bucket_id = %2$L and public.is_admin())', b, b);
    execute format('drop policy if exists "suppression %1$s" on storage.objects', b);
    execute format('create policy "suppression %1$s" on storage.objects for delete using (bucket_id = %2$L and public.is_admin())', b, b);
  end loop;
end $$;
-- Le bucket "apk" : lecture publique, écriture uniquement via la clé service (pas de policy d'envoi).
