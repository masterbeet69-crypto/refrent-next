-- ============================================================
-- Migration 001 — Table profiles + trigger d'auto-création
-- À exécuter dans le SQL Editor Supabase :
-- dashboard.supabase.com → projet → SQL Editor → New query
-- ============================================================

-- 1. Table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text        NOT NULL CHECK (role IN ('user','agent','admin','advertiser')) DEFAULT 'user',
  full_name    text        NOT NULL DEFAULT '',
  phone        text,
  country_code text,
  city_code    text,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur peut lire/modifier son propre profil
CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Le service role peut tout faire (pas bloqué par RLS)
-- Rien à ajouter : service_role bypasse RLS par défaut

-- 3. Trigger : crée automatiquement un profil à l'inscription Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, country_code, city_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'country_code',
    NEW.raw_user_meta_data->>'city_code'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Backfill : crée un profil pour les utilisateurs auth déjà existants
INSERT INTO public.profiles (id, role, full_name)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'role', 'user'),
  COALESCE(raw_user_meta_data->>'full_name', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
