import React, { useState } from "react";
import {
  AppWindow, CreditCard, Truck, BarChart3, MessageSquare, Mail, Camera,
  Smartphone, Globe, ShoppingCart, Zap, Check, ExternalLink, Search, Filter
} from "lucide-react";

interface App {
  id: string;
  name: string;
  name_en: string;
  description: string;
  category: string;
  icon: React.ElementType;
  color: string;
  installed: boolean;
  popular: boolean;
  free: boolean;
  price?: number;
}

const apps: App[] = [
  { id: "mada", name: "مدى", name_en: "Mada", description: "بوابة الدفع الوطنية — قبول بطاقات مدى مباشرة", category: "دفع", icon: CreditCard, color: "bg-[#1A4B84]", installed: false, popular: true, free: false, price: 0 },
  { id: "apple_pay", name: "Apple Pay", name_en: "Apple Pay", description: "دفع سريع وآمن عبر أجهزة آبل", category: "دفع", icon: Smartphone, color: "bg-foreground", installed: false, popular: true, free: false, price: 0 },
  { id: "stc_pay", name: "STC Pay", name_en: "STC Pay", description: "محفظة رقمية للدفع الإلكتروني من STC", category: "دفع", icon: Zap, color: "bg-[#4C2882]", installed: false, popular: true, free: false, price: 0 },
  { id: "tabby", name: "تابي", name_en: "Tabby", description: "تقسيط المشتريات — ادفع لاحقاً على 4 دفعات", category: "دفع", icon: ShoppingCart, color: "bg-[#3FFFA4]", installed: true, popular: true, free: false, price: 0 },
  { id: "tamara", name: "تمارا", name_en: "Tamara", description: "حلول الشراء الآن والدفع لاحقاً", category: "دفع", icon: ShoppingCart, color: "bg-[#FF6B35]", installed: false, popular: true, free: false, price: 0 },
  { id: "smsa", name: "SMSA Express", name_en: "SMSA Express", description: "شحن سريع داخل المملكة مع تتبع مباشر", category: "شحن", icon: Truck, color: "bg-[#E31E24]", installed: false, popular: true, free: true },
  { id: "aramex", name: "أرامكس", name_en: "Aramex", description: "حلول شحن محلية ودولية", category: "شحن", icon: Truck, color: "bg-[#ED1C24]", installed: true, popular: false, free: true },
  { id: "dhl", name: "DHL", name_en: "DHL", description: "شحن دولي سريع وموثوق", category: "شحن", icon: Truck, color: "bg-[#FFCC00]", installed: false, popular: false, free: true },
  { id: "google_analytics", name: "Google Analytics", name_en: "Google Analytics", description: "تحليلات متقدمة لمتابعة زوار المتجر وسلوكهم", category: "تحليلات", icon: BarChart3, color: "bg-[#F57C00]", installed: true, popular: true, free: true },
  { id: "meta_pixel", name: "Meta Pixel", name_en: "Meta Pixel", description: "تتبع التحويلات من إعلانات فيسبوك وإنستقرام", category: "تسويق", icon: Camera, color: "bg-[#1877F2]", installed: false, popular: true, free: true },
  { id: "snapchat_pixel", name: "Snapchat Pixel", name_en: "Snapchat Pixel", description: "تتبع أداء حملات سناب شات الإعلانية", category: "تسويق", icon: Camera, color: "bg-[#FFFC00]", installed: false, popular: false, free: true },
  { id: "tiktok_pixel", name: "TikTok Pixel", name_en: "TikTok Pixel", description: "تتبع التحويلات من إعلانات تيك توك", category: "تسويق", icon: Camera, color: "bg-foreground", installed: false, popular: true, free: true },
  { id: "whatsapp", name: "واتساب بزنس", name_en: "WhatsApp Business", description: "تواصل مباشر مع العملاء عبر واتساب", category: "تواصل", icon: MessageSquare, color: "bg-[#25D366]", installed: true, popular: true, free: true },
  { id: "mailchimp", name: "Mailchimp", name_en: "Mailchimp", description: "حملات بريد إلكتروني تلقائية واحترافية", category: "تسويق", icon: Mail, color: "bg-[#FFE01B]", installed: false, popular: false, free: false, price: 49 },
  { id: "chatbot", name: "بوت المحادثة الذكي", name_en: "AI Chatbot", description: "رد تلقائي ذكي على استفسارات العملاء 24/7", category: "تواصل", icon: MessageSquare, color: "bg-accent-water", installed: false, popular: false, free: false, price: 99 },
  { id: "custom_domain", name: "نطاق مخصص", name_en: "Custom Domain", description: "ربط دومين خاص بمتجرك (.com, .sa)", category: "بنية", icon: Globe, color: "bg-primary", installed: false, popular: false, free: false, price: 29 },
];

const categories = ["الكل", "دفع", "شحن", "تسويق", "تحليلات", "تواصل", "بنية"];

const AppStoreManager: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [installedApps, setInstalledApps] = useState<Set<string>>(
    new Set(apps.filter(a => a.installed).map(a => a.id))
  );

  const filtered = apps.filter(app => {
    if (category !== "الكل" && app.category !== category) return false;
    if (search && !app.name.includes(search) && !app.name_en.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleInstall = (id: string) => {
    setInstalledApps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">متجر التطبيقات</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {installedApps.size} تطبيق مفعّل من أصل {apps.length}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن تطبيق..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-border bg-card text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-accent-water/30"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(app => {
          const isInstalled = installedApps.has(app.id);
          const Icon = app.icon;
          return (
            <div key={app.id} className={`glass-card rounded-2xl p-5 transition-all ${isInstalled ? "ring-2 ring-success/30" : ""}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-foreground truncate">{app.name}</h3>
                    {app.popular && (
                      <span className="px-1.5 py-0.5 bg-warning/10 text-warning text-[10px] font-bold rounded-full">شائع</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">{app.name_en}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs font-arabic mb-4 line-clamp-2">{app.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {app.free ? "مجاني" : app.price ? `${app.price} ر.س/شهر` : "حسب الاستخدام"}
                </span>
                <button
                  onClick={() => toggleInstall(app.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isInstalled
                      ? "bg-success/10 text-success border border-success/30"
                      : "bg-primary text-primary-foreground hover:bg-primary-light"
                  }`}
                >
                  {isInstalled ? <><Check className="w-3 h-3" /> مفعّل</> : "تفعيل"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <AppWindow className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-arabic">لا توجد تطبيقات مطابقة</p>
        </div>
      )}
    </div>
  );
};

export default AppStoreManager;
