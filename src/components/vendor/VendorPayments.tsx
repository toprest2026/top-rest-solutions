import React, { useState } from "react";
import { CreditCard, Shield, CheckCircle2, AlertTriangle } from "lucide-react";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: "platform" | "custom";
}

const VendorPayments: React.FC = () => {
  const [useOwnGateway, setUseOwnGateway] = useState(false);
  const [options, setOptions] = useState<PaymentOption[]>([
    { id: "mada", name: "مدى", description: "بطاقات مدى المحلية", enabled: true, type: "platform" },
    { id: "visa", name: "فيزا / ماستركارد", description: "بطاقات الائتمان الدولية", enabled: true, type: "platform" },
    { id: "stc", name: "STC Pay", description: "محفظة STC الرقمية", enabled: false, type: "platform" },
    { id: "tabby", name: "تابي", description: "اشتر الآن وادفع لاحقاً", enabled: false, type: "platform" },
    { id: "tamara", name: "تمارا", description: "تقسيط بدون فوائد", enabled: false, type: "platform" },
    { id: "cod", name: "الدفع عند الاستلام", description: "نقداً عند التسليم", enabled: true, type: "platform" },
  ]);

  const toggle = (id: string) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, enabled: !o.enabled } : o));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">بوابات الدفع</h1>
        <p className="text-muted-foreground text-sm mt-1">إدارة وسائل الدفع المتاحة لعملاء متجرك</p>
      </div>

      {/* Gateway Type */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-3">مصدر بوابة الدفع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setUseOwnGateway(false)}
            className={`p-4 rounded-xl border-2 text-right transition-colors ${
              !useOwnGateway ? "border-accent-water bg-accent-water/5" : "border-border"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-accent-water" />
              <span className="font-bold text-foreground">بوابة المنصة</span>
            </div>
            <p className="text-xs text-muted-foreground">استخدام بوابة الدفع المركزية للمنصة (موصى به)</p>
          </button>
          <button
            onClick={() => setUseOwnGateway(true)}
            className={`p-4 rounded-xl border-2 text-right transition-colors ${
              useOwnGateway ? "border-accent-water bg-accent-water/5" : "border-border"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">بوابة خاصة</span>
            </div>
            <p className="text-xs text-muted-foreground">ربط بوابة دفع خاصة بمتجرك (يتطلب باقة احترافية)</p>
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">وسائل الدفع المتاحة</h3>
        <div className="space-y-3">
          {options.map(opt => (
            <div key={opt.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30">
              <div className="flex items-center gap-3">
                {opt.enabled ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-muted-foreground/30 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-bold text-foreground">{opt.name}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(opt.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  opt.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                {opt.enabled ? "مفعّل" : "معطّل"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Gateway Config */}
      {useOwnGateway && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold text-foreground mb-4">إعدادات البوابة الخاصة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">مزود الخدمة</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm">
                <option>HyperPay</option>
                <option>Moyasar</option>
                <option>PayTabs</option>
                <option>Tap Payments</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">مفتاح API</label>
              <input type="password" placeholder="sk_live_xxxxxxxx"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-mono" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn-primary px-5 py-2 text-sm rounded-xl">حفظ الإعدادات</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPayments;
