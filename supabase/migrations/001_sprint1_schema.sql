-- =====================================================================
-- 001_sprint1_schema.sql
-- ClawbackVault Sprint 1 schema (v11)
-- Additive only. Safe to re-run.
-- Apply via: `supabase db push` or paste into the Supabase SQL editor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------
-- 1. broker_profiles
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS broker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  segment TEXT DEFAULT 'mortgage_au' CHECK (segment IN ('mortgage_au','mortgage_ie','mortgage_uk','life_insurance_ca','life_insurance_us','ifa_uk')),
  subscription_tier TEXT DEFAULT 'ghost_audit_preview' CHECK (subscription_tier IN ('ghost_audit_preview','free','detect','fortress')),
  broker_timezone TEXT DEFAULT 'Australia/Sydney',
  monitoring_paused_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE broker_profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'ghost_audit_preview';
ALTER TABLE broker_profiles ADD COLUMN IF NOT EXISTS segment TEXT DEFAULT 'mortgage_au';
ALTER TABLE broker_profiles ADD COLUMN IF NOT EXISTS broker_timezone TEXT DEFAULT 'Australia/Sydney';
ALTER TABLE broker_profiles ADD COLUMN IF NOT EXISTS monitoring_paused_until DATE;

CREATE INDEX IF NOT EXISTS broker_profiles_user_id_idx ON broker_profiles(user_id);

-- ---------------------------------------------------------------------
-- 2. watchlist_clients
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS watchlist_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES broker_profiles(id) ON DELETE CASCADE,
  client_email TEXT NOT NULL,
  client_name TEXT,
  lender_name TEXT,
  settlement_date DATE,
  commission_amount NUMERIC(10,2),
  clawback_window_months INTEGER DEFAULT 24,
  clawback_expiry_date DATE GENERATED ALWAYS AS (settlement_date + (clawback_window_months || ' months')::INTERVAL) STORED,
  days_remaining_in_window INTEGER GENERATED ALWAYS AS (GREATEST(0, (settlement_date + (clawback_window_months || ' months')::INTERVAL)::DATE - CURRENT_DATE)) STORED,
  last_email_contact DATE,
  avg_response_days NUMERIC(5,2),
  heatmap_score INTEGER DEFAULT 50,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','clawback_window_closed','archived')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual','csv_upload','auto_discovered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, client_email)
);

ALTER TABLE watchlist_clients ADD COLUMN IF NOT EXISTS lender_name TEXT;

CREATE INDEX IF NOT EXISTS watchlist_clients_broker_id_idx ON watchlist_clients(broker_id);
CREATE INDEX IF NOT EXISTS watchlist_clients_client_email_idx ON watchlist_clients(client_email);

-- ---------------------------------------------------------------------
-- 3. signal_vocabulary  (global, not per-broker)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type TEXT NOT NULL,
  tier INTEGER CHECK (tier IN (1,2,3)),
  confidence_base NUMERIC(4,3),
  keywords TEXT[],
  segment TEXT DEFAULT 'mortgage_au',
  active BOOLEAN DEFAULT true,
  false_positive_count INTEGER DEFAULT 0,
  review_flagged BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE signal_vocabulary ADD COLUMN IF NOT EXISTS segment TEXT DEFAULT 'mortgage_au';
ALTER TABLE signal_vocabulary ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE signal_vocabulary ADD COLUMN IF NOT EXISTS false_positive_count INTEGER DEFAULT 0;
ALTER TABLE signal_vocabulary ADD COLUMN IF NOT EXISTS review_flagged BOOLEAN DEFAULT false;
ALTER TABLE signal_vocabulary ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS signal_vocabulary_segment_idx ON signal_vocabulary(segment) WHERE active;

-- ---------------------------------------------------------------------
-- 4. scan_results
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES broker_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES watchlist_clients(id),
  signal_type TEXT NOT NULL,
  tier INTEGER,
  confidence_score NUMERIC(4,3),
  analytical_reason TEXT,
  thread_id TEXT,
  client_name_masked TEXT,
  signal_status TEXT DEFAULT 'active' CHECK (signal_status IN ('active','expired','dismissed','actioned')),
  expires_at TIMESTAMPTZ,
  vocabulary_version INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scan_results_broker_id_idx ON scan_results(broker_id);
CREATE INDEX IF NOT EXISTS scan_results_client_id_idx ON scan_results(client_id);
CREATE INDEX IF NOT EXISTS scan_results_active_idx ON scan_results(broker_id, signal_status) WHERE signal_status = 'active';

-- ---------------------------------------------------------------------
-- 5. broker_alerts
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS broker_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES broker_profiles(id) ON DELETE CASCADE,
  scan_result_id UUID REFERENCES scan_results(id),
  client_id UUID REFERENCES watchlist_clients(id),
  alert_type TEXT,
  draft_text TEXT,
  whatsapp_sent_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  reply_yes_received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS broker_alerts_broker_id_idx ON broker_alerts(broker_id);
CREATE INDEX IF NOT EXISTS broker_alerts_scan_result_id_idx ON broker_alerts(scan_result_id);

-- ---------------------------------------------------------------------
-- 6. broker_alert_outcomes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS broker_alert_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES broker_alerts(id),
  broker_id UUID NOT NULL REFERENCES broker_profiles(id),
  signal_type TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('saved','lost','false_alarm','already_handled','client_retained')),
  commission_amount_protected NUMERIC(10,2),
  tagged_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS broker_alert_outcomes_broker_id_idx ON broker_alert_outcomes(broker_id);
CREATE INDEX IF NOT EXISTS broker_alert_outcomes_alert_id_idx ON broker_alert_outcomes(alert_id);

-- ---------------------------------------------------------------------
-- 7. client_communication_profiles
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_communication_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES broker_profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES watchlist_clients(id) ON DELETE CASCADE,
  avg_message_frequency_days NUMERIC(5,2),
  avg_response_latency_hours NUMERIC(5,2),
  vocabulary_formality_score NUMERIC(3,2),
  typical_message_length_words INTEGER,
  baseline_established_date DATE,
  silent_drift_index TEXT DEFAULT 'low' CHECK (silent_drift_index IN ('low','elevated','high')),
  silent_drift_percentage NUMERIC(5,2),
  confidence_adjustments JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, client_id)
);

CREATE INDEX IF NOT EXISTS client_communication_profiles_broker_id_idx ON client_communication_profiles(broker_id);

-- ---------------------------------------------------------------------
-- 8. false_positive_log
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS false_positive_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES broker_profiles(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES scan_results(id),
  signal_type TEXT NOT NULL,
  confidence_score_at_time NUMERIC(4,3),
  client_id UUID REFERENCES watchlist_clients(id),
  feedback_category TEXT NOT NULL CHECK (feedback_category IN ('false_alarm','already_handled','client_retained')),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS false_positive_log_broker_id_idx ON false_positive_log(broker_id);

-- ---------------------------------------------------------------------
-- 9. content_strings (global copy table)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_strings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  locale TEXT DEFAULT 'en-AU',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
-- For broker-scoped tables we resolve broker_id through broker_profiles
-- so the policy correctly maps auth.uid() (== auth.users.id) to the
-- broker_profiles.id used as foreign key.
-- =====================================================================

-- broker_profiles ------------------------------------------------------
ALTER TABLE broker_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "broker_own_profile_select" ON broker_profiles;
CREATE POLICY "broker_own_profile_select" ON broker_profiles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "broker_own_profile_insert" ON broker_profiles;
CREATE POLICY "broker_own_profile_insert" ON broker_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "broker_own_profile_update" ON broker_profiles;
CREATE POLICY "broker_own_profile_update" ON broker_profiles
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "broker_own_profile_delete" ON broker_profiles;
CREATE POLICY "broker_own_profile_delete" ON broker_profiles
  FOR DELETE USING (user_id = auth.uid());

-- Helper: current broker_profile id for the authenticated user.
CREATE OR REPLACE FUNCTION current_broker_id()
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.broker_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- broker-scoped tables -------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'watchlist_clients',
    'scan_results',
    'broker_alerts',
    'broker_alert_outcomes',
    'client_communication_profiles',
    'false_positive_log'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "broker_own_rows" ON %I', t);
    EXECUTE format(
      'CREATE POLICY "broker_own_rows" ON %I FOR ALL USING (broker_id = current_broker_id()) WITH CHECK (broker_id = current_broker_id())',
      t
    );
  END LOOP;
END $$;

-- signal_vocabulary: read open to authenticated users, writes service-role only.
ALTER TABLE signal_vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "signal_vocab_select_authenticated" ON signal_vocabulary;
CREATE POLICY "signal_vocab_select_authenticated" ON signal_vocabulary
  FOR SELECT TO authenticated USING (true);
-- No INSERT/UPDATE/DELETE policy for non-service roles => denied by default.

-- content_strings: read open to authenticated users, writes service-role only.
ALTER TABLE content_strings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_strings_select_authenticated" ON content_strings;
CREATE POLICY "content_strings_select_authenticated" ON content_strings
  FOR SELECT TO authenticated USING (true);

-- =====================================================================
-- SEEDS
-- =====================================================================

-- Tier 1 mortgage_au signals
INSERT INTO signal_vocabulary (signal_type, tier, confidence_base, keywords, segment, active, version)
VALUES
  (
    'payout_figure_request', 1, 0.95,
    ARRAY['payout figure','payout amount','how much do I owe','total payout','discharge amount'],
    'mortgage_au', true, 1
  ),
  (
    'refinance_explicit', 1, 0.90,
    ARRAY['refinancing','switching lenders','looking at other banks','better rate elsewhere','competitor offered'],
    'mortgage_au', true, 1
  ),
  (
    'document_package_request', 1, 0.85,
    ARRAY['original loan documents','mortgage documents','loan contract','settlement documents'],
    'mortgage_au', true, 1
  )
ON CONFLICT DO NOTHING;

-- content_strings placeholders (Ali updates final copy via admin)
INSERT INTO content_strings (key, value, locale) VALUES
  ('notification.tier1.subject',                  '[placeholder] Tier 1 alert subject',                                    'en-AU'),
  ('notification.tier1.body',                     '[placeholder] Tier 1 alert body',                                       'en-AU'),
  ('notification.tier2.subject',                  '[placeholder] Tier 2 alert subject',                                    'en-AU'),
  ('notification.tier2.body',                     '[placeholder] Tier 2 alert body',                                       'en-AU'),
  ('notification.tier3.subject',                  '[placeholder] Tier 3 alert subject',                                    'en-AU'),
  ('notification.tier3.body',                     '[placeholder] Tier 3 alert body',                                       'en-AU'),
  ('ghost_audit.preconsent.headline',             '[placeholder] See what''s in your inbox',                               'en-AU'),
  ('ghost_audit.preconsent.body',                 '[placeholder] Pre-consent screen body copy',                            'en-AU'),
  ('ghost_audit.results.no_signals_headline',     '[placeholder] Your book looks clean today',                             'en-AU'),
  ('ghost_audit.results.signals_found_headline',  '[placeholder] We found signals in your client book',                    'en-AU')
ON CONFLICT (key) DO NOTHING;
