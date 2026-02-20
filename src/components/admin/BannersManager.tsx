import React, { useState } from "react";
import { Plus, Image, Edit2, Trash2, Eye, EyeOff, Move } from "lucide-react";

const initialBanners = [
  { id: 1, title: "عرض الصيف - خصم 20%", subtitle: "على جميع الجالونات", link: "/products", active: true, position: "hero", image: "" },
  { id: 2, title: "اشترك الآن ووفّر 25%", subtitle: "اشتراك شهري للمياه", link: "/subscribe", active: true, position: "mid", image: "" },
  { id: 3, title: "برادة مياه مجانية", subtitle: "مع كل اشتراك سنوي", link: "/annual", active: false, position: "side", image: "" },
];

const positions = [
  { id: "hero", label: "البانر الرئيسي" },
  { id: "mid", label: "منتصف الصفحة" },
  { id: "side", label: "جانبي" },
];

const BannersManager: React.FC = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [showAdd, setShowAdd] = useState(false);

  const toggleBanner = (id: number) => {
    setBanners((b) => b.map((ban) => ban.id === id ? { ...ban, active: !ban.active } : ban));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة البنرات</h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {banners.filter((b) => b.active).length} بنر نشط
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          إضافة بنر
        </button>
      </div>

      {/* Position Groups */}
      {positions.map((pos) => {
        const positionBanners = banners.filter((b) => b.position === pos.id);
        return (
          <div key={pos.id}>
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-water" />
              {pos.label}
            </h3>
            <div className="space-y-3">
              {positionBanners.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center border-2 border-dashed border-border">
                  <Image className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm font-arabic">لا توجد بنرات في هذا الموضع</p>
                </div>
              ) : (
                positionBanners.map((banner) => (
                  <div
                    key={banner.id}
                    className={`glass-card rounded-xl p-4 flex items-center gap-4 transition-opacity ${
                      !banner.active ? "opacity-50" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-14 bg-gradient-to-br from-primary to-accent-water rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <Image className="w-6 h-6 text-white/60" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm">{banner.title}</p>
                      <p className="text-muted-foreground text-xs font-arabic">{banner.subtitle}</p>
                      <p className="text-accent-water text-xs mt-1">{banner.link}</p>
                    </div>

                    {/* Status */}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                      banner.active ? "badge-success" : "text-muted-foreground bg-muted border border-border"
                    }`}>
                      {banner.active ? "نشط" : "معطل"}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleBanner(banner.id)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={banner.active ? "إخفاء" : "إظهار"}
                      >
                        {banner.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-accent-water transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setBanners((b) => b.filter((ban) => ban.id !== banner.id))}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {/* Add Banner Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-water-xl">
            <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Image className="w-5 h-5 text-accent-water" />
              إضافة بنر جديد
            </h3>
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent-water transition-colors cursor-pointer">
                <Image className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm font-arabic text-muted-foreground">اضغط لرفع صورة البنر</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG حتى 2MB — 1920×600px</p>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">عنوان البنر</label>
                <input className="search-input" placeholder="عرض الصيف - خصم 30%" />
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">العنوان الفرعي</label>
                <input className="search-input" placeholder="على جميع المنتجات" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الرابط</label>
                  <input className="search-input" placeholder="/products" />
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الموضع</label>
                  <select className="search-input">
                    {positions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 py-2.5 text-sm rounded-xl">إضافة البنر</button>
              <button onClick={() => setShowAdd(false)} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersManager;
