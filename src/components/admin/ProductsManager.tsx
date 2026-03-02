import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Package, Tag, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name_ar: string;
  name_en: string | null;
  sku: string | null;
  price: number;
  original_price: number | null;
  stock: number | null;
  active: boolean | null;
  category_id: string | null;
  supplier_id: string | null;
  description_ar: string | null;
  image_url: string | null;
  unit: string | null;
  badge: string | null;
  min_qty: number | null;
  created_at: string | null;
}

interface Category {
  id: string;
  name_ar: string;
}

interface Supplier {
  id: string;
  name_ar: string;
}

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeSupplier, setActiveSupplier] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New product form
  const [form, setForm] = useState({
    name_ar: "", sku: "", price: "", stock: "", category_id: "", supplier_id: "",
    description_ar: "", unit: "قطعة", original_price: "", min_qty: "1",
  });

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, catRes, supRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name_ar").order("sort_order"),
      supabase.from("suppliers").select("id, name_ar").order("name_ar"),
    ]);
    if (prodRes.data) setProducts(prodRes.data);
    if (catRes.data) setCategories(catRes.data);
    if (supRes.data) setSuppliers(supRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name_ar ?? "—";
  const getSupplierName = (id: string | null) => suppliers.find(s => s.id === id)?.name_ar ?? "—";

  const filtered = products.filter((p) => {
    const matchSearch = p.name_ar.includes(search) || (p.sku?.includes(search) ?? false);
    const matchCat = activeCategory === "الكل" || p.category_id === activeCategory;
    const matchSup = activeSupplier === "الكل" || p.supplier_id === activeSupplier;
    return matchSearch && matchCat && matchSup;
  });

  const handleAdd = async () => {
    if (!form.name_ar || !form.supplier_id) {
      toast({ title: "خطأ", description: "يرجى تعبئة اسم المنتج واختيار المورد", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name_ar: form.name_ar,
      sku: form.sku || null,
      price: parseFloat(form.price) || 0,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock: parseInt(form.stock) || 0,
      category_id: form.category_id || null,
      supplier_id: form.supplier_id,
      description_ar: form.description_ar || null,
      unit: form.unit || "قطعة",
      min_qty: parseInt(form.min_qty) || 1,
    });
    setSaving(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم", description: "تمت إضافة المنتج بنجاح" });
      setShowAdd(false);
      setForm({ name_ar: "", sku: "", price: "", stock: "", category_id: "", supplier_id: "", description_ar: "", unit: "قطعة", original_price: "", min_qty: "1" });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "تم", description: "تم حذف المنتج" });
    }
  };

  const handleToggleActive = async (id: string, current: boolean | null) => {
    await supabase.from("products").update({ active: !current }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !current } : p));
  };

  // CSV Import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) {
      toast({ title: "خطأ", description: "الملف فارغ أو لا يحتوي على بيانات", variant: "destructive" });
      return;
    }
    const headers = lines[0].split(",").map(h => h.trim());
    const nameIdx = headers.indexOf("name_ar");
    const priceIdx = headers.indexOf("price");
    const skuIdx = headers.indexOf("sku");
    const stockIdx = headers.indexOf("stock");
    const supplierIdx = headers.indexOf("supplier_id");

    if (nameIdx === -1) {
      toast({ title: "خطأ", description: "يجب أن يحتوي الملف على عمود name_ar", variant: "destructive" });
      return;
    }

    const rows = lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim());
      return {
        name_ar: cols[nameIdx] || "",
        price: priceIdx >= 0 ? parseFloat(cols[priceIdx]) || 0 : 0,
        sku: skuIdx >= 0 ? cols[skuIdx] || null : null,
        stock: stockIdx >= 0 ? parseInt(cols[stockIdx]) || 0 : 0,
        supplier_id: supplierIdx >= 0 ? cols[supplierIdx] || null : null,
      };
    }).filter(r => r.name_ar);

    const { error } = await supabase.from("products").insert(rows);
    if (error) {
      toast({ title: "خطأ في الاستيراد", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الاستيراد", description: `تم استيراد ${rows.length} منتج بنجاح` });
      fetchData();
    }
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة المنتجات</h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {products.length} منتج — {products.filter(p => (p.stock ?? 0) === 0).length} نفد المخزون
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="btn-outline-water px-4 py-2.5 text-sm flex items-center gap-2 rounded-xl cursor-pointer">
            <Upload className="w-4 h-4" />
            استيراد CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={() => setShowAdd(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="ابحث عن منتج أو SKU..." value={search} onChange={e => setSearch(e.target.value)} className="search-input pr-9" />
        </div>
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center ml-2">الفئة:</span>
          <button onClick={() => setActiveCategory("الكل")} className={`px-3 py-1.5 rounded-lg text-xs font-arabic transition-all ${activeCategory === "الكل" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}>الكل</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-arabic transition-all ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}>{cat.name_ar}</button>
          ))}
        </div>
        {/* Supplier filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center ml-2">المورد:</span>
          <button onClick={() => setActiveSupplier("الكل")} className={`px-3 py-1.5 rounded-lg text-xs font-arabic transition-all ${activeSupplier === "الكل" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}>الكل</button>
          {suppliers.map(s => (
            <button key={s.id} onClick={() => setActiveSupplier(s.id)} className={`px-3 py-1.5 rounded-lg text-xs font-arabic transition-all ${activeSupplier === s.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}>{s.name_ar}</button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>المورد</th>
                <th>الفئة</th>
                <th>SKU</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">لا توجد منتجات</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">{product.name_ar}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-arabic text-accent-foreground bg-accent/50 px-2 py-0.5 rounded-full">
                      {getSupplierName(product.supplier_id)}
                    </span>
                  </td>
                  <td>
                    <span className="badge-primary px-2 py-0.5 rounded-full text-xs font-bold">
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">{product.sku ?? "—"}</td>
                  <td className="font-bold text-primary">{product.price} ر.س</td>
                  <td>
                    <span className={`font-bold ${(product.stock ?? 0) === 0 ? "text-destructive" : (product.stock ?? 0) < 20 ? "text-warning" : "text-success"}`}>
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleToggleActive(product.id, product.active)} className={`px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer ${product.active ? "badge-success" : "text-destructive bg-destructive/10 border border-destructive/30"}`}>
                      {product.active ? "نشط" : "معطل"}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg shadow-water-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-accent-water" />
                إضافة منتج جديد
              </h3>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">المورد *</label>
                <select value={form.supplier_id} onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))} className="search-input">
                  <option value="">اختر المورد</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم المنتج *</label>
                <input value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} className="search-input" placeholder="مثال: جالون مياه 19 لتر" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">السعر (ر.س)</label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="search-input" type="number" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">السعر الأصلي</label>
                  <input value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} className="search-input" type="number" placeholder="اختياري" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">المخزون</label>
                  <input value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="search-input" type="number" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="search-input" placeholder="WTR-001" />
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الحد الأدنى</label>
                  <input value={form.min_qty} onChange={e => setForm(f => ({ ...f, min_qty: e.target.value }))} className="search-input" type="number" placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الفئة</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="search-input">
                    <option value="">بدون فئة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">الوحدة</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="search-input">
                    <option>قطعة</option><option>لتر</option><option>كرتون</option><option>جالون</option><option>عبوة</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">الوصف</label>
                <textarea value={form.description_ar} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} className="search-input min-h-[60px]" placeholder="وصف المنتج..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm rounded-xl flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                حفظ المنتج
              </button>
              <button onClick={() => setShowAdd(false)} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
