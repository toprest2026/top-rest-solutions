import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Globe, Store, Plus, Eye, Settings, Trash2, ExternalLink, Loader2,
  CheckCircle2, Clock, AlertTriangle, XCircle, Palette, X
} from "lucide-react";

interface Storefront {
  id: string;
  supplier_id: string;
  storefront_type: string;
  subdomain: string | null;
  custom_domain: string | null;
  theme: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  status: string;
  activated_at: string | null;
  created_at: string | null;
  suppliers?: { name_ar: string } | null;
}

interface Supplier {
  id: string;
  name_ar: string;
}

const themes = [
  { id: "fast", name: "السريع", desc: "واجهة بسيطة وسريعة للطلب المباشر", color: "from-primary to-accent" },
  { id: "wholesale", name: "الجملة", desc: "تصميم مخصص لعملاء الجملة والمحلات", color: "from-emerald-500 to-teal-600" },
  { id: "luxury", name: "الفاخر", desc: "واجهة أنيقة وفاخرة للعلامات المميزة", color: "from-amber-500 to-orange-600" },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  pending: { label: "بانتظار التفعيل", icon: Clock, cls: "text-warning bg-warning/10 border-warning/30" },
  active: { label: "نشط", icon: CheckCircle2, cls: "text-success bg-success/10 border-success/30" },
  dns_pending: { label: "بانتظار DNS", icon: AlertTriangle, cls: "text-accent-water bg-accent-water/10 border-accent-water/30" },
  suspended: { label: "معلّق", icon: XCircle, cls: "text-destructive bg-destructive/10 border-destructive/30" },
};

const StorefrontsManager: React.FC = () => {
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    supplier_id: "",
    storefront_type: "subdomain",
    subdomain: "",
    custom_domain: "",
    theme: "fast",
    primary_color: "#0ea5e9",
    secondary_color: "#1e293b",
  });

  const fetchData = async () => {
    setLoading(true);
    const [sfRes, supRes] = await Promise.all([
      supabase.from("storefronts").select("*, suppliers(name_ar)").order("created_at", { ascending: false }),
      supabase.from("suppliers").select("id, name_ar").order("name_ar"),
    ]);
    if (sfRes.data) setStorefronts(sfRes.data as any);
    if (supRes.data) setSuppliers(supRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.supplier_id) {
      toast({ title: "خطأ", description: "يرجى اختيار المورد", variant: "destructive" });
      return;
    }
    if (form.storefront_type === "subdomain" && !form.subdomain) {
      toast({ title: "خطأ", description: "يرجى إدخال الرابط الفرعي", variant: "destructive" });
      return;
    }
    if (form.storefront_type === "custom_domain" && !form.custom_domain) {
      toast({ title: "خطأ", description: "يرجى إدخال النطاق المستقل", variant: "destructive" });
      return;
    }

    setSaving(true);
    const insertData: any = {
      supplier_id: form.supplier_id,
      storefront_type: form.storefront_type,
      theme: form.theme,
      primary_color: form.primary_color,
      secondary_color: form.secondary_color,
      status: form.storefront_type === "custom_domain" ? "dns_pending" : "pending",
    };
    if (form.storefront_type === "subdomain") insertData.subdomain = form.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");
    else insertData.custom_domain = form.custom_domain.toLowerCase();

    const { error } = await supabase.from("storefronts").insert(insertData);

    // Auto-create DNS ticket if custom domain
    if (!error && form.storefront_type === "custom_domain") {
      const supplier = suppliers.find(s => s.id === form.supplier_id);
      await supabase.from("support_tickets").insert({
        supplier_id: form.supplier_id,
        title: `طلب تفعيل DNS للشريك: ${supplier?.name_ar ?? ""}`,
        description: `النطاق المطلوب: ${form.custom_domain}\nيرجى إعداد سجلات DNS وتوجيهها.`,
        ticket_type: "dns_activation",
        priority: "high",
      });
    }

    setSaving(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم", description: form.storefront_type === "custom_domain" ? "تم إنشاء الواجهة وفتح تذكرة DNS تلقائياً" : "تم إنشاء واجهة المتجر" });
      setShowAdd(false);
      setForm({ supplier_id: "", storefront_type: "subdomain", subdomain: "", custom_domain: "", theme: "fast", primary_color: "#0ea5e9", secondary_color: "#1e293b" });
      fetchData();
    }
  };

  const handleActivate = async (id: string) => {
    await supabase.from("storefronts").update({ status: "active", activated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "تم التفعيل", description: "تم تفعيل واجهة المتجر بنجاح" });
    fetchData();
  };

  const handleSuspend = async (id: string) => {
    await supabase.from("storefronts").update({ status: "suspended" }).eq("id", id);
    toast({ title: "تم التعليق", description: "تم تعليق واجهة المتجر" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("storefronts").delete().eq("id", id);
    toast({ title: "تم الحذف" });
    fetchData();
  };

  const getSupplierName = (sf: Storefront) => {
    if (sf.suppliers && typeof sf.suppliers === 'object' && 'name_ar' in sf.suppliers) return sf.suppliers.name_ar;
    return suppliers.find(s => s.id === sf.supplier_id)?.name_ar ?? "—";
  };

  const getUrl = (sf: Storefront) => {
    if (sf.storefront_type === "custom_domain" && sf.custom_domain) return `https://${sf.custom_domain}`;
    if (sf.subdomain) return `https://${sf.subdomain}.toprest.sa`;
    return "#";
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const stats = {
    total: storefronts.length,
    active: storefronts.filter(s => s.status === "active").length,
    pending: storefronts.filter(s => s.status === "pending" || s.status === "dns_pending").length,
    suspended: storefronts.filter(s => s.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            إدارة واجهات الشركاء
          </h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            إدارة متاجر الموردين — النطاقات والقوالب والتفعيل
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          إنشاء واجهة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الواجهات", value: stats.total, color: "text-foreground" },
          { label: "نشطة", value: stats.active, color: "text-success" },
          { label: "بانتظار التفعيل", value: stats.pending, color: "text-warning" },
          { label: "معلّقة", value: stats.suspended, color: "text-destructive" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-2xl font-display font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-arabic mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Storefronts Grid */}
      {storefronts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-arabic">لا توجد واجهات متاجر حتى الآن</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary px-6 py-2 text-sm rounded-xl mt-4">إنشاء واجهة أولى</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {storefronts.map((sf) => {
            const st = statusConfig[sf.status] ?? statusConfig.pending;
            const StatusIcon = st.icon;
            const themeDef = themes.find(t => t.id === sf.theme) ?? themes[0];
            return (
              <div key={sf.id} className="glass-card rounded-2xl overflow-hidden group">
                {/* Theme banner */}
                <div className={`h-20 bg-gradient-to-l ${themeDef.color} relative flex items-end p-3`}>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-lg">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{getSupplierName(sf)}</p>
                      <p className="text-white/70 text-xs">{themeDef.name}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* URL */}
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-mono text-foreground truncate">{getUrl(sf).replace("https://", "")}</span>
                    <a href={getUrl(sf)} target="_blank" rel="noreferrer" className="mr-auto">
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                    </a>
                  </div>

                  {/* Status + Type */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${st.cls}`}>
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                      {sf.storefront_type === "custom_domain" ? "نطاق خاص" : "رابط فرعي"}
                    </span>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                    <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: sf.primary_color ?? "#0ea5e9" }} />
                    <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: sf.secondary_color ?? "#1e293b" }} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    {sf.status !== "active" && (
                      <button onClick={() => handleActivate(sf.id)} className="flex-1 btn-primary py-1.5 text-xs rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        تفعيل
                      </button>
                    )}
                    {sf.status === "active" && (
                      <button onClick={() => handleSuspend(sf.id)} className="flex-1 py-1.5 text-xs rounded-lg border border-warning text-warning hover:bg-warning/10 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        تعليق
                      </button>
                    )}
                    <button onClick={() => handleDelete(sf.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg shadow-water-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                إنشاء واجهة متجر جديدة
              </h3>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-5">
              {/* Supplier */}
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">المورد / الشريك *</label>
                <select value={form.supplier_id} onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))} className="search-input">
                  <option value="">اختر الشريك</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
                </select>
              </div>

              {/* Storefront Type */}
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-2 block">نوع الواجهة *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, storefront_type: "subdomain" }))}
                    className={`p-3 rounded-xl border-2 text-right transition-all ${form.storefront_type === "subdomain" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <p className="font-bold text-sm text-foreground">رابط ضمن المنصة</p>
                    <p className="text-xs text-muted-foreground mt-1">مجاني وسريع</p>
                    <p className="text-xs text-primary font-mono mt-1">name.toprest.sa</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, storefront_type: "custom_domain" }))}
                    className={`p-3 rounded-xl border-2 text-right transition-all ${form.storefront_type === "custom_domain" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <p className="font-bold text-sm text-foreground">نطاق خاص مستقل</p>
                    <p className="text-xs text-muted-foreground mt-1">يتطلب إعدادات DNS</p>
                    <p className="text-xs text-primary font-mono mt-1">name.com</p>
                  </button>
                </div>
              </div>

              {/* Domain input */}
              {form.storefront_type === "subdomain" ? (
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الرابط الفرعي *</label>
                  <div className="flex items-center gap-1">
                    <input value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))} className="search-input flex-1" placeholder="almanhal" dir="ltr" />
                    <span className="text-xs text-muted-foreground font-mono">.toprest.sa</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">النطاق المستقل *</label>
                  <input value={form.custom_domain} onChange={e => setForm(f => ({ ...f, custom_domain: e.target.value }))} className="search-input" placeholder="almanhal.com" dir="ltr" />
                  <p className="text-xs text-warning mt-1 font-arabic">⚠️ سيتم فتح تذكرة DNS تلقائياً بعد الإنشاء</p>
                </div>
              )}

              {/* Theme */}
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-2 block">القالب *</label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, theme: t.id }))}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${form.theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                    >
                      <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${t.color} mb-2`} />
                      <p className="font-bold text-xs text-foreground">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">اللون الأساسي</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.primary_color} onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))} className="w-8 h-8 rounded border-0 cursor-pointer" />
                    <span className="text-xs font-mono text-muted-foreground">{form.primary_color}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">اللون الثانوي</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.secondary_color} onChange={e => setForm(f => ({ ...f, secondary_color: e.target.value }))} className="w-8 h-8 rounded border-0 cursor-pointer" />
                    <span className="text-xs font-mono text-muted-foreground">{form.secondary_color}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm rounded-xl flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                إنشاء الواجهة
              </button>
              <button onClick={() => setShowAdd(false)} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontsManager;
