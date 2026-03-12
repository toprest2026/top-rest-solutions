import React, { useState } from "react";
import { Palette, Eye, Star, Check, Layout, Sparkles } from "lucide-react";

interface ThemeItem {
  id: string;
  name: string;
  name_en: string;
  description: string;
  preview_color: string;
  category: string;
  active: boolean;
  users_count: number;
}

const themes: ThemeItem[] = [
  { id: "fast", name: "السريع", name_en: "Fast", description: "تصميم بسيط وسريع للطلبات اليومية", preview_color: "from-sky-400 to-blue-600", category: "أساسي", active: true, users_count: 45 },
  { id: "wholesale", name: "الجملة", name_en: "Wholesale", description: "مصمم لعمليات البيع بالجملة والكميات الكبيرة", preview_color: "from-emerald-400 to-teal-600", category: "أساسي", active: true, users_count: 23 },
  { id: "premium", name: "الفاخر", name_en: "Premium", description: "تصميم راقي للعلامات التجارية المتميزة", preview_color: "from-amber-400 to-orange-600", category: "متقدم", active: true, users_count: 12 },
  { id: "minimal", name: "الحد الأدنى", name_en: "Minimal", description: "تصميم نظيف مع التركيز على المنتجات", preview_color: "from-gray-400 to-slate-600", category: "أساسي", active: false, users_count: 0 },
  { id: "dark", name: "الداكن", name_en: "Dark Mode", description: "واجهة داكنة عصرية للمتاجر المتميزة", preview_color: "from-violet-500 to-purple-700", category: "متقدم", active: false, users_count: 0 },
  { id: "cashvan", name: "كاش فان", name_en: "Cash Van", description: "مخصص للسائقين المتجولين وأصحاب البضاعة", preview_color: "from-rose-400 to-red-600", category: "خاص", active: true, users_count: 8 },
];

const ThemesManager: React.FC = () => {
  const [filter, setFilter] = useState("الكل");
  const categories = ["الكل", "أساسي", "متقدم", "خاص"];

  const filtered = filter === "الكل" ? themes : themes.filter(t => t.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">بوابة الثيمات والقوالب</h1>
          <p className="text-muted-foreground text-sm mt-1">مكتبة القوالب المتاحة للمستأجرين</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          إضافة قالب جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Palette className="w-6 h-6 text-accent-water mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{themes.length}</p>
          <p className="text-xs text-muted-foreground">إجمالي القوالب</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Check className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-success">{themes.filter(t => t.active).length}</p>
          <p className="text-xs text-muted-foreground">مفعّلة</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Star className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{themes.reduce((s, t) => s + t.users_count, 0)}</p>
          <p className="text-xs text-muted-foreground">مستخدم نشط</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === c ? "bg-accent-water text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(theme => (
          <div key={theme.id} className="glass-card rounded-2xl overflow-hidden group">
            <div className={`h-32 bg-gradient-to-br ${theme.preview_color} relative`}>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="bg-white/90 text-foreground px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  معاينة
                </button>
              </div>
              {theme.active && (
                <span className="absolute top-2 left-2 bg-success text-white px-2 py-0.5 rounded-full text-[10px] font-bold">مفعّل</span>
              )}
              <span className="absolute top-2 right-2 bg-black/40 text-white px-2 py-0.5 rounded-full text-[10px]">{theme.category}</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-bold text-foreground">{theme.name}</h3>
                <span className="text-[10px] text-muted-foreground font-mono">{theme.name_en}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{theme.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{theme.users_count} مستخدم</span>
                <button className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  theme.active
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "bg-accent-water/10 text-accent-water hover:bg-accent-water/20"
                }`}>
                  {theme.active ? "تعطيل" : "تفعيل"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemesManager;
