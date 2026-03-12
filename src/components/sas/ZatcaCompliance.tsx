import React, { useState } from "react";
import { FileText, CheckCircle2, AlertTriangle, Shield, Settings, RefreshCw, Receipt, Calculator } from "lucide-react";

const ZatcaCompliance: React.FC = () => {
  const [phase, setPhase] = useState<"phase1" | "phase2">("phase2");
  const [settings, setSettings] = useState({
    vat_rate: 15,
    auto_invoice: true,
    e_invoice_enabled: true,
    zatca_integration: false,
    tax_number: "300000000000003",
  });

  const complianceChecks = [
    { label: "الفوترة الإلكترونية (المرحلة الأولى)", status: "pass", detail: "مطبّق - QR Code + UUID" },
    { label: "الربط مع هيئة الزكاة (المرحلة الثانية)", status: settings.zatca_integration ? "pass" : "pending", detail: settings.zatca_integration ? "مربوط" : "قيد الإعداد" },
    { label: "ضريبة القيمة المضافة 15%", status: "pass", detail: `النسبة: ${settings.vat_rate}%` },
    { label: "رقم ضريبي صالح", status: settings.tax_number.length === 15 ? "pass" : "fail", detail: settings.tax_number || "غير محدد" },
    { label: "حفظ الفواتير 6 سنوات", status: "pass", detail: "مفعّل - أرشفة تلقائية" },
    { label: "عرض تفاصيل الضريبة في الفاتورة", status: "pass", detail: "المبلغ + الضريبة + الإجمالي" },
  ];

  const statusIcon = (s: string) => {
    if (s === "pass") return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (s === "pending") return <RefreshCw className="w-5 h-5 text-warning" />;
    return <AlertTriangle className="w-5 h-5 text-destructive" />;
  };

  const passCount = complianceChecks.filter(c => c.status === "pass").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">الامتثال والزكاة</h1>
        <p className="text-muted-foreground text-sm mt-1">تهيئة الربط مع هيئة الزكاة والدخل والفوترة الإلكترونية</p>
      </div>

      {/* Score */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center" style={{
          background: `conic-gradient(hsl(var(--success)) ${(passCount / complianceChecks.length) * 100}%, hsl(var(--muted)) 0%)`
        }}>
          <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
            <span className="font-display font-black text-2xl text-foreground">{Math.round((passCount / complianceChecks.length) * 100)}%</span>
          </div>
        </div>
        <p className="font-display font-bold text-foreground">نسبة الامتثال</p>
        <p className="text-xs text-muted-foreground mt-1">{passCount} من {complianceChecks.length} متطلبات مستوفاة</p>
      </div>

      {/* Compliance Checks */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">قائمة التحقق</h3>
        <div className="space-y-3">
          {complianceChecks.map((check, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              {statusIcon(check.status)}
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{check.label}</p>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                check.status === "pass" ? "bg-success/10 text-success" :
                check.status === "pending" ? "bg-warning/10 text-warning" :
                "bg-destructive/10 text-destructive"
              }`}>
                {check.status === "pass" ? "مطابق" : check.status === "pending" ? "قيد الإعداد" : "غير مطابق"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Settings */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">إعدادات الضريبة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1 font-arabic">نسبة ضريبة القيمة المضافة</label>
            <div className="flex items-center gap-2">
              <input type="number" value={settings.vat_rate} onChange={e => setSettings(p => ({ ...p, vat_rate: +e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm" />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1 font-arabic">الرقم الضريبي للمنصة</label>
            <input type="text" value={settings.tax_number} onChange={e => setSettings(p => ({ ...p, tax_number: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-mono" maxLength={15} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { key: "auto_invoice", label: "توليد فواتير ضريبية تلقائياً" },
            { key: "e_invoice_enabled", label: "تفعيل الفوترة الإلكترونية (QR + UUID)" },
            { key: "zatca_integration", label: "الربط المباشر مع هيئة الزكاة (المرحلة الثانية)" },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/30">
              <span className="text-sm text-foreground">{item.label}</span>
              <input
                type="checkbox"
                checked={(settings as any)[item.key]}
                onChange={e => setSettings(p => ({ ...p, [item.key]: e.target.checked }))}
                className="w-5 h-5 rounded accent-accent-water"
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button className="btn-primary px-5 py-2 text-sm rounded-xl">حفظ الإعدادات</button>
        </div>
      </div>
    </div>
  );
};

export default ZatcaCompliance;
