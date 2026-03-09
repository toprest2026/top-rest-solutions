
import React from "react";
import { Building2, Factory, Truck } from "lucide-react";
import type { SupplierFormData } from "./types";

interface Props {
  form: SupplierFormData;
  onChange: (updates: Partial<SupplierFormData>) => void;
}

const businessTypes = [
  { id: 'factory' as const, label: 'مصنع', icon: Factory, desc: 'مصنع مياه أو منتجات' },
  { id: 'company' as const, label: 'مؤسسة / شركة', icon: Building2, desc: 'شركة توزيع أو تجزئة' },
  { id: 'cash_van' as const, label: 'كاش فان', icon: Truck, desc: 'بائع متجول - بدون سجل تجاري' },
];

const StepLegalEntity: React.FC<Props> = ({ form, onChange }) => {
  const isCashVan = form.business_type === 'cash_van';

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-arabic text-muted-foreground mb-2 block">نوع النشاط *</label>
        <div className="grid grid-cols-3 gap-3">
          {businessTypes.map(bt => {
            const Icon = bt.icon;
            return (
              <button
                key={bt.id}
                type="button"
                onClick={() => onChange({ business_type: bt.id, has_vat: bt.id === 'cash_van' ? false : form.has_vat })}
                className={`p-3 rounded-xl border-2 text-center transition-all ${form.business_type === bt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'}`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="font-bold text-sm text-foreground">{bt.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{bt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم المنشأة (عربي) *</label>
          <input value={form.name_ar} onChange={e => onChange({ name_ar: e.target.value })} className="search-input" placeholder="اسم المنشأة التجاري" />
        </div>
        <div>
          <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم المنشأة (إنجليزي)</label>
          <input value={form.name_en} onChange={e => onChange({ name_en: e.target.value })} className="search-input" placeholder="Company Name" dir="ltr" />
        </div>
      </div>

      {/* VAT */}
      <div className={isCashVan ? 'opacity-50 pointer-events-none' : ''}>
        <div className="flex items-center gap-3 mb-2">
          <label className="text-sm font-arabic text-muted-foreground">هل لديه شهادة ضريبية؟</label>
          <button
            type="button"
            onClick={() => onChange({ has_vat: !form.has_vat })}
            className={`w-10 h-5 rounded-full transition-colors relative ${form.has_vat ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.has_vat ? 'right-0.5' : 'right-[calc(100%-1.125rem)]'}`} />
          </button>
        </div>
        {form.has_vat && (
          <div>
            <label className="text-sm font-arabic text-muted-foreground mb-1 block">الرقم الضريبي (15 رقم يبدأ بـ 3) *</label>
            <input
              value={form.vat_number}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 15);
                onChange({ vat_number: v });
              }}
              className="search-input"
              placeholder="3XXXXXXXXXXXXXX"
              dir="ltr"
              maxLength={15}
            />
            {form.vat_number && (!form.vat_number.startsWith('3') || form.vat_number.length !== 15) && (
              <p className="text-xs text-destructive mt-1">يجب أن يبدأ بـ 3 ويتكون من 15 رقم</p>
            )}
          </div>
        )}
      </div>

      {/* CR Number */}
      <div className={isCashVan ? 'opacity-50 pointer-events-none' : ''}>
        <label className="text-sm font-arabic text-muted-foreground mb-1 block">رقم السجل التجاري أو الرقم الموحد (700) *</label>
        <input
          value={form.cr_number}
          onChange={e => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 10);
            onChange({ cr_number: v });
          }}
          className="search-input"
          placeholder="10 أرقام"
          dir="ltr"
          maxLength={10}
        />
        {form.cr_number && form.cr_number.length !== 10 && (
          <p className="text-xs text-destructive mt-1">يجب أن يتكون من 10 أرقام</p>
        )}
      </div>
    </div>
  );
};

export default StepLegalEntity;
