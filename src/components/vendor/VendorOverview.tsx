import React from "react";
import { ShoppingBag, Package, DollarSign, TrendingUp, Truck, Star } from "lucide-react";

const VendorOverview: React.FC = () => {
  const stats = [
    { label: "الطلبات اليوم", value: "12", icon: ShoppingBag, color: "text-accent-water" },
    { label: "المنتجات النشطة", value: "45", icon: Package, color: "text-primary" },
    { label: "إيرادات الشهر", value: "15,320 ر.س", icon: DollarSign, color: "text-success" },
    { label: "نسبة النمو", value: "+18%", icon: TrendingUp, color: "text-warning" },
    { label: "السائقون النشطون", value: "5", icon: Truck, color: "text-accent-water" },
    { label: "تقييم المتجر", value: "4.8", icon: Star, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">مرحباً بك في متجرك</h1>
        <p className="text-muted-foreground text-sm mt-1">ملخص أداء المتجر لهذا اليوم</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">آخر الطلبات</h3>
        <p className="text-center text-muted-foreground py-6 text-sm">سيتم عرض الطلبات هنا عند توفرها</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "إضافة منتج", icon: Package },
          { label: "إدارة الطلبات", icon: ShoppingBag },
          { label: "إدارة السائقين", icon: Truck },
          { label: "التقارير", icon: TrendingUp },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <button key={i} className="glass-card rounded-xl p-4 text-center hover:border-accent-water/50 transition-colors">
              <Icon className="w-6 h-6 text-accent-water mx-auto mb-2" />
              <p className="text-xs font-bold text-foreground">{action.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VendorOverview;
