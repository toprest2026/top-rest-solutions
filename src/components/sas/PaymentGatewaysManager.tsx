import React, { useState } from "react";
import {
  CreditCard, Smartphone, Zap, ShoppingCart, Settings, Check, X,
  ToggleLeft, ToggleRight, Key, Globe, AlertTriangle, Loader2
} from "lucide-react";

interface Gateway {
  id: string;
  name: string;
  name_en: string;
  description: string;
  icon: React.ElementType;
  color: string;
  supports: string[];
  fee: string;
  active: boolean;
  configured: boolean;
  testMode: boolean;
}

const initialGateways: Gateway[] = [
  {
    id: "mada", name: "مدى", name_en: "Mada", description: "بوابة الدفع الوطنية لبطاقات مدى",
    icon: CreditCard, color: "bg-[#1A4B84]", supports: ["بطاقات مدى"], fee: "1.75%", active: true, configured: true, testMode: false
  },
  {
    id: "visa_mc", name: "فيزا / ماستر كارد", name_en: "Visa / Mastercard", description: "قبول البطاقات الائتمانية الدولية",
    icon: CreditCard, color: "bg-[#1A1F71]", supports: ["Visa", "Mastercard"], fee: "2.5%", active: true, configured: true, testMode: false
  },
  {
    id: "apple_pay", name: "Apple Pay", name_en: "Apple Pay", description: "دفع سريع عبر أجهزة آبل",
    icon: Smartphone, color: "bg-foreground", supports: ["iPhone", "iPad", "Mac"], fee: "1.5%", active: false, configured: false, testMode: false
  },
  {
    id: "stc_pay", name: "STC Pay", name_en: "STC Pay", description: "محفظة رقمية من STC",
    icon: Zap, color: "bg-[#4C2882]", supports: ["محفظة STC"], fee: "2%", active: false, configured: false, testMode: false
  },
  {
    id: "tabby", name: "تابي", name_en: "Tabby", description: "اشترِ الآن وادفع لاحقاً — 4 دفعات بدون فوائد",
    icon: ShoppingCart, color: "bg-[#34E0A1]", supports: ["تقسيط 4 دفعات", "ادفع لاحقاً"], fee: "5-8%", active: true, configured: true, testMode: true
  },
  {
    id: "tamara", name: "تمارا", name_en: "Tamara", description: "حلول تقسيط مرنة — 3 أو 6 دفعات",
    icon: ShoppingCart, color: "bg-[#FF6B35]", supports: ["تقسيط 3 دفعات", "تقسيط 6 دفعات"], fee: "4-7%", active: false, configured: false, testMode: false
  },
  {
    id: "cod", name: "الدفع عند الاستلام", name_en: "Cash on Delivery", description: "دفع نقدي عند تسليم الطلب",
    icon: CreditCard, color: "bg-success", supports: ["نقدي"], fee: "0%", active: true, configured: true, testMode: false
  },
  {
    id: "bank", name: "تحويل بنكي", name_en: "Bank Transfer", description: "تحويل مباشر للحساب البنكي",
    icon: CreditCard, color: "bg-primary", supports: ["تحويل بنكي"], fee: "0%", active: true, configured: true, testMode: false
  },
];

const PaymentGatewaysManager: React.FC = () => {
  const [gateways, setGateways] = useState(initialGateways);
  const [configuring, setConfiguring] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  const toggleTestMode = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, testMode: !g.testMode } : g));
  };

  const activeCount = gateways.filter(g => g.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">بوابات الدفع</h1>
          <p className="text-muted-foreground text-sm mt-1">{activeCount} بوابة مفعّلة من أصل {gateways.length}</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "بوابات مفعّلة", value: activeCount, color: "text-success" },
          { label: "وضع اختبار", value: gateways.filter(g => g.testMode).length, color: "text-warning" },
          { label: "تحتاج تفعيل", value: gateways.filter(g => !g.configured).length, color: "text-destructive" },
          { label: "إجمالي البوابات", value: gateways.length, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center">
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Gateways List */}
      <div className="space-y-3">
        {gateways.map(gw => {
          const Icon = gw.icon;
          return (
            <div key={gw.id} className={`glass-card rounded-2xl p-5 transition-all ${gw.active ? "ring-1 ring-success/20" : "opacity-75"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${gw.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-foreground">{gw.name}</h3>
                    <span className="text-xs text-muted-foreground">({gw.name_en})</span>
                    {gw.testMode && (
                      <span className="px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-bold rounded-full border border-warning/30">وضع اختبار</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{gw.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {gw.supports.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full">{s}</span>
                    ))}
                    <span className="text-[10px] text-muted-foreground">• رسوم: {gw.fee}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {gw.configured && (
                    <button
                      onClick={() => toggleTestMode(gw.id)}
                      className={`p-2 rounded-lg text-xs transition-colors ${
                        gw.testMode ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      title={gw.testMode ? "إيقاف وضع الاختبار" : "تفعيل وضع الاختبار"}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setConfiguring(gw.id)}
                    className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="إعدادات"
                  >
                    {gw.configured ? <Settings className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleActive(gw.id)}
                    className="transition-colors"
                    title={gw.active ? "إيقاف" : "تفعيل"}
                  >
                    {gw.active ? (
                      <ToggleRight className="w-8 h-8 text-success" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Config Panel */}
              {configuring === gw.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1 font-arabic">المفتاح العام (Publishable Key)</label>
                      <input type="text" placeholder="pk_live_..." className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1 font-arabic">المفتاح السري (Secret Key)</label>
                      <input type="password" placeholder="sk_live_..." className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-mono" />
                    </div>
                  </div>
                  {(gw.id === "tabby" || gw.id === "tamara") && (
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1 font-arabic">Merchant ID</label>
                      <input type="text" placeholder="merchant_..." className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-mono" />
                    </div>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setConfiguring(null)} className="btn-outline-water px-4 py-2 text-xs rounded-lg">إلغاء</button>
                    <button onClick={() => setConfiguring(null)} className="btn-primary px-4 py-2 text-xs rounded-lg">حفظ الإعدادات</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentGatewaysManager;
