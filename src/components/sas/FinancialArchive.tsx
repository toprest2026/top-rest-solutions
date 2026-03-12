import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, TrendingUp, DollarSign, Download, Filter, Calendar, PieChart } from "lucide-react";

const FinancialArchive: React.FC = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalCommissions: 0, totalInvoices: 0, pendingAmount: 0 });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    const fetch = async () => {
      const { data: invData } = await supabase
        .from("subscription_invoices")
        .select("*, suppliers(name_ar)")
        .order("created_at", { ascending: false })
        .limit(50);

      const invoicesList = invData || [];
      setInvoices(invoicesList);

      const total = invoicesList.reduce((s: number, i: any) => s + (i.amount || 0), 0);
      const paid = invoicesList.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + (i.amount || 0), 0);
      const pending = invoicesList.filter((i: any) => i.status === "pending").reduce((s: number, i: any) => s + (i.amount || 0), 0);

      setStats({
        totalRevenue: paid,
        totalCommissions: Math.round(paid * 0.12),
        totalInvoices: invoicesList.length,
        pendingAmount: pending,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      paid: { color: "bg-success/10 text-success", label: "مدفوعة" },
      pending: { color: "bg-warning/10 text-warning", label: "معلّقة" },
      overdue: { color: "bg-destructive/10 text-destructive", label: "متأخرة" },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.color}`}>{s.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">الأرشيف المالي</h1>
          <p className="text-muted-foreground text-sm mt-1">مركز مالي متكامل لمراقبة الأرباح والعمولات والفواتير</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
          <Download className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <DollarSign className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{stats.totalRevenue.toLocaleString()} ر.س</p>
          <p className="text-xs text-muted-foreground">إجمالي الإيرادات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-accent-water mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{stats.totalCommissions.toLocaleString()} ر.س</p>
          <p className="text-xs text-muted-foreground">صافي العمولات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Receipt className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{stats.totalInvoices}</p>
          <p className="text-xs text-muted-foreground">إجمالي الفواتير</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <PieChart className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-warning">{stats.pendingAmount.toLocaleString()} ر.س</p>
          <p className="text-xs text-muted-foreground">مبالغ معلّقة</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2">
        {[
          { id: "week", label: "أسبوع" },
          { id: "month", label: "شهر" },
          { id: "quarter", label: "ربع سنوي" },
          { id: "year", label: "سنوي" },
        ].map(p => (
          <button key={p.id} onClick={() => setPeriod(p.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              period === p.id ? "bg-accent-water text-white" : "bg-muted text-muted-foreground"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">سجل الفواتير</h3>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">جاري التحميل...</p>
        ) : invoices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا توجد فواتير</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">رقم الفاتورة</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">المورد</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">المبلغ</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">تاريخ الاستحقاق</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-mono text-xs text-accent-water">{inv.invoice_number || "—"}</td>
                    <td className="py-2.5 px-3 text-foreground">{inv.suppliers?.name_ar || "—"}</td>
                    <td className="py-2.5 px-3 text-foreground font-bold">{inv.amount?.toLocaleString()} ر.س</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">{inv.due_date}</td>
                    <td className="py-2.5 px-3">{statusBadge(inv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialArchive;
