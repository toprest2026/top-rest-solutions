
-- 1. Add onboarding fields to suppliers
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'company',
  ADD COLUMN IF NOT EXISTS has_vat boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vat_number text,
  ADD COLUMN IF NOT EXISTS cr_number text,
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS iban text,
  ADD COLUMN IF NOT EXISTS iban_certificate_url text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS national_address text,
  ADD COLUMN IF NOT EXISTS onboarding_status text DEFAULT 'draft';

-- 2. Supplier delegates (authorized persons)
CREATE TABLE IF NOT EXISTS public.supplier_delegates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  national_id text,
  nationality text DEFAULT 'سعودي',
  phone text,
  phone_verified boolean DEFAULT false,
  email text,
  role_title text,
  is_contract_signee boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.supplier_delegates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage delegates" ON public.supplier_delegates FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Suppliers view own delegates" ON public.supplier_delegates FOR SELECT TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));

-- 3. Supplier documents
CREATE TABLE IF NOT EXISTS public.supplier_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_url text,
  uploaded_at timestamptz DEFAULT now()
);
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage documents" ON public.supplier_documents FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Suppliers view own documents" ON public.supplier_documents FOR SELECT TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));

-- 4. Supplier profit models (financial engine)
CREATE TABLE IF NOT EXISTS public.supplier_profit_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE UNIQUE,
  model_type text NOT NULL DEFAULT 'commission',
  commission_rate numeric(5,2) DEFAULT 0,
  commission_fixed numeric(10,2) DEFAULT 0,
  subscription_main_branch numeric(10,2) DEFAULT 0,
  subscription_extra_branch numeric(10,2) DEFAULT 0,
  dropshipping_margin_type text DEFAULT 'percentage',
  dropshipping_margin_value numeric(10,2) DEFAULT 0,
  cash_commission_rate numeric(5,2) DEFAULT 0,
  bnpl_fee_rate numeric(5,2) DEFAULT 0,
  bnpl_fee_bearer text DEFAULT 'supplier',
  settlement_cycle text DEFAULT 'monthly',
  credit_limit numeric(12,2) DEFAULT 0,
  warehouse_count int DEFAULT 1,
  status text DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.supplier_profit_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage profit models" ON public.supplier_profit_models FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Suppliers view own profit model" ON public.supplier_profit_models FOR SELECT TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));
