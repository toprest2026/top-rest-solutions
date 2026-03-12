-- جدول السائقين
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  national_id text,
  driver_type text NOT NULL DEFAULT 'marketplace',
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  region_id uuid REFERENCES public.regions(id) ON DELETE SET NULL,
  city text,
  status text NOT NULL DEFAULT 'active',
  vehicle_type text DEFAULT 'van',
  vehicle_plate text,
  license_expiry date,
  wallet_balance numeric DEFAULT 0,
  total_deliveries integer DEFAULT 0,
  rating numeric DEFAULT 5.0,
  latitude numeric,
  longitude numeric,
  last_location_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage drivers" ON public.drivers FOR ALL TO public USING (is_admin());
CREATE POLICY "Suppliers view own drivers" ON public.drivers FOR SELECT TO public USING (is_supplier() AND supplier_id = get_user_supplier_id());

-- جدول الوسائط المركزي
CREATE TABLE public.media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text DEFAULT 'image',
  file_size bigint DEFAULT 0,
  folder text DEFAULT 'general',
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage media" ON public.media_files FOR ALL TO public USING (is_admin());
CREATE POLICY "Suppliers view own media" ON public.media_files FOR SELECT TO public USING (is_supplier() AND supplier_id = get_user_supplier_id());

ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;