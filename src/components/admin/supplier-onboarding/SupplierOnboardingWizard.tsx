
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Building2, Users, Landmark, FileText, Loader2, CheckCircle2, X } from "lucide-react";
import StepLegalEntity from "./StepLegalEntity";
import StepDelegates from "./StepDelegates";
import StepBankInfo from "./StepBankInfo";
import StepDocuments from "./StepDocuments";
import type { SupplierFormData } from "./types";
import { INITIAL_FORM } from "./types";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const steps = [
  { id: 0, label: 'البيانات الرسمية', icon: Building2 },
  { id: 1, label: 'المفوضين', icon: Users },
  { id: 2, label: 'البيانات البنكية', icon: Landmark },
  { id: 3, label: 'المستندات', icon: FileText },
];

const SupplierOnboardingWizard: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SupplierFormData>({ ...INITIAL_FORM });
  const [saving, setSaving] = useState(false);

  const update = (updates: Partial<SupplierFormData>) => setForm(f => ({ ...f, ...updates }));

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.name_ar) { toast({ title: 'خطأ', description: 'اسم المنشأة مطلوب', variant: 'destructive' }); return false; }
      if (form.business_type !== 'cash_van') {
        if (!form.cr_number || form.cr_number.length !== 10) { toast({ title: 'خطأ', description: 'رقم السجل التجاري يجب أن يكون 10 أرقام', variant: 'destructive' }); return false; }
        if (form.has_vat && (!form.vat_number || form.vat_number.length !== 15 || !form.vat_number.startsWith('3'))) {
          toast({ title: 'خطأ', description: 'الرقم الضريبي يجب أن يبدأ بـ 3 ويتكون من 15 رقم', variant: 'destructive' }); return false;
        }
      }
      return true;
    }
    if (step === 1) {
      const d0 = form.delegates[0];
      if (!d0.full_name || !d0.phone || d0.phone.length !== 10) {
        toast({ title: 'خطأ', description: 'بيانات المفوض الرئيسي غير مكتملة', variant: 'destructive' }); return false;
      }
      if (!d0.email) { toast({ title: 'خطأ', description: 'البريد الإلكتروني مطلوب', variant: 'destructive' }); return false; }
      return true;
    }
    if (step === 2) {
      if (!form.bank_name) { toast({ title: 'خطأ', description: 'يرجى اختيار البنك', variant: 'destructive' }); return false; }
      if (!form.iban || form.iban.length !== 24) { toast({ title: 'خطأ', description: 'رقم الآيبان غير صحيح', variant: 'destructive' }); return false; }
      return true;
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSaving(true);

    // 1. Create supplier
    const { data: supplier, error: supErr } = await supabase.from('suppliers').insert({
      name_ar: form.name_ar,
      name_en: form.name_en || null,
      email: form.delegates[0].email,
      phone: form.delegates[0].phone,
      business_type: form.business_type,
      has_vat: form.has_vat,
      vat_number: form.has_vat ? form.vat_number : null,
      cr_number: form.business_type !== 'cash_van' ? form.cr_number : null,
      bank_name: form.bank_name,
      iban: form.iban,
      onboarding_status: 'pending',
      active: false,
    } as any).select('id').single();

    if (supErr || !supplier) {
      toast({ title: 'خطأ', description: supErr?.message ?? 'فشل إنشاء المورد', variant: 'destructive' });
      setSaving(false);
      return;
    }

    // 2. Create delegates
    const delegateInserts = form.delegates.map((d, i) => ({
      supplier_id: supplier.id,
      full_name: d.full_name,
      national_id: d.national_id || null,
      nationality: d.nationality,
      phone: d.phone,
      phone_verified: d.phone_verified,
      email: d.email,
      role_title: d.role_title || null,
      is_contract_signee: i === 0,
      sort_order: i,
    }));
    await supabase.from('supplier_delegates').insert(delegateInserts);

    // 3. Create document records (without actual file upload for now)
    if (form.documents.length > 0) {
      const docInserts = form.documents.map(d => ({
        supplier_id: supplier.id,
        doc_type: d.doc_type,
        file_url: null,
      }));
      await supabase.from('supplier_documents').insert(docInserts);
    }

    setSaving(false);
    toast({ title: 'تم بنجاح', description: 'تم تسجيل المورد الجديد وإرساله للمراجعة' });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl shadow-water-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-foreground text-lg">تسجيل مورد جديد</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-border overflow-x-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={s.id}
                onClick={() => { if (i < step) setStep(i); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  active ? 'bg-primary text-primary-foreground' :
                  done ? 'bg-success/10 text-success' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 0 && <StepLegalEntity form={form} onChange={update} />}
          {step === 1 && <StepDelegates form={form} onChange={update} />}
          {step === 2 && <StepBankInfo form={form} onChange={update} />}
          {step === 3 && <StepDocuments form={form} onChange={update} />}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-border">
          {step > 0 && (
            <button onClick={handlePrev} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">السابق</button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="btn-primary flex-1 py-2.5 text-sm rounded-xl">التالي</button>
          ) : (
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm rounded-xl flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              تسجيل المورد
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierOnboardingWizard;
