-- Lead status enum
CREATE TYPE public.lead_status AS ENUM (
  'audit_requested',
  'audit_delivered',
  'activated',
  'paused',
  'unsubscribed'
);

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  brokerage TEXT,
  broker_type TEXT,
  inbox_provider TEXT,
  watchlist_size INT,
  notes TEXT,
  status public.lead_status NOT NULL DEFAULT 'audit_requested',
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  audit_delivered_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX leads_email_unique ON public.leads (lower(email));
CREATE INDEX leads_status_idx ON public.leads (status);
CREATE INDEX leads_created_at_idx ON public.leads (created_at);

-- Email sends tracking
CREATE TABLE public.lead_email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lead_id, step)
);

CREATE INDEX lead_email_sends_lead_idx ON public.lead_email_sends (lead_id);

-- Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS: leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can insert a new lead via the public form
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS: lead_email_sends
ALTER TABLE public.lead_email_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email sends"
  ON public.lead_email_sends FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
