
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, MapPin, Phone, Mail, Truck, Edit2, Trash2, Factory, Building2, Loader2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SupplierOnboardingWizard from "./supplier-onboarding/SupplierOnboardingWizard";

interface Supplier {
  id: string;
  name_ar: string;
  name_en: string | null;
  phone: string | null;
  email: string | null;
  business_type: string | null;
  has_vat: boolean | null;
  cr_number: string | null;
  bank_name: string | null;
  onboarding_status: string | null;
  active: boolean | null;
  region_id: string | null;
  regions?: { name_ar: string } | null;
}

const businessTypeLabels: Record<string, { label: string; icon: React.ElementType }> = {
  factory: { label: 'مصنع', icon: Factory },
  company: { label: 'مؤسسة/شركة', icon: Building2 },
  cash_van: { label: 'كاش فان', icon: Truck },
};

const SuppliersManager: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data } = await supabase.from('suppliers').select('*, regions(name_ar)').order('created_at', { ascending: false });
    if (data) setSuppliers(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from('suppliers').delete().eq('id', id);
    toast({ title: 'تم الحذف' });
    fetchSuppliers();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة الموردين</h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {suppliers.filter(s => s.active).length} مورد نشط من أصل {suppliers.length}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          تسجيل مورد جديد
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {suppliers.map(supplier => {
          const bt = businessTypeLabels[supplier.business_type ?? 'company'] ?? businessTypeLabels.company;
          const BtIcon = bt.icon;
          return (
            <div key={supplier.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-water flex items-center justify-center flex-shrink-0">
                    <BtIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{supplier.name_ar}</h3>
                    <p className="text-muted-foreground text-xs font-arabic flex items-center gap-1">
                      {bt.label}
                      {supplier.cr_number && <span className="text-[10px]">• CR: {supplier.cr_number}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    supplier.active ? 'badge-success' : 
                    supplier.onboarding_status === 'pending' ? 'bg-warning/10 text-warning border border-warning/30' :
                    'text-destructive bg-destructive/10 border border-destructive/30'
                  }`}>
                    {supplier.active ? 'نشط' : supplier.onboarding_status === 'pending' ? 'بانتظار المراجعة' : 'مسودة'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-accent-water" />
                    <span className="text-muted-foreground">{supplier.phone}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-accent-water" />
                    <span className="text-muted-foreground">{supplier.email}</span>
                  </div>
                )}
                {supplier.bank_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-3.5 h-3.5 text-accent-water" />
                    <span className="text-muted-foreground">{supplier.bank_name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-outline-water py-2 text-xs rounded-lg flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  عرض التفاصيل
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {suppliers.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-arabic">لا يوجد موردين مسجلين</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary px-6 py-2 text-sm rounded-xl mt-4">تسجيل أول مورد</button>
        </div>
      )}

      {showAdd && (
        <SupplierOnboardingWizard
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); fetchSuppliers(); }}
        />
      )}
    </div>
  );
};

export default SuppliersManager;
