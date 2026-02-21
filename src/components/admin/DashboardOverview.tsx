import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Receipt,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";

const salesData = [
  { month: "يناير", sales: 45000, purchases: 32000 },
  { month: "فبراير", sales: 52000, purchases: 28000 },
  { month: "مارس", sales: 48000, purchases: 35000 },
  { month: "أبريل", sales: 61000, purchases: 30000 },
  { month: "مايو", sales: 55000, purchases: 42000 },
  { month: "يونيو", sales: 67000, purchases: 38000 },
  { month: "يوليو", sales: 72000, purchases: 45000 },
];

const topProducts = [
  { name: "جالون مياه 19 لتر", sales: 1200 },
  { name: "مياه 1.5 لتر", sales: 950 },
  { name: "كرتون 6 جالون", sales: 800 },
  { name: "مياه 500 مل", sales: 750 },
  { name: "برادة مياه", sales: 320 },
];

const categoryData = [
  { name: "جالونات", value: 40 },
  { name: "قوارير", value: 25 },
  { name: "عروض", value: 20 },
  { name: "أجهزة", value: 15 },
];

const COLORS = [
  "hsl(174, 72%, 46%)",
  "hsl(199, 89%, 48%)",
  "hsl(142, 72%, 42%)",
  "hsl(38, 92%, 50%)",
];

const recentInvoices = [
  { id: "INV-001", client: "شركة الفجر", amount: "12,500", status: "مدفوعة", vat: "1,875" },
  { id: "INV-002", client: "مؤسسة النور", amount: "8,200", status: "معلقة", vat: "1,230" },
  { id: "INV-003", client: "شركة الأمل", amount: "25,000", status: "مدفوعة", vat: "3,750" },
  { id: "INV-004", client: "مكتب الشرق", amount: "5,800", status: "متأخرة", vat: "870" },
  { id: "INV-005", client: "مجموعة السلام", amount: "18,300", status: "مدفوعة", vat: "2,745" },
];

const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case "مدفوعة": return "text-success bg-success/10";
    case "معلقة": return "text-warning bg-warning/10";
    case "متأخرة": return "text-destructive bg-destructive/10";
    default: return "text-muted-foreground bg-muted";
  }
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-display font-black text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm font-arabic mt-1">نظرة عامة على أداء النظام</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المبيعات"
          value="٤٨,٢٥٠ ر.س"
          change="+12.5%"
          positive={true}
          icon={DollarSign}
          color="hsl(174, 72%, 46%)"
          index={0}
        />
        <StatCard
          title="الطلبات"
          value="٣٤٢"
          change="+8.3%"
          positive={true}
          icon={ShoppingCart}
          color="hsl(199, 89%, 48%)"
          index={1}
        />
        <StatCard
          title="المنتجات"
          value="٢٤"
          change="+2"
          positive={true}
          icon={Package}
          color="hsl(142, 72%, 42%)"
          index={2}
        />
        <StatCard
          title="العملاء"
          value="٣,٨٩١"
          change="+5.1%"
          positive={true}
          icon={Users}
          color="hsl(38, 92%, 50%)"
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-display font-bold text-foreground mb-4">المبيعات والمشتريات</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(0, 0%, 90%)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontFamily: "Cairo",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString("ar-SA")} ر.س`,
                    name === "sales" ? "المبيعات" : "المشتريات",
                  ]}
                />
                <Area type="monotone" dataKey="sales" stroke="hsl(174, 72%, 46%)" fill="url(#salesGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="purchases" stroke="hsl(199, 89%, 48%)" fill="url(#purchasesGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-display font-bold text-foreground mb-4">التصنيفات</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="font-arabic text-foreground">{item.name}</span>
                </div>
                <span className="font-bold text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-display font-bold text-foreground mb-4">أكثر المنتجات مبيعاً</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" horizontal={false} />
                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(0, 0%, 90%)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value} طلب`, "المبيعات"]}
                />
                <Bar dataKey="sales" fill="hsl(174, 72%, 46%)" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-display font-bold text-foreground mb-4">آخر الفواتير</h3>
          <div className="space-y-3">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-arabic font-semibold text-foreground text-sm">{inv.client}</p>
                    <p className="text-xs text-muted-foreground font-arabic">{inv.id} · ضريبة: {inv.vat} ر.س</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-foreground text-sm">{inv.amount} ر.س</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getInvoiceStatusColor(inv.status)}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* VAT Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-foreground mb-4">ملخص ضريبة القيمة المضافة (15%)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-success/5 border border-success/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground font-arabic mb-1">ضريبة المبيعات</p>
            <p className="text-xl font-display font-black text-success">٦٠,٠٠٠ ر.س</p>
          </div>
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground font-arabic mb-1">ضريبة المشتريات</p>
            <p className="text-xl font-display font-black text-destructive">٣٧,٥٠٠ ر.س</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground font-arabic mb-1">صافي الضريبة المستحقة</p>
            <p className="text-xl font-display font-black text-primary">٢٢,٥٠٠ ر.س</p>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground font-arabic mb-1">موعد التسليم القادم</p>
            <p className="text-xl font-display font-black text-warning">٣٠ مارس</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
