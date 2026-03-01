import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Users, FileText, Plus, Eye, Edit2, Trash2, CheckCircle, XCircle, Clock, CreditCard, Star, Zap, Rocket, RefreshCw, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Plan {
  id: string;
  name_ar: string;
  price_monthly: number;
  price_yearly: number | null;
  max_products: number;
  max_orders: number;
  has_custom_domain: boolean;
  has_dedicated_page: boolean;
  has_driver_radar: boolean;
  has_cash_van: boolean;
  features: string[];
  active: boolean;
}

interface Subscription {
  id: string;
  supplier_id: string;
  plan_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  auto_renew: boolean;
  total_paid: number;
  created_at: string;
  suppliers: { name_ar: string; phone: string | null; email: string | null } | null;
  subscription_plans: { name_ar: string; price_monthly: number } | null;
}

const planIcons = [Star, Zap, Rocket];

const SubscriptionsManager: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<"plans" | "subscribers">("plans");
  const [loading, setLoading] = useState(true);
  const [showAddSub, setShowAddSub] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name_ar: string }[]>([]);
  const [newSub, setNewSub] = useState({ supplier_id: "", plan_id: "", months: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [plansRes, subsRes, suppliersRes] = await Promise.all([
      supabase.from("subscription_plans").select("*").order("sort_order"),
      supabase.from("supplier_subscriptions").select("*, suppliers(name_ar, phone, email), subscription_plans(name_ar, price_monthly)").order("created_at", { ascending: false }),
      supabase.from("suppliers").select("id, name_ar").eq("active", true),
    ]);
    if (plansRes.data) setPlans(plansRes.data.map(p => ({ ...p, features: (p.features as string[]) || [] })));
    if (subsRes.data) setSubscriptions(subsRes.data as unknown as Subscription[]);
    if (suppliersRes.data) setSuppliers(suppliersRes.data);
    setLoading(false);
  };

  const handleCreateSubscription = async () => {
    if (!newSub.supplier_id || !newSub.plan_id) {
      toast.error("اختر المورد والباقة");
      return;
    }
    const plan = plans.find(p => p.id === newSub.plan_id);
    if (!plan) return;

    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + newSub.months * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const { error } = await supabase.from("supplier_subscriptions").insert({
      supplier_id: newSub.supplier_id,
      plan_id: newSub.plan_id,
      status: "active",
      start_date: startDate,
      end_date: endDate,
      total_paid: plan.price_monthly * newSub.months,
    });

    if (error) {
      toast.error("خطأ في إنشاء الاشتراك");
      console.error(error);
    } else {
      toast.success("تم إنشاء الاشتراك بنجاح");
      setShowAddSub(false);
      setNewSub({ supplier_id: "", plan_id: "", months: 1 });
      fetchData();
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      active: { class: "badge-success", label: "نشط" },
      pending: { class: "badge-warning", label: "معلق" },
      expired: { class: "text-destructive bg-destructive/10 border border-destructive/30", label: "منتهي" },
      cancelled: { class: "text-muted-foreground bg-muted border border-border", label: "ملغي" },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.class}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent-water border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground flex items-center gap-2">
            <Crown className="w-6 h-6 text-accent-water" />
            إدارة الاشتراكات — SaaS
          </h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {subscriptions.filter(s => s.status === "active").length} مشترك نشط — {plans.length} باقات
          </p>
        </div>
        <button
          onClick={() => setShowAddSub(true)}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          إضافة مشترك
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "plans" as const, label: "الباقات", icon: CreditCard },
          { id: "subscribers" as const, label: "المشتركين", icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-arabic transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = planIcons[i] || Star;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-6 relative overflow-hidden ${
                  i === 1 ? "border-2 border-accent-water ring-2 ring-accent-water/20" : ""
                }`}
              >
                {i === 1 && (
                  <div className="absolute top-0 left-0 right-0 bg-accent-water text-white text-xs text-center py-1 font-bold">
                    الأكثر طلباً
                  </div>
                )}
                <div className={`mt-${i === 1 ? 4 : 0}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      i === 0 ? "bg-muted" : i === 1 ? "bg-accent-water/20" : "bg-primary/20"
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        i === 0 ? "text-muted-foreground" : i === 1 ? "text-accent-water" : "text-primary"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{plan.name_ar}</h3>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-black text-primary">{plan.price_monthly}</span>
                      <span className="text-sm text-muted-foreground">ر.س / شهرياً</span>
                    </div>
                    {plan.price_yearly && (
                      <p className="text-xs text-accent-water mt-1">أو {plan.price_yearly} ر.س / سنوياً (وفر {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%)</p>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className={`flex items-center gap-1 ${plan.has_custom_domain ? "text-success" : "text-muted-foreground"}`}>
                      {plan.has_custom_domain ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      دومين مستقل
                    </div>
                    <div className={`flex items-center gap-1 ${plan.has_dedicated_page ? "text-success" : "text-muted-foreground"}`}>
                      {plan.has_dedicated_page ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      صفحة مستقلة
                    </div>
                    <div className={`flex items-center gap-1 ${plan.has_driver_radar ? "text-success" : "text-muted-foreground"}`}>
                      {plan.has_driver_radar ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      رادار السواقين
                    </div>
                    <div className={`flex items-center gap-1 ${plan.has_cash_van ? "text-success" : "text-muted-foreground"}`}>
                      {plan.has_cash_van ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      كاش فان
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 btn-outline-water py-2 text-xs rounded-lg flex items-center justify-center gap-1">
                      <Edit2 className="w-3 h-3" />
                      تعديل
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === "subscribers" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {subscriptions.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-arabic">لا يوجد مشتركين حالياً</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>المورد</th>
                    <th>الباقة</th>
                    <th>الحالة</th>
                    <th>تاريخ البداية</th>
                    <th>تاريخ الانتهاء</th>
                    <th>المبلغ المدفوع</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map(sub => (
                    <tr key={sub.id}>
                      <td>
                        <div>
                          <p className="font-semibold text-foreground">{sub.suppliers?.name_ar || "—"}</p>
                          <p className="text-xs text-muted-foreground">{sub.suppliers?.email}</p>
                        </div>
                      </td>
                      <td>
                        <span className="badge-primary px-2 py-0.5 rounded-full text-xs font-bold">
                          {sub.subscription_plans?.name_ar || "—"}
                        </span>
                      </td>
                      <td>{statusBadge(sub.status)}</td>
                      <td className="text-sm text-muted-foreground">{sub.start_date || "—"}</td>
                      <td className="text-sm text-muted-foreground">{sub.end_date || "—"}</td>
                      <td className="font-bold text-primary">{sub.total_paid} ر.س</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-accent-water transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Add Subscription Modal */}
      {showAddSub && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-water-xl">
            <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent-water" />
              إضافة مشترك جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">المورد</label>
                <select
                  className="search-input"
                  value={newSub.supplier_id}
                  onChange={e => setNewSub(s => ({ ...s, supplier_id: e.target.value }))}
                >
                  <option value="">اختر المورد...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name_ar}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">الباقة</label>
                <select
                  className="search-input"
                  value={newSub.plan_id}
                  onChange={e => setNewSub(s => ({ ...s, plan_id: e.target.value }))}
                >
                  <option value="">اختر الباقة...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name_ar} — {p.price_monthly} ر.س/شهر</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">مدة الاشتراك (أشهر)</label>
                <select
                  className="search-input"
                  value={newSub.months}
                  onChange={e => setNewSub(s => ({ ...s, months: Number(e.target.value) }))}
                >
                  {[1, 3, 6, 12].map(m => (
                    <option key={m} value={m}>{m} {m === 1 ? "شهر" : "أشهر"}</option>
                  ))}
                </select>
              </div>
              {newSub.plan_id && (
                <div className="bg-muted rounded-xl p-3 text-sm">
                  <p className="text-muted-foreground">الإجمالي المطلوب:</p>
                  <p className="text-xl font-display font-black text-primary">
                    {(plans.find(p => p.id === newSub.plan_id)?.price_monthly || 0) * newSub.months} ر.س
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateSubscription} className="btn-primary flex-1 py-2.5 text-sm rounded-xl">
                تفعيل الاشتراك
              </button>
              <button
                onClick={() => setShowAddSub(false)}
                className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsManager;
