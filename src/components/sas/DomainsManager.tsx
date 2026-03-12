import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Shield, CheckCircle2, AlertTriangle, Clock, Plus, ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DomainRecord {
  id: string;
  supplier_name: string;
  subdomain: string | null;
  custom_domain: string | null;
  storefront_type: string;
  status: string;
  ssl_status: "active" | "pending" | "error";
}

const DomainsManager: React.FC = () => {
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("storefronts")
        .select("id, subdomain, custom_domain, storefront_type, status, supplier_id, suppliers(name_ar)")
        .order("created_at", { ascending: false });

      if (data) {
        setDomains(data.map((d: any) => ({
          id: d.id,
          supplier_name: d.suppliers?.name_ar || "—",
          subdomain: d.subdomain,
          custom_domain: d.custom_domain,
          storefront_type: d.storefront_type,
          status: d.status,
          ssl_status: d.status === "active" ? "active" as const : "pending" as const,
        })));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      active: { color: "text-success bg-success/10", label: "مفعّل" },
      pending: { color: "text-warning bg-warning/10", label: "قيد المعالجة" },
      suspended: { color: "text-destructive bg-destructive/10", label: "معلّق" },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.color}`}>{s.label}</span>;
  };

  const sslIcon = (status: string) => {
    if (status === "active") return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (status === "error") return <AlertTriangle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-warning" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة الدومينات</h1>
          <p className="text-muted-foreground text-sm mt-1">التحكم المركزي في توجيه النطاقات وشهادات SSL</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Globe className="w-6 h-6 text-accent-water mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{domains.length}</p>
          <p className="text-xs text-muted-foreground">إجمالي النطاقات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-success">{domains.filter(d => d.ssl_status === "active").length}</p>
          <p className="text-xs text-muted-foreground">SSL مفعّل</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <ExternalLink className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{domains.filter(d => d.custom_domain).length}</p>
          <p className="text-xs text-muted-foreground">نطاق مستقل</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Globe className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{domains.filter(d => !d.custom_domain).length}</p>
          <p className="text-xs text-muted-foreground">نطاق فرعي</p>
        </div>
      </div>

      {/* DNS Guide */}
      <div className="glass-card rounded-2xl p-5 border-r-4 border-accent-water">
        <h3 className="font-display font-bold text-foreground mb-2">إعدادات DNS للنطاقات المستقلة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">سجل A (الجذر)</p>
            <code className="text-foreground font-mono text-xs">@ → 185.158.133.1</code>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">سجل A (www)</p>
            <code className="text-foreground font-mono text-xs">www → 185.158.133.1</code>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">سجل TXT (تحقق)</p>
            <code className="text-foreground font-mono text-xs">_verify → toprest_xxxx</code>
          </div>
        </div>
      </div>

      {/* Domains Table */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">النطاقات المسجلة</h3>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">جاري التحميل...</p>
        ) : domains.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا توجد نطاقات مسجلة بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">المورد</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">النطاق</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">النوع</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">SSL</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الحالة</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {domains.map(d => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 px-3 text-foreground font-bold">{d.supplier_name}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-accent-water">
                      {d.custom_domain || `${d.subdomain}.toprest.sa`}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.storefront_type === "custom_domain" ? "bg-primary/10 text-primary" : "bg-accent-water/10 text-accent-water"
                      }`}>
                        {d.storefront_type === "custom_domain" ? "مستقل" : "فرعي"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{sslIcon(d.ssl_status)}</td>
                    <td className="py-2.5 px-3">{statusBadge(d.status)}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted text-accent-water" title="تحديث DNS">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="فتح">
                          <ExternalLink className="w-3.5 h-3.5" />
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
    </div>
  );
};

export default DomainsManager;
