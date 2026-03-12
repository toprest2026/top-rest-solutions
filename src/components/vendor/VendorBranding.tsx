import React, { useState } from "react";
import { Palette, Upload, Eye } from "lucide-react";

const VendorBranding: React.FC = () => {
  const [branding, setBranding] = useState({
    primary_color: "#0ea5e9",
    secondary_color: "#1e293b",
    logo_url: "",
    store_name: "متجري",
    slogan: "أفضل المنتجات بأفضل الأسعار",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">الهوية والألوان</h1>
          <p className="text-muted-foreground text-sm mt-1">تخصيص مظهر متجرك وهويته البصرية</p>
        </div>
        <button className="btn-accent px-4 py-2 text-sm rounded-xl flex items-center gap-2">
          <Eye className="w-4 h-4" />
          معاينة المتجر
        </button>
      </div>

      {/* Logo */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">شعار المتجر</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground/30" />
            )}
          </div>
          <div>
            <button className="btn-primary px-4 py-2 text-sm rounded-xl mb-2">رفع شعار</button>
            <p className="text-xs text-muted-foreground">PNG أو SVG، الحد الأقصى 2MB</p>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">ألوان المتجر</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">اللون الرئيسي</label>
            <div className="flex items-center gap-2">
              <input type="color" value={branding.primary_color}
                onChange={e => setBranding(p => ({ ...p, primary_color: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <input type="text" value={branding.primary_color}
                onChange={e => setBranding(p => ({ ...p, primary_color: e.target.value }))}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">اللون الثانوي</label>
            <div className="flex items-center gap-2">
              <input type="color" value={branding.secondary_color}
                onChange={e => setBranding(p => ({ ...p, secondary_color: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <input type="text" value={branding.secondary_color}
                onChange={e => setBranding(p => ({ ...p, secondary_color: e.target.value }))}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-mono" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 rounded-xl overflow-hidden border border-border">
          <div className="h-12 flex items-center px-4" style={{ background: branding.primary_color }}>
            <span className="text-white font-display font-bold text-sm">{branding.store_name}</span>
          </div>
          <div className="p-4 bg-card">
            <div className="w-full h-8 rounded-lg" style={{ background: branding.secondary_color }} />
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">معلومات المتجر</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">اسم المتجر</label>
            <input value={branding.store_name} onChange={e => setBranding(p => ({ ...p, store_name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">الشعار النصي</label>
            <input value={branding.slogan} onChange={e => setBranding(p => ({ ...p, slogan: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary px-5 py-2 text-sm rounded-xl">حفظ التغييرات</button>
        </div>
      </div>
    </div>
  );
};

export default VendorBranding;
