
-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  description_ar text,
  price_monthly numeric NOT NULL DEFAULT 0,
  price_yearly numeric,
  max_products integer DEFAULT 50,
  max_orders integer DEFAULT 500,
  has_custom_domain boolean DEFAULT false,
  has_dedicated_page boolean DEFAULT false,
  has_driver_radar boolean DEFAULT false,
  has_cash_van boolean DEFAULT false,
  features jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Supplier subscriptions
CREATE TABLE public.supplier_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  status text NOT NULL DEFAULT 'pending', -- pending, active, expired, cancelled
  start_date date,
  end_date date,
  auto_renew boolean DEFAULT true,
  payment_method text DEFAULT 'bank_transfer',
  total_paid numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contracts table
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.supplier_subscriptions(id),
  contract_number text,
  title_ar text NOT NULL,
  terms_ar text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  value numeric DEFAULT 0,
  status text DEFAULT 'draft', -- draft, active, expired, terminated
  signed_at timestamptz,
  signed_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contract number auto-generation
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.contract_number := 'CTR-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_contract_number
  BEFORE INSERT ON public.contracts
  FOR EACH ROW
  WHEN (NEW.contract_number IS NULL)
  EXECUTE FUNCTION public.generate_contract_number();

-- Subscription payments/invoices
CREATE TABLE public.subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.supplier_subscriptions(id),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id),
  amount numeric NOT NULL,
  status text DEFAULT 'pending', -- pending, paid, overdue
  due_date date NOT NULL,
  paid_at timestamptz,
  invoice_number text,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON public.subscription_invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION public.generate_invoice_number();

-- RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Plans: everyone can view, admins manage
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans FOR SELECT USING (active = true);
CREATE POLICY "Admins manage plans" ON public.subscription_plans FOR ALL USING (is_admin());

-- Subscriptions: admins manage all, suppliers view own
CREATE POLICY "Admins manage subscriptions" ON public.supplier_subscriptions FOR ALL USING (is_admin());
CREATE POLICY "Suppliers view own subscription" ON public.supplier_subscriptions FOR SELECT USING (is_supplier() AND supplier_id = get_user_supplier_id());

-- Contracts: admins manage, suppliers view own
CREATE POLICY "Admins manage contracts" ON public.contracts FOR ALL USING (is_admin());
CREATE POLICY "Suppliers view own contracts" ON public.contracts FOR SELECT USING (is_supplier() AND supplier_id = get_user_supplier_id());

-- Invoices: admins manage, suppliers view own
CREATE POLICY "Admins manage invoices" ON public.subscription_invoices FOR ALL USING (is_admin());
CREATE POLICY "Suppliers view own invoices" ON public.subscription_invoices FOR SELECT USING (is_supplier() AND supplier_id = get_user_supplier_id());

-- Update triggers
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_supplier_subscriptions_updated_at BEFORE UPDATE ON public.supplier_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
