import React, { useState } from "react";
import { Search, Globe, FileText, Tag, Image, ChevronDown, ChevronUp } from "lucide-react";

const SeoManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"store" | "products">("store");
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [storeSettings, setStoreSettings] = useState({
    title: "توب رست - مياه نقية تصل لبابك | توزيع المياه في السعودية",
    description: "اطلب أفضل المياه المعبأة من توب رست مع توصيل سريع لجميع أنحاء المملكة العربية السعودية. جالونات 19 لتر وعروض خاصة.",
    keywords: "مياه معبأة، توزيع مياه، جالون ماء، مياه السعودية، توب رست",
    ogImage: "https://toprest.sa/og-image.jpg",
    googleId: "GTM-XXXXXXX",
    schemaType: "LocalBusiness",
  });

  const products = [
    { id: 1, name: "جالون مياه 19 لتر", title: "جالون مياه 19 لتر - توب رست", description: "اطلب جالون مياه نقية 19 لتر بتوصيل سريع لمنزلك في الرياض وجميع مناطق المملكة", keywords: "جالون ماء، 19 لتر، مياه منزل" },
    { id: 2, name: "اشتراك شهري عائلي", title: "اشتراك شهري للمياه - توفير 25%", description: "اشترك الآن واحصل على 12 جالون شهرياً بخصم 25% وتوصيل مجاني لمنزلك", keywords: "اشتراك مياه، جالون شهري، توصيل مياه" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">إدارة SEO</h1>
        <p className="text-muted-foreground text-sm font-arabic mt-1">تحسين ظهور المتجر في محركات البحث</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-muted rounded-xl p-1 w-fit">
        {(["store", "products"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-arabic transition-all ${
              activeTab === tab
                ? "bg-card shadow-water-sm text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "store" ? "إعدادات المتجر" : "SEO المنتجات"}
          </button>
        ))}
      </div>

      {activeTab === "store" && (
        <div className="space-y-5">
          {/* Search Preview */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-water" />
              معاينة نتيجة Google
            </h3>
            <div className="bg-background rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">https://toprest.sa</p>
              <p className="text-accent-water font-bold text-base hover:underline cursor-pointer leading-tight mb-1">
                {storeSettings.title}
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {storeSettings.description}
              </p>
            </div>
          </div>

          {/* SEO Settings Form */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 text-accent-water" />
              إعدادات SEO الأساسية
            </h3>

            <div>
              <label className="text-sm font-arabic text-muted-foreground mb-1 block">
                عنوان الصفحة الرئيسية
                <span className={`mr-2 text-xs ${storeSettings.title.length > 60 ? "text-destructive" : "text-success"}`}>
                  ({storeSettings.title.length}/60)
                </span>
              </label>
              <input
                className="search-input"
                value={storeSettings.title}
                onChange={(e) => setStoreSettings((s) => ({ ...s, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-arabic text-muted-foreground mb-1 block">
                وصف الصفحة (Meta Description)
                <span className={`mr-2 text-xs ${storeSettings.description.length > 160 ? "text-destructive" : "text-success"}`}>
                  ({storeSettings.description.length}/160)
                </span>
              </label>
              <textarea
                className="search-input resize-none h-20"
                value={storeSettings.description}
                onChange={(e) => setStoreSettings((s) => ({ ...s, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-arabic text-muted-foreground mb-1 block">الكلمات المفتاحية</label>
              <input
                className="search-input"
                value={storeSettings.keywords}
                onChange={(e) => setStoreSettings((s) => ({ ...s, keywords: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">Google Tag Manager ID</label>
                <input
                  className="search-input"
                  value={storeSettings.googleId}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, googleId: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">Schema النوع</label>
                <select
                  className="search-input"
                  value={storeSettings.schemaType}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, schemaType: e.target.value }))}
                >
                  {["LocalBusiness", "Store", "Organization", "WebSite"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Social Meta */}
            <div className="border-t border-border pt-4">
              <h4 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-accent-water" />
                صورة المشاركة الاجتماعية (OG Image)
              </h4>
              <input
                className="search-input"
                value={storeSettings.ogImage}
                onChange={(e) => setStoreSettings((s) => ({ ...s, ogImage: e.target.value }))}
                placeholder="https://toprest.sa/og-image.jpg"
              />
            </div>

            <button className="btn-primary w-full py-3 text-sm rounded-xl mt-2">
              حفظ إعدادات SEO
            </button>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-sm">{product.name}</p>
                    <p className="text-muted-foreground text-xs font-arabic">{product.title}</p>
                  </div>
                </div>
                {expandedProduct === product.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {expandedProduct === product.id && (
                <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                  <div>
                    <label className="text-sm font-arabic text-muted-foreground mb-1 block">عنوان المنتج (SEO Title)</label>
                    <input className="search-input" defaultValue={product.title} />
                  </div>
                  <div>
                    <label className="text-sm font-arabic text-muted-foreground mb-1 block">وصف المنتج (Meta Description)</label>
                    <textarea className="search-input resize-none h-16" defaultValue={product.description} />
                  </div>
                  <div>
                    <label className="text-sm font-arabic text-muted-foreground mb-1 block">الكلمات المفتاحية</label>
                    <input className="search-input" defaultValue={product.keywords} />
                  </div>
                  <button className="btn-accent py-2 px-6 text-sm rounded-xl">حفظ SEO المنتج</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeoManager;
