import React from "react";
import { CreditCard, Smartphone, Landmark, Clock } from "lucide-react";

const paymentMethods = [
  {
    id: "mada",
    nameAr: "مدى",
    descAr: "بطاقة الدفع المحلية",
    icon: "💳",
    color: "bg-green-50 border-green-200",
    tag: "",
  },
  {
    id: "visa",
    nameAr: "فيزا / ماستر",
    descAr: "بطاقات الائتمان الدولية",
    icon: "💳",
    color: "bg-blue-50 border-blue-200",
    tag: "",
  },
  {
    id: "apple-pay",
    nameAr: "Apple Pay",
    descAr: "الدفع السريع عبر آبل",
    icon: "🍎",
    color: "bg-gray-50 border-gray-200",
    tag: "",
  },
  {
    id: "stc-pay",
    nameAr: "STC Pay",
    descAr: "محفظة STC الرقمية",
    icon: "📱",
    color: "bg-purple-50 border-purple-200",
    tag: "",
  },
  {
    id: "tabby",
    nameAr: "تابي",
    descAr: "اشتري الآن وادفع لاحقاً",
    icon: "⏱️",
    color: "bg-teal-50 border-teal-200",
    tag: "قسّط بدون فوائد",
  },
  {
    id: "tamara",
    nameAr: "تمارا",
    descAr: "3 أقساط بدون فوائد",
    icon: "💰",
    color: "bg-emerald-50 border-emerald-200",
    tag: "3 أقساط",
  },
  {
    id: "bank-transfer",
    nameAr: "تحويل بنكي",
    descAr: "تحويل مباشر لحساب المتجر",
    icon: "🏦",
    color: "bg-orange-50 border-orange-200",
    tag: "",
  },
  {
    id: "cod",
    nameAr: "الدفع عند الاستلام",
    descAr: "ادفع نقداً عند وصول طلبك",
    icon: "💵",
    color: "bg-yellow-50 border-yellow-200",
    tag: "",
  },
];

const PaymentMethods: React.FC = () => {
  return (
    <section id="payment" className="py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 badge-primary rounded-full px-4 py-1.5 mb-4 text-sm font-arabic">
            <CreditCard className="w-4 h-4" />
            طرق الدفع
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            ادفع بالطريقة التي تناسبك
          </h2>
          <p className="text-muted-foreground font-arabic max-w-md mx-auto">
            نوفر لك خيارات دفع متعددة تشمل التقسيط بدون فوائد مع تابي وتمارا
          </p>
        </div>

        {/* BNPL Banner */}
        <div className="bg-gradient-to-r from-primary to-accent-water rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-white font-display font-bold text-xl">
                قسّط مشترياتك بدون فوائد
              </h3>
              <p className="text-white/75 font-arabic text-sm">
                مع تابي وتمارا — اشتري الآن وادفع لاحقاً بكل سهولة
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white rounded-xl px-5 py-2.5 flex items-center gap-2">
              <span className="text-teal-600 font-bold text-lg">تابي</span>
            </div>
            <div className="bg-white rounded-xl px-5 py-2.5 flex items-center gap-2">
              <span className="text-emerald-600 font-bold text-lg">تمارا</span>
            </div>
          </div>
        </div>

        {/* Payment Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method-card ${method.color} relative flex-col text-center gap-2 py-4`}
            >
              {method.tag && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-destructive text-white text-xs px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                  {method.tag}
                </div>
              )}
              <div className="text-3xl mb-1">{method.icon}</div>
              <p className="font-display font-bold text-foreground text-sm">{method.nameAr}</p>
              <p className="text-muted-foreground text-xs font-arabic">{method.descAr}</p>
            </div>
          ))}
        </div>

        {/* Security note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <Smartphone className="w-4 h-4" />
          <p className="text-sm font-arabic">
            جميع معاملاتك محمية بتشفير SSL 256-bit
          </p>
          <Landmark className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
