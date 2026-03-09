
import React from "react";
import { Plus, Trash2, Shield, CheckCircle2 } from "lucide-react";
import type { SupplierFormData, DelegateData } from "./types";

interface Props {
  form: SupplierFormData;
  onChange: (updates: Partial<SupplierFormData>) => void;
}

const StepDelegates: React.FC<Props> = ({ form, onChange }) => {
  const updateDelegate = (idx: number, updates: Partial<DelegateData>) => {
    const delegates = [...form.delegates];
    delegates[idx] = { ...delegates[idx], ...updates };
    onChange({ delegates });
  };

  const addDelegate = () => {
    onChange({
      delegates: [...form.delegates, {
        full_name: '', national_id: '', nationality: 'سعودي',
        phone: '', phone_verified: false, email: '',
        role_title: '', is_contract_signee: false,
      }]
    });
  };

  const removeDelegate = (idx: number) => {
    if (form.delegates.length <= 1) return;
    onChange({ delegates: form.delegates.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      {form.delegates.map((d, idx) => (
        <div key={idx} className="glass-card rounded-xl p-4 space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm text-foreground">
                {idx === 0 ? 'المفوض الرئيسي (موقّع العقد)' : `مفوض إضافي ${idx}`}
              </span>
            </div>
            {idx > 0 && (
              <button onClick={() => removeDelegate(idx)} className="p-1 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">الاسم الرباعي *</label>
              <input value={d.full_name} onChange={e => updateDelegate(idx, { full_name: e.target.value })} className="search-input" placeholder="الاسم الرباعي كاملاً" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">رقم الهوية / الإقامة *</label>
              <input
                value={d.national_id}
                onChange={e => updateDelegate(idx, { national_id: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="search-input" placeholder="10 أرقام" dir="ltr" maxLength={10}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الجنسية</label>
              <input value={d.nationality} onChange={e => updateDelegate(idx, { nationality: e.target.value })} className="search-input" placeholder="سعودي" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">رقم الجوال (10 أرقام) *</label>
              <div className="flex items-center gap-2">
                <input
                  value={d.phone}
                  onChange={e => updateDelegate(idx, { phone: e.target.value.replace(/\D/g, '').slice(0, 10), phone_verified: false })}
                  className="search-input flex-1" placeholder="05XXXXXXXX" dir="ltr" maxLength={10}
                />
                {d.phone.length === 10 && (
                  <button
                    type="button"
                    onClick={() => updateDelegate(idx, { phone_verified: true })}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${d.phone_verified ? 'bg-success/10 text-success' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                  >
                    {d.phone_verified ? <CheckCircle2 className="w-4 h-4" /> : 'تحقق'}
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">البريد الإلكتروني *</label>
              <input value={d.email} onChange={e => updateDelegate(idx, { email: e.target.value })} className="search-input" placeholder="email@example.com" dir="ltr" type="email" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">الدور الوظيفي</label>
              <input value={d.role_title} onChange={e => updateDelegate(idx, { role_title: e.target.value })} className="search-input" placeholder="مدير عام / مسؤول مبيعات" />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addDelegate} className="w-full py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary text-sm flex items-center justify-center gap-2 transition-all">
        <Plus className="w-4 h-4" />
        إضافة مفوض جديد
      </button>
    </div>
  );
};

export default StepDelegates;
