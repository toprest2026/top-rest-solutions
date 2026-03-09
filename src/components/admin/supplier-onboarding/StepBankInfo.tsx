
import React from "react";
import { Landmark, CheckCircle2, AlertTriangle } from "lucide-react";
import type { SupplierFormData } from "./types";
import { SAUDI_BANKS } from "./types";

interface Props {
  form: SupplierFormData;
  onChange: (updates: Partial<SupplierFormData>) => void;
}

const validateIBAN = (iban: string): boolean => {
  if (!iban.startsWith('SA') || iban.length !== 24) return false;
  return /^SA\d{22}$/.test(iban);
};

const StepBankInfo: React.FC<Props> = ({ form, onChange }) => {
  const ibanValid = form.iban ? validateIBAN(form.iban) : null;

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Landmark className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">البيانات البنكية</span>
        </div>

        <div>
          <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم البنك *</label>
          <select value={form.bank_name} onChange={e => onChange({ bank_name: e.target.value })} className="search-input">
            <option value="">اختر البنك</option>
            {SAUDI_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-arabic text-muted-foreground mb-1 block">رقم الآيبان (IBAN) *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground font-bold">SA</span>
            <input
              value={form.iban.replace(/^SA/, '')}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 22);
                onChange({ iban: 'SA' + digits });
              }}
              className="search-input flex-1"
              placeholder="XXXXXXXXXXXXXXXXXXXXXX"
              dir="ltr"
              maxLength={22}
            />
          </div>
          {form.iban.length > 2 && (
            <div className="flex items-center gap-1 mt-1">
              {ibanValid ? (
                <><CheckCircle2 className="w-3 h-3 text-success" /><span className="text-xs text-success">رقم الآيبان صحيح</span></>
              ) : (
                <><AlertTriangle className="w-3 h-3 text-destructive" /><span className="text-xs text-destructive">يجب أن يكون 24 حرف (SA + 22 رقم)</span></>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground font-arabic">📎 يرجى إرفاق صورة شهادة الآيبان في خطوة المستندات</p>
        </div>
      </div>
    </div>
  );
};

export default StepBankInfo;
