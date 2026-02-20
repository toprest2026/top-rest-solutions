import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    label: "إجمالي المبيعات",
    value: "48,250 ر.س",
    change: "+12.5%",
    positive: true,
    icon: TrendingUp,
    color: "from-primary to-primary-light",
  },
  {
    label: "الطلبات اليوم",
    value: "142",
    change: "+8.3%",
    positive: true,
    icon: ShoppingBag,
    color: "from-accent-water to-accent-water-light",
  },
  {
    label: "العملاء النشطون",
    value: "3,891",
    change: "+5.1%",
    positive: true,
    icon: Users,
    color: "from-success to-success",
  },
  {
    label: "المنتجات المتاحة",
    value: "24",
    change: "+2",
    positive: true,
    icon: Package,
    color: "from-warning to-warning",
  },
];

const recentOrders = [
  { id: "#TR-4521", customer: "أحمد محمد", region: "الرياض", amount: "75 ر.س", status: "مكتمل", time: "منذ 5 دقائق" },
  { id: "#TR-4520", customer: "فاطمة علي", region: "جدة", amount: "150 ر.س", status: "قيد التوصيل", time: "منذ 12 دقيقة" },
  { id: "#TR-4519", customer: "محمد سالم", region: "الدمام", amount: "45 ر.س", status: "قيد المراجعة", time: "منذ 25 دقيقة" },
  { id: "#TR-4518", customer: "نورة الغامدي", region: "مكة المكرمة", amount: "220 ر.س", status: "مكتمل", time: "منذ 1 ساعة" },
  { id: "#TR-4517", customer: "عبدالله الشمري", region: "الرياض", amount: "90 ر.س", status: "ملغي", time: "منذ 2 ساعة" },
];

const regionPerformance = [
  { region: "الرياض", orders: 540, revenue: "22,500 ر.س", percentage: 85 },
  { region: "جدة", orders: 320, revenue: "13,800 ر.س", percentage: 65 },
  { region: "مكة المكرمة", orders: 180, revenue: "7,200 ر.س", percentage: 45 },
  { region: "الدمام", orders: 120, revenue: "4,750 ر.س", percentage: 30 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "مكتمل": return "badge-success";
    case "قيد التوصيل": return "badge-primary";
    case "قيد المراجعة": return "badge-warning";
    case "ملغي": return "text-destructive bg-destructive/10 border border-destructive/30";
    default: return "badge-primary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "مكتمل": return <CheckCircle className="w-3 h-3" />;
    case "قيد التوصيل": return <Truck className="w-3 h-3" />;
    case "قيد المراجعة": return <Clock className="w-3 h-3" />;
    case "ملغي": return <AlertCircle className="w-3 h-3" />;
    default: return null;
  }
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">نظرة عامة</h1>
        <p className="text-muted-foreground text-sm font-arabic mt-1">
          الخميس، 20 فبراير 2025 — آخر تحديث: منذ 3 دقائق
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold rounded-full px-2 py-1 ${
                stat.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
              }`}>
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-display font-black text-foreground mb-1">{stat.value}</p>
            <p className="text-muted-foreground text-xs font-arabic">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-bold text-foreground">آخر الطلبات</h3>
            <button className="text-accent-water text-xs font-arabic hover:underline flex items-center gap-1">
              عرض الكل
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>المنطقة</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>الوقت</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-bold text-primary">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {order.region}
                      </div>
                    </td>
                    <td className="font-bold">{order.amount}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Region Performance */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-bold text-foreground">أداء المناطق</h3>
          </div>
          <div className="p-4 space-y-4">
            {regionPerformance.map((r) => (
              <div key={r.region}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent-water" />
                    <span className="font-arabic text-sm font-semibold text-foreground">{r.region}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.orders} طلب</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent-water rounded-full transition-all duration-700"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-accent-water font-bold mt-1">{r.revenue}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground font-arabic mb-3 font-bold">إجراءات سريعة</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-primary/10 text-primary text-xs py-2 px-3 rounded-lg font-arabic hover:bg-primary/20 transition-colors font-semibold">
                طلب جديد
              </button>
              <button className="bg-accent-water/10 text-accent-water text-xs py-2 px-3 rounded-lg font-arabic hover:bg-accent-water/20 transition-colors font-semibold">
                تقرير يومي
              </button>
              <button className="bg-success/10 text-success text-xs py-2 px-3 rounded-lg font-arabic hover:bg-success/20 transition-colors font-semibold">
                فاتورة ضريبية
              </button>
              <button className="bg-warning/10 text-warning text-xs py-2 px-3 rounded-lg font-arabic hover:bg-warning/20 transition-colors font-semibold">
                تنبيه مخزون
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
