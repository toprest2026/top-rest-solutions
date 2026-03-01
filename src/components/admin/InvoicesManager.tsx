import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, CheckCircle, Clock, AlertTriangle, Download, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Invoice {
  id: string;
  invoice_number: string | null;
  amount: number;
  due_date: string;
  status: string;
  paid_at: string | null;
  created_at: string | null;
  suppliers: { name_ar: string } | null;
  supplier_subscriptions: { status: string; subscription_plans: { name_ar: string } | null } | null;
}

const InvoicesManager: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("subscription_invoices")
      .select("*, suppliers(name_ar), supplier_subscriptions(status, subscription_plans(name_ar))")
      .order("created_at", { ascending: false });
    if (data) setInvoices(data as unknown as Invoice[]);
    setLoading(false);
  };

  const statusConfig: Record<string, { icon: React.ElementType; class: string; label: string }> = {
    pending: { icon: Clock, class: "badge-warning", label: "بانتظار الدفع" },
    paid: { icon: CheckCircle, class: "badge-success", label: "مدفوعة" },
    overdue: { icon: AlertTriangle, class: "text-destructive bg-destructive/10 border border-destructive/30", label: "متأخرة" },
  };

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);
  const totalPending = invoices.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent-water border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-black text-foreground flex items-center gap-2">
          <Receipt className="w-6 h-6 text-accent-water" />
          فواتير الاشتراكات
        </h2>
        <p className="text-muted-foreground text-sm font-arabic mt-1">
          {invoices.length} فاتورة — {invoices.filter(i => i.status === "pending").length} بانتظار الدفع
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "إجمالي المحصّل", value: `${totalPaid} ر.س`, color: "text-success" },
          { label: "بانتظار التحصيل", value: `${totalPending} ر.س`, color: "text-warning" },
          { label: "إجمالي الفواتير", value: invoices.length, color: "text-accent-water" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "الكل" },
          { id: "pending", label: "بانتظار الدفع" },
          { id: "paid", label: "مدفوعة" },
          { id: "overdue", label: "متأخرة" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-arabic transition-all ${
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-arabic">لا توجد فواتير</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>المورد</th>
                  <th>الباقة</th>
                  <th>المبلغ</th>
                  <th>تاريخ الاستحقاق</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const sc = statusConfig[inv.status] || statusConfig.pending;
                  return (
                    <tr key={inv.id}>
                      <td className="font-mono text-xs text-accent-water">{inv.invoice_number || "—"}</td>
                      <td className="font-semibold text-foreground">{inv.suppliers?.name_ar || "—"}</td>
                      <td>
                        <span className="badge-primary px-2 py-0.5 rounded-full text-xs font-bold">
                          {inv.supplier_subscriptions?.subscription_plans?.name_ar || "—"}
                        </span>
                      </td>
                      <td className="font-bold text-primary">{inv.amount} ر.س</td>
                      <td className="text-sm text-muted-foreground">{inv.due_date}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sc.class}`}>{sc.label}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
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

export default InvoicesManager;
