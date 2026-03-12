import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Truck, MapPin, Plus, Search, Eye, Edit, UserCheck, Navigation, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Driver {
  id: string;
  full_name: string;
  phone: string | null;
  driver_type: string;
  city: string | null;
  status: string;
  vehicle_plate: string | null;
  wallet_balance: number;
  total_deliveries: number;
  rating: number;
  supplier_id: string | null;
}

const driverTypeLabels: Record<string, { label: string; color: string }> = {
  independent: { label: "مستقل", color: "bg-primary/10 text-primary" },
  marketplace: { label: "سوق مركزي", color: "bg-accent-water/10 text-accent-water" },
  cash_van: { label: "كاش فان", color: "bg-warning/10 text-warning" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "نشط", color: "bg-success/10 text-success" },
  inactive: { label: "غير نشط", color: "bg-muted text-muted-foreground" },
  suspended: { label: "موقوف", color: "bg-destructive/10 text-destructive" },
};

const DriversManager: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: "", phone: "", driver_type: "marketplace", city: "", vehicle_plate: "",
  });

  const fetchDrivers = async () => {
    let query = supabase.from("drivers").select("*").order("created_at", { ascending: false });
    if (filterType !== "all") query = query.eq("driver_type", filterType);
    const { data } = await query;
    setDrivers((data as Driver[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchDrivers(); }, [filterType]);

  const handleAdd = async () => {
    if (!form.full_name) { toast({ title: "خطأ", description: "الاسم مطلوب", variant: "destructive" }); return; }
    const { error } = await supabase.from("drivers").insert({
      full_name: form.full_name,
      phone: form.phone || null,
      driver_type: form.driver_type,
      city: form.city || null,
      vehicle_plate: form.vehicle_plate || null,
    });
    if (error) { toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    toast({ title: "تم بنجاح", description: "تمت إضافة السائق" });
    setShowForm(false);
    setForm({ full_name: "", phone: "", driver_type: "marketplace", city: "", vehicle_plate: "" });
    fetchDrivers();
  };

  const filtered = drivers.filter(d => d.full_name.includes(search) || d.phone?.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة السائقين</h1>
          <p className="text-muted-foreground text-sm mt-1">السائقون المستقلون، سائقو السوق المركزي، وكاش فان</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة سائق
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Truck className="w-6 h-6 text-accent-water mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{drivers.length}</p>
          <p className="text-xs text-muted-foreground">إجمالي السائقين</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <UserCheck className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-success">{drivers.filter(d => d.status === "active").length}</p>
          <p className="text-xs text-muted-foreground">نشط</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Navigation className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{drivers.reduce((s, d) => s + d.total_deliveries, 0)}</p>
          <p className="text-xs text-muted-foreground">إجمالي التوصيلات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Wallet className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{drivers.reduce((s, d) => s + (d.wallet_balance || 0), 0).toLocaleString()} ر.س</p>
          <p className="text-xs text-muted-foreground">إجمالي المحافظ</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold text-foreground mb-4">إضافة سائق جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">الاسم الكامل *</label>
              <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">رقم الجوال</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">نوع السائق</label>
              <select value={form.driver_type} onChange={e => setForm(p => ({ ...p, driver_type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm">
                <option value="independent">مستقل (متجر خاص)</option>
                <option value="marketplace">سوق مركزي (مورد مشترك)</option>
                <option value="cash_van">كاش فان (متجول)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">المدينة</label>
              <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">لوحة المركبة</label>
              <input value={form.vehicle_plate} onChange={e => setForm(p => ({ ...p, vehicle_plate: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-xl border border-border text-muted-foreground">إلغاء</button>
            <button onClick={handleAdd} className="btn-primary px-5 py-2 text-sm rounded-xl">حفظ</button>
          </div>
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {[
            { id: "all", label: "الكل" },
            { id: "independent", label: "مستقل" },
            { id: "marketplace", label: "سوق مركزي" },
            { id: "cash_van", label: "كاش فان" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterType === f.id ? "bg-accent-water text-white" : "bg-muted text-muted-foreground"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)}
            className="search-input pr-9 w-48 text-xs" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl p-5">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا يوجد سائقون</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الاسم</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الجوال</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">النوع</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">المدينة</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الحالة</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">التوصيلات</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">التقييم</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">المحفظة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const typeInfo = driverTypeLabels[d.driver_type] || driverTypeLabels.marketplace;
                  const statusInfo = statusLabels[d.status] || statusLabels.active;
                  return (
                    <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 px-3 text-foreground font-bold">{d.full_name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono text-xs">{d.phone || "—"}</td>
                      <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeInfo.color}`}>{typeInfo.label}</span></td>
                      <td className="py-2.5 px-3 text-muted-foreground">{d.city || "—"}</td>
                      <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.color}`}>{statusInfo.label}</span></td>
                      <td className="py-2.5 px-3 text-foreground">{d.total_deliveries}</td>
                      <td className="py-2.5 px-3 text-warning font-bold">⭐ {d.rating}</td>
                      <td className="py-2.5 px-3 text-foreground">{(d.wallet_balance || 0).toLocaleString()} ر.س</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversManager;
