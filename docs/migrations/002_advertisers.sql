-- =============================================================
-- Migration 002 — Advertisers & Ad Campaigns
-- Run this in Supabase SQL Editor
-- =============================================================

-- ── Advertisers table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.advertisers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  company      text,
  email        text NOT NULL,
  phone        text,
  website      text,
  logo_url     text,
  is_active    boolean NOT NULL DEFAULT true,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Ad campaigns / banners ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id   uuid REFERENCES public.advertisers(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  image_url       text,
  link_url        text NOT NULL,
  -- Placement: 'landing_hero' | 'browse_inline' | 'fiche_sidebar' | 'global_banner'
  placement       text NOT NULL DEFAULT 'browse_inline',
  is_active       boolean NOT NULL DEFAULT false,
  starts_at       timestamptz NOT NULL DEFAULT now(),
  ends_at         timestamptz,
  budget_fcfa     numeric(12,0),
  impressions     integer NOT NULL DEFAULT 0,
  clicks          integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── RLS ───────────────────────────────────────────────────
ALTER TABLE public.advertisers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns  ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "admin_all_advertisers"  ON public.advertisers  FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admin_all_campaigns"    ON public.ad_campaigns FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Public can read active campaigns
CREATE POLICY "public_read_active_campaigns" ON public.ad_campaigns
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND (ends_at IS NULL OR ends_at > now()));

-- ── Seed demo data ────────────────────────────────────────
INSERT INTO public.advertisers (name, company, email, website, is_active) VALUES
  ('Comlan Démos', 'ImmoConnect Bénin', 'ads@immoconnect.bj', 'https://immoconnect.bj', true),
  ('Aminata Diallo', 'Dakar Properties', 'aminata@dakar-prop.sn', 'https://dakar-prop.sn', true)
ON CONFLICT DO NOTHING;
