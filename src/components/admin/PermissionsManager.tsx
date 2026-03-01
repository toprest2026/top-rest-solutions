import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle, XCircle, Globe, Radar, Truck, Layout } from "lucide-react";
import { motion } from "framer-motion";

interface SupplierPermission {
  id: string;
  supplier_name: string;
  plan_name: string;
  status: string;
  has_custom_domain: boolean;
  has_dedicated_page: boolean;
  has_driver_radar: boolean;
  has_cash_van: boolean;
  max_products: number;
  max_orders: number;
}

const PermissionsManager: React.FC = () => {
  const [permissions, setPermissions] = useState<SupplierPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("supplier_subscriptions")
      .select("id, status, suppliers(name_ar), subscription_plans(name_ar, has_custom_domain, has_dedicated_page, has_driver_radar, has_cash_van, max_products, max_orders)")
      .eq("status", "active");

    if (data) {
      setPermissions(
        data.map((d: any) => ({
          id: d.id,
          supplier_name: d.suppliers?.name_ar || "—",
          plan_name: d.subscription_plans?.name_ar || "—",
          status: d.status,
          has_custom_domain: d.subscription_plans?.has_custom_domain || false,
          has_dedicated_page: d.subscription_plans?.has_dedicated_page || false,
          has_driver_radar: d.subscription_plans?.has_driver_radar || false,
          has_cash_van: d.subscription_plans?.has_cash_van || false,
          max_products: d.subscription_plans?.max_products || 0,
          max_orders: d.subscription_plans?.max_orders || 0,
        }))
      );
    }
    setLoading(false);
  };

  const features = [
    { key: "has_custom_domain" as const, label: "دومين مستقل", icon: Globe },
    { key: "has_dedicated_page" as const, label: "صفحة مستقلة", icon: Layout },
    { key: "has_driver_radar" as const, label: "رادار السواقين", icon: Radar },
    { key: "has_cash_van" as const, label: "كاش فان", icon: Truck },
  ];

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
          <Shield className="w-6 h-6 text-accent-water" />
          الصلاحيات والخصائص
        </h2>
        <p className="text-muted-foreground text-sm font-arabic mt-1">
          عرض الخصائص المفعّلة لكل مورد حسب باقته
        </p>
      </div>

      {permissions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-arabic">لا يوجد مشتركين نشطين</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {permissions.map((perm, i) => (
            <motion.div
              key={perm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-foreground">{perm.supplier_name}</h3>
                  <span className="badge-primary px-2 py-0.5 rounded-full text-xs font-bold">{perm.plan_name}</span>
                </div>
                <span className="badge-success px-2 py-0.5 rounded-full text-xs font-bold">نشط</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {features.map(feat => {
                  const enabled = perm[feat.key];
                  return (
                    <div
                      key={feat.key}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-sm ${
                        enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <feat.icon className="w-4 h-4" />
                      <span className="font-arabic">{feat.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                <span>الحد الأقصى للمنتجات: <strong className="text-foreground">{perm.max_products === -1 ? "∞" : perm.max_products}</strong></span>
                <span>الحد الأقصى للطلبات: <strong className="text-foreground">{perm.max_orders === -1 ? "∞" : perm.max_orders}</strong></span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsManager;
