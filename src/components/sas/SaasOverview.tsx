import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Users, Globe, DollarSign, FileText, Receipt, Server, Activity } from "lucide-react";
import { motion } from "framer-motion";
const SaasOverview: React.FC = () => {
  const [stats, setStats] = useState({
    suppliers: 0, activeSuppliers: 0, subscriptions: 0, storefronts: 0,
    contracts: 0, invoicesPending: 0, totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [sup, subs, sf, cont, inv] = await Promise.all([
        supabase.from('suppliers').select('id, active', { count: 'exact' }),
        supabase.from('supplier_subscriptions').select('id, status', { count: 'exact' }),
        supabase.from('storefronts').select('id', { count: 'exact' }),
        supabase.from('contracts').select('id', { count: 'exact' }),
        supabase.from('subscription_invoices').select('id, status, amount'),
      ]);

      const activeCount = sup.data?.filter(s => s.active).length ?? 0;
      const pendingInv = inv.data?.filter(i => i.status === 'pending').length ?? 0;
      const totalRev = inv.data?.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0) ?? 0;

      setStats({
        suppliers: sup.count ?? 0,
        activeSuppliers: activeCount,
        subscriptions: subs.count ?? 0,
        storefronts: sf.count ?? 0,
        contracts: cont.count ?? 0,
        invoicesPending: pendingInv,
        totalRevenue: totalRev,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">نظرة عامة — منصة SaaS</h1>
        <p className="text-muted-foreground text-sm mt-1">ملخص شامل لحالة المنصة والخدمات</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الموردين" value={stats.suppliers} icon={Users} trend={`${stats.activeSuppliers} نشط`} />
        <StatCard title="الاشتراكات" value={stats.subscriptions} icon={Crown} />
        <StatCard title="واجهات المتاجر" value={stats.storefronts} icon={Globe} />
        <StatCard title="العقود" value={stats.contracts} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <p className="font-display font-bold text-xl text-foreground">{stats.totalRevenue.toLocaleString()} ر.س</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">فواتير معلّقة</p>
              <p className="font-display font-bold text-xl text-foreground">{stats.invoicesPending}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">حالة النظام</p>
              <p className="font-display font-bold text-xl text-success">يعمل بكفاءة ✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "إضافة مشترك", icon: Crown, color: "bg-primary" },
            { label: "إنشاء عقد", icon: FileText, color: "bg-accent-water" },
            { label: "إنشاء فاتورة", icon: Receipt, color: "bg-success" },
            { label: "نسخ احتياطي", icon: Server, color: "bg-warning" },
          ].map((a, i) => (
            <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-arabic text-muted-foreground">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaasOverview;
