import React, { useState } from "react";
import { Search, Filter, Eye, CheckCircle, Truck, Clock, AlertCircle, MapPin, Phone } from "lucide-react";

const allOrders = [
  { id: "#TR-4521", customer: "أحمد محمد", phone: "0501234567", region: "الرياض", items: "2 جالون 19L", amount: 75, status: "مكتمل", date: "2025-02-20", supplier: "مورد الرياض 1" },
  { id: "#TR-4520", customer: "فاطمة علي", phone: "0509876543", region: "جدة", items: "6 جالون (كرتون)", amount: 150, status: "قيد التوصيل", date: "2025-02-20", supplier: "مورد جدة 1" },
  { id: "#TR-4519", customer: "محمد سالم", phone: "0551234567", region: "الدمام", items: "1 برادة + 2 جالون", amount: 379, status: "قيد المراجعة", date: "2025-02-20", supplier: "مورد الدمام" },
  { id: "#TR-4518", customer: "نورة الغامدي", phone: "0561234567", region: "مكة المكرمة", items: "اشتراك شهري عائلي", amount: 150, status: "مكتمل", date: "2025-02-19", supplier: "مورد مكة" },
  { id: "#TR-4517", customer: "عبدالله الشمري", phone: "0571234567", region: "الرياض", items: "3 جالون 19L", amount: 45, status: "ملغي", date: "2025-02-19", supplier: "مورد الرياض 1" },
  { id: "#TR-4516", customer: "سارة القحطاني", phone: "0581234567", region: "جدة", items: "كرتون 1.5L × 2", amount: 30, status: "تم التسليم", date: "2025-02-19", supplier: "مورد جدة 2" },
];

const statuses = ["الكل", "مكتمل", "قيد التوصيل", "قيد المراجعة", "تم التسليم", "ملغي"];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "مكتمل": return "badge-success";
    case "تم التسليم": return "badge-success";
    case "قيد التوصيل": return "badge-primary";
    case "قيد المراجعة": return "badge-warning";
    case "ملغي": return "text-destructive bg-destructive/10 border border-destructive/30";
    default: return "badge-primary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "مكتمل": case "تم التسليم": return <CheckCircle className="w-3 h-3" />;
    case "قيد التوصيل": return <Truck className="w-3 h-3" />;
    case "قيد المراجعة": return <Clock className="w-3 h-3" />;
    case "ملغي": return <AlertCircle className="w-3 h-3" />;
    default: return null;
  }
};

const OrdersManager: React.FC = () => {
  const [orders] = useState(allOrders);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState<typeof allOrders[0] | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.includes(search) || o.id.includes(search) || o.region.includes(search);
    const matchStatus = activeStatus === "الكل" || o.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    "مكتمل": orders.filter((o) => o.status === "مكتمل" || o.status === "تم التسليم").length,
    "قيد التوصيل": orders.filter((o) => o.status === "قيد التوصيل").length,
    "قيد المراجعة": orders.filter((o) => o.status === "قيد المراجعة").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">إدارة الطلبات</h1>
        <p className="text-muted-foreground text-sm font-arabic mt-1">{orders.length} طلب إجمالي</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="stat-card p-4 text-center">
            <p className="text-2xl font-display font-black text-foreground">{count}</p>
            <p className="text-muted-foreground text-xs font-arabic mt-1">{status}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث بالعميل أو رقم الطلب أو المنطقة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input pr-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-arabic transition-all ${
                activeStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>المنطقة</th>
                <th>المنتجات</th>
                <th>المبلغ</th>
                <th>المورد</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="font-bold text-primary">{order.id}</td>
                  <td>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{order.customer}</p>
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />{order.phone}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-accent-water" />
                      {order.region}
                    </div>
                  </td>
                  <td className="text-sm text-muted-foreground">{order.items}</td>
                  <td className="font-bold text-primary">{order.amount} ر.س</td>
                  <td className="text-sm text-muted-foreground">{order.supplier}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-accent-water transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-water-xl">
            <h3 className="font-display font-bold text-foreground text-lg mb-1">{selectedOrder.id}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-4 ${getStatusStyle(selectedOrder.status)}`}>
              {getStatusIcon(selectedOrder.status)}
              {selectedOrder.status}
            </span>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground font-arabic">العميل</span><span className="font-semibold">{selectedOrder.customer}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-arabic">الهاتف</span><span>{selectedOrder.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-arabic">المنطقة</span><span>{selectedOrder.region}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-arabic">المنتجات</span><span>{selectedOrder.items}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-arabic">المورد</span><span>{selectedOrder.supplier}</span></div>
              <div className="flex justify-between border-t border-border pt-3"><span className="font-bold font-arabic">الإجمالي</span><span className="font-black text-primary text-base">{selectedOrder.amount} ر.س</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button className="btn-accent py-2 text-sm rounded-xl">قيد التوصيل</button>
              <button className="btn-primary py-2 text-sm rounded-xl">مكتمل</button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="col-span-2 btn-outline-water py-2 text-sm rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
