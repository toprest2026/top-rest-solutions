
-- Storefronts table to manage partner stores
CREATE TABLE public.storefronts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  storefront_type text NOT NULL DEFAULT 'subdomain', -- 'subdomain' or 'custom_domain'
  subdomain text UNIQUE, -- e.g. 'almanhal' => almanhal.toprest.sa
  custom_domain text UNIQUE, -- e.g. 'almanhal.com'
  theme text NOT NULL DEFAULT 'fast', -- 'fast', 'wholesale', 'luxury'
  logo_url text,
  primary_color text DEFAULT '#0ea5e9',
  secondary_color text DEFAULT '#1e293b',
  status text NOT NULL DEFAULT 'pending', -- 'pending','active','suspended','dns_pending'
  dns_ticket_id uuid,
  activated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.storefronts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage storefronts" ON public.storefronts FOR ALL USING (is_admin());
CREATE POLICY "Suppliers view own storefront" ON public.storefronts FOR SELECT USING (is_supplier() AND supplier_id = get_user_supplier_id());

-- Support tickets table for DNS requests etc.
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES public.suppliers(id),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open', -- 'open','in_progress','resolved','closed'
  priority text DEFAULT 'normal', -- 'low','normal','high','urgent'
  ticket_type text DEFAULT 'general', -- 'dns_activation','general','billing'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tickets" ON public.support_tickets FOR ALL USING (is_admin());
CREATE POLICY "Suppliers view own tickets" ON public.support_tickets FOR SELECT USING (is_supplier() AND supplier_id = get_user_supplier_id());

-- Trigger for updated_at
CREATE TRIGGER update_storefronts_updated_at BEFORE UPDATE ON public.storefronts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
