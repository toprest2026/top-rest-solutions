import React, { useState } from "react";
import { Plus, MapPin, Phone, Mail, Truck, Edit2, Trash2 } from "lucide-react";

const initialSuppliers = [
  { id: 1, name: "مورد الرياض الأول", contact: "أبو محمد", phone: "0501111111", email: "riyadh1@toprest.sa", regions: ["الرياض"], activeOrders: 12, totalDelivered: 540, status: "نشط" },
  { id: 2, name: "مورد جدة المعتمد", contact: "أبو عمر", phone: "0502222222", email: "jeddah@toprest.sa", regions: ["جدة"], activeOrders: 8, totalDelivered: 320, status: "نشط" },
  { id: 3, name: "مورد مكة المكرمة", contact: "أبو فهد", phone: "0503333333", email: "mecca@toprest.sa", regions: ["مكة المكرمة", "الطائف"], activeOrders: 4, totalDelivered: 180, status: "نشط" },
  { id: 4, name: "مورد الدمام", contact: "أبو خالد", phone: "0504444444", email: "dammam@toprest.sa", regions: ["الدمام"], activeOrders: 3, totalDelivered: 120, status: "موقوف" },
];

const SuppliersManager: React.FC = () => {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة الموردين</h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {suppliers.filter((s) => s.status === "نشط").length} مورد نشط
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          إضافة مورد
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-water flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">{supplier.name}</h3>
                  <p className="text-muted-foreground text-xs font-arabic">{supplier.contact}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                supplier.status === "نشط" ? "badge-success" : "text-destructive bg-destructive/10 border border-destructive/30"
              }`}>
                {supplier.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-accent-water" />
                <span className="text-muted-foreground">{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-accent-water" />
                <span className="text-muted-foreground">{supplier.email}</span>
              </div>
            </div>

            {/* Regions */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground font-arabic mb-2">المناطق المخصصة</p>
              <div className="flex flex-wrap gap-1.5">
                {supplier.regions.map((r) => (
                  <span key={r} className="flex items-center gap-1 badge-primary px-2 py-0.5 rounded-full text-xs font-arabic">
                    <MapPin className="w-2.5 h-2.5" />
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted rounded-xl p-3 text-center">
                <p className="text-lg font-display font-black text-primary">{supplier.activeOrders}</p>
                <p className="text-xs text-muted-foreground font-arabic">طلب نشط</p>
              </div>
              <div className="bg-muted rounded-xl p-3 text-center">
                <p className="text-lg font-display font-black text-success">{supplier.totalDelivered}</p>
                <p className="text-xs text-muted-foreground font-arabic">تم التسليم</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 btn-outline-water py-2 text-xs rounded-lg flex items-center justify-center gap-1">
                <Edit2 className="w-3 h-3" />
                تعديل
              </button>
              <button
                onClick={() => setSuppliers((s) => s.filter((sup) => sup.id !== supplier.id))}
                className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-water-xl">
            <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent-water" />
              إضافة مورد جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم المورد</label>
                <input className="search-input" placeholder="مورد المنطقة الجديد" />
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم المسؤول</label>
                <input className="search-input" placeholder="أبو محمد" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الهاتف</label>
                  <input className="search-input" placeholder="05XXXXXXXX" />
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">المنطقة</label>
                  <select className="search-input">
                    {["الرياض", "جدة", "مكة المكرمة", "الدمام", "المدينة المنورة", "الطائف"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                <input className="search-input" type="email" placeholder="supplier@toprest.sa" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 py-2.5 text-sm rounded-xl">إضافة المورد</button>
              <button onClick={() => setShowAdd(false)} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersManager;
