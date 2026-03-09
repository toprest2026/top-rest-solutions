
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  DollarSign, Percent, CreditCard, Truck, Loader2, Plus, Edit2, Save, X,
  Building2, ArrowLeftRight, Wallet, AlertTriangle
} from "lucide-react";

interface ProfitModel {
  id: string;
  supplier_id: string;
  model_type: string;
  commission_rate: number;
  commission_fixed: number;
  subscription_main_branch: number;
  subscription_extra_branch: number;
  dropshipping_margin_type: string;
  dropshipping_margin_value: number;
  cash_commission_rate: number;
  bnpl_fee_rate: number;
  bnpl_fee_bearer: string;
  settlement_cycle: string;
  credit_limit: number;
  warehouse_count: number;
  status: string;
  notes: string | null;
  suppliers?: { name_ar: string } | null;
}

interface Supplier { id: string; name_ar: string; }

const modelTypes = [
  { id: 'commission', label: 'عمولة من المبيعات', icon: Percent, color: 'text-primary' },
  { id: 'subscription', label: 'اشتراك شهري', icon: CreditCard, color: 'text-accent-water' },
  { id: 'dropshipping', label: 'دروبشيبينغ / هامش ربح', icon: Truck, color: 'text-success' },
];

const settlementOptions = [
  { id: 'daily', label: 'يومي' },
  { id: 'every_2_days', label: 'كل يومين' },
  { id: 'weekly', label: 'أسبوعي' },
  { id: 'monthly', label: 'شهري' },
];

const ProfitModelsManager: React.FC = () => {
  const [models, setModels] = useState<ProfitModel[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    supplier_id: '', model_type: 'commission',
    commission_rate: 5, commission_fixed: 0,
    subscription_main_branch: 500, subscription_extra_branch: 200,
    dropshipping_margin_type: 'percentage', dropshipping_margin_value: 10,
    cash_commission_rate: 0, bnpl_fee_rate: 0, bnpl_fee_bearer: 'supplier',
    settlement_cycle: 'monthly', credit_limit: 10000, warehouse_count: 1, notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    const [mRes, sRes] = await Promise.all([
      supabase.from('supplier_profit_models').select('*, suppliers(name_ar)').order('created_at', { ascending: false }),
      supabase.from('suppliers').select('id, name_ar').order('name_ar'),
    ]);
    if (mRes.data) setModels(mRes.data as any);
    if (sRes.data) setSuppliers(sRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.supplier_id) { toast({ title: 'خطأ', description: 'اختر المورد', variant: 'destructive' }); return; }
    setSaving(true);

    const payload: any = {
      supplier_id: form.supplier_id,
      model_type: form.model_type,
      commission_rate: form.commission_rate,
      commission_fixed: form.commission_fixed,
      subscription_main_branch: form.subscription_main_branch,
      subscription_extra_branch: form.subscription_extra_branch,
      dropshipping_margin_type: form.dropshipping_margin_type,
      dropshipping_margin_value: form.dropshipping_margin_value,
      cash_commission_rate: form.cash_commission_rate,
      bnpl_fee_rate: form.bnpl_fee_rate,
      bnpl_fee_bearer: form.bnpl_fee_bearer,
      settlement_cycle: form.settlement_cycle,
      credit_limit: form.credit_limit,
      warehouse_count: form.warehouse_count,
      notes: form.notes || null,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from('supplier_profit_models').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('supplier_profit_models').insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'تم الحفظ' });
      setShowAdd(false); setEditId(null); setForm(emptyForm);
      fetchData();
    }
  };

  const startEdit = (m: ProfitModel) => {
    setForm({
      supplier_id: m.supplier_id, model_type: m.model_type,
      commission_rate: m.commission_rate, commission_fixed: m.commission_fixed,
      subscription_main_branch: m.subscription_main_branch, subscription_extra_branch: m.subscription_extra_branch,
      dropshipping_margin_type: m.dropshipping_margin_type, dropshipping_margin_value: m.dropshipping_margin_value,
      cash_commission_rate: m.cash_commission_rate, bnpl_fee_rate: m.bnpl_fee_rate,
      bnpl_fee_bearer: m.bnpl_fee_bearer, settlement_cycle: m.settlement_cycle,
      credit_limit: m.credit_limit, warehouse_count: m.warehouse_count, notes: m.notes ?? '',
    });
    setEditId(m.id);
    setShowAdd(true);
  };

  const getSupplierName = (m: ProfitModel) => {
    if (m.suppliers && typeof m.suppliers === 'object' && 'name_ar' in m.suppliers) return m.suppliers.name_ar;
    return suppliers.find(s => s.id === m.supplier_id)?.name_ar ?? '—';
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            محرك نموذج الربح والعمولات
          </h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">ربط كل مورد بنظام مالي (عمولة / اشتراك / دروبشيبينغ)</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowAdd(true); }} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          ربط مورد بنموذج ربح
        </button>
      </div>

      {/* Models Grid */}
      {models.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-arabic">لا توجد نماذج ربح مُعدّة بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {models.map(m => {
            const mt = modelTypes.find(t => t.id === m.model_type) ?? modelTypes[0];
            const MtIcon = mt.icon;
            return (
              <div key={m.id} className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground text-sm">{getSupplierName(m)}</span>
                  </div>
                  <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                </div>

                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 ${mt.color}`}>
                  <MtIcon className="w-4 h-4" />
                  <span className="text-sm font-bold">{mt.label}</span>
                </div>

                {m.model_type === 'commission' && (
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>نسبة العمولة: <span className="text-foreground font-bold">{m.commission_rate}%</span></p>
                    {Number(m.commission_fixed) > 0 && <p>خصم مقطوع: <span className="text-foreground font-bold">{m.commission_fixed} ر.س</span></p>}
                  </div>
                )}
                {m.model_type === 'subscription' && (
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>الفرع الرئيسي: <span className="text-foreground font-bold">{m.subscription_main_branch} ر.س/شهر</span></p>
                    <p>كل فرع إضافي: <span className="text-foreground font-bold">{m.subscription_extra_branch} ر.س/شهر</span></p>
                  </div>
                )}
                {m.model_type === 'dropshipping' && (
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>هامش الربح: <span className="text-foreground font-bold">{m.dropshipping_margin_value}{m.dropshipping_margin_type === 'percentage' ? '%' : ' ر.س'}</span></p>
                  </div>
                )}

                <div className="pt-2 border-t border-border text-xs space-y-1 text-muted-foreground">
                  {Number(m.cash_commission_rate) > 0 && <p>عمولة كاش: {m.cash_commission_rate}%</p>}
                  {Number(m.bnpl_fee_rate) > 0 && <p>رسوم تابي/تمارا: {m.bnpl_fee_rate}% ({m.bnpl_fee_bearer === 'supplier' ? 'على المورد' : 'على العميل'})</p>}
                  <p>دورة التسوية: {settlementOptions.find(s => s.id === m.settlement_cycle)?.label}</p>
                  <p>الحد الائتماني: <span className="text-foreground font-bold">{Number(m.credit_limit).toLocaleString()} ر.س</span></p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg shadow-water-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-foreground text-lg">{editId ? 'تعديل نموذج الربح' : 'ربط مورد بنموذج ربح'}</h3>
              <button onClick={() => { setShowAdd(false); setEditId(null); }} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-5">
              {/* Supplier */}
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">المورد *</label>
                <select value={form.supplier_id} onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))} className="search-input" disabled={!!editId}>
                  <option value="">اختر المورد</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
                </select>
              </div>

              {/* Model Type */}
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-2 block">نموذج الربح *</label>
                <div className="grid grid-cols-3 gap-2">
                  {modelTypes.map(mt => {
                    const Icon = mt.icon;
                    return (
                      <button key={mt.id} type="button" onClick={() => setForm(f => ({ ...f, model_type: mt.id }))}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${form.model_type === mt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'}`}>
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${mt.color}`} />
                        <p className="font-bold text-xs text-foreground">{mt.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Commission fields */}
              {form.model_type === 'commission' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">نسبة العمولة (%)</label>
                    <input type="number" value={form.commission_rate} onChange={e => setForm(f => ({ ...f, commission_rate: +e.target.value }))} className="search-input" min={0} max={100} step={0.5} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">خصم مقطوع (ر.س)</label>
                    <input type="number" value={form.commission_fixed} onChange={e => setForm(f => ({ ...f, commission_fixed: +e.target.value }))} className="search-input" min={0} />
                  </div>
                </div>
              )}

              {/* Subscription fields */}
              {form.model_type === 'subscription' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">الفرع الرئيسي (ر.س/شهر)</label>
                    <input type="number" value={form.subscription_main_branch} onChange={e => setForm(f => ({ ...f, subscription_main_branch: +e.target.value }))} className="search-input" min={0} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">كل فرع إضافي (ر.س)</label>
                    <input type="number" value={form.subscription_extra_branch} onChange={e => setForm(f => ({ ...f, subscription_extra_branch: +e.target.value }))} className="search-input" min={0} />
                  </div>
                </div>
              )}

              {/* Dropshipping fields */}
              {form.model_type === 'dropshipping' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">نوع الهامش</label>
                      <select value={form.dropshipping_margin_type} onChange={e => setForm(f => ({ ...f, dropshipping_margin_type: e.target.value }))} className="search-input">
                        <option value="percentage">نسبة مئوية</option>
                        <option value="fixed">مبلغ ثابت لكل صنف</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">قيمة الهامش</label>
                      <input type="number" value={form.dropshipping_margin_value} onChange={e => setForm(f => ({ ...f, dropshipping_margin_value: +e.target.value }))} className="search-input" min={0} />
                    </div>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-2.5 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-warning font-arabic">في هذا النظام، يُخفى سعر البيع النهائي عن المورد ويعرض له فقط سعر التكلفة</p>
                  </div>
                </div>
              )}

              {/* Payment & Settlement */}
              <div className="border-t border-border pt-4 space-y-3">
                <p className="text-sm font-bold text-foreground">إعدادات الدفع والتسوية</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">عمولة الدفع كاش (%)</label>
                    <input type="number" value={form.cash_commission_rate} onChange={e => setForm(f => ({ ...f, cash_commission_rate: +e.target.value }))} className="search-input" min={0} max={100} step={0.5} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">رسوم تابي/تمارا (%)</label>
                    <input type="number" value={form.bnpl_fee_rate} onChange={e => setForm(f => ({ ...f, bnpl_fee_rate: +e.target.value }))} className="search-input" min={0} max={100} step={0.5} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">من يتحمل رسوم BNPL</label>
                    <select value={form.bnpl_fee_bearer} onChange={e => setForm(f => ({ ...f, bnpl_fee_bearer: e.target.value }))} className="search-input">
                      <option value="supplier">المورد</option>
                      <option value="customer">العميل</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">دورة التسوية</label>
                    <select value={form.settlement_cycle} onChange={e => setForm(f => ({ ...f, settlement_cycle: e.target.value }))} className="search-input">
                      {settlementOptions.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">الحد الائتماني (ر.س)</label>
                    <input type="number" value={form.credit_limit} onChange={e => setForm(f => ({ ...f, credit_limit: +e.target.value }))} className="search-input" min={0} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">عدد المستودعات</label>
                    <input type="number" value={form.warehouse_count} onChange={e => setForm(f => ({ ...f, warehouse_count: +e.target.value }))} className="search-input" min={1} />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">ملاحظات</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="search-input min-h-[60px] resize-y" placeholder="ملاحظات إضافية..." />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm rounded-xl flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editId ? 'تحديث' : 'حفظ'}
              </button>
              <button onClick={() => { setShowAdd(false); setEditId(null); }} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitModelsManager;
