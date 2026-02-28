import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus, Eye, Edit2, Download, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Contract {
  id: string;
  contract_number: string | null;
  title_ar: string;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
  signed_at: string | null;
  signed_by: string | null;
  created_at: string;
  suppliers: { name_ar: string } | null;
  supplier_subscriptions: { status: string; subscription_plans: { name_ar: string } | null } | null;
}

const ContractsManager: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contracts")
      .select("*, suppliers(name_ar), supplier_subscriptions(status, subscription_plans(name_ar))")
      .order("created_at", { ascending: false });
    if (data) setContracts(data as unknown as Contract[]);
    setLoading(false);
  };

  const statusConfig: Record<string, { icon: React.ElementType; class: string; label: string }> = {
    draft: { icon: Clock, class: "badge-warning", label: "مسودة" },
    active: { icon: CheckCircle, class: "badge-success", label: "ساري" },
    expired: { icon: AlertTriangle, class: "text-destructive bg-destructive/10 border border-destructive/30", label: "منتهي" },
    terminated: { icon: XCircle, class: "text-muted-foreground bg-muted border border-border", label: "ملغي" },
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
            <FileText className="w-6 h-6 text-accent-water" />
            العقود والتعاقدات
          </h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {contracts.filter(c => c.status === "active").length} عقد ساري — {contracts.length} إجمالي
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          عقد جديد
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config], i) => {
          const count = contracts.filter(c => c.status === key).length;
          const Icon = config.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <Icon className="w-5 h-5 mx-auto mb-2 text-accent-water" />
              <p className="text-2xl font-display font-black text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Contracts Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {contracts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-arabic">لا توجد عقود حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>رقم العقد</th>
                  <th>المورد</th>
                  <th>العنوان</th>
                  <th>الباقة</th>
                  <th>القيمة</th>
                  <th>المدة</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => {
                  const sc = statusConfig[contract.status] || statusConfig.draft;
                  return (
                    <tr key={contract.id}>
                      <td className="font-mono text-xs text-accent-water">{contract.contract_number || "—"}</td>
                      <td className="font-semibold text-foreground">{contract.suppliers?.name_ar || "—"}</td>
                      <td className="text-sm">{contract.title_ar}</td>
                      <td>
                        <span className="badge-primary px-2 py-0.5 rounded-full text-xs font-bold">
                          {contract.supplier_subscriptions?.subscription_plans?.name_ar || "—"}
                        </span>
                      </td>
                      <td className="font-bold text-primary">{contract.value} ر.س</td>
                      <td className="text-xs text-muted-foreground">
                        {contract.start_date} → {contract.end_date}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sc.class}`}>{sc.label}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-accent-water transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
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

export default ContractsManager;
