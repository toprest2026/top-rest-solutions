import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Package, Tag } from "lucide-react";

const categories = ["الكل", "جالونات", "قوارير", "عروض", "اشتراكات", "أجهزة"];

const initialProducts = [
  { id: 1, name: "جالون مياه 19 لتر", sku: "WTR-19L", category: "جالونات", price: 15, stock: 240, status: "نشط" },
  { id: 2, name: "مياه 1.5 لتر", sku: "WTR-1500ML", category: "قوارير", price: 2.5, stock: 1200, status: "نشط" },
  { id: 3, name: "مياه 500 مل", sku: "WTR-500ML", category: "قوارير", price: 1.5, stock: 0, status: "نفد" },
  { id: 4, name: "كرتون 6 جالون", sku: "PKG-6GL", category: "عروض", price: 80, stock: 50, status: "نشط" },
  { id: 5, name: "برادة مياه كهربائية", sku: "DSP-001", category: "أجهزة", price: 349, stock: 15, status: "نشط" },
  { id: 6, name: "اشتراك شهري عائلي", sku: "SUB-FAM", category: "اشتراكات", price: 150, stock: 999, status: "نشط" },
];

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.includes(search) || p.sku.includes(search);
    const matchCat = activeCategory === "الكل" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">إدارة المنتجات</h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">
            {products.length} منتج — {products.filter((p) => p.stock === 0).length} نفد المخزون
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن منتج أو SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input pr-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-arabic transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الفئة</th>
                <th>SKU</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-primary px-2 py-0.5 rounded-full text-xs font-bold">
                      {product.category}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">{product.sku}</td>
                  <td className="font-bold text-primary">{product.price} ر.س</td>
                  <td>
                    <span className={`font-bold ${product.stock === 0 ? "text-destructive" : product.stock < 20 ? "text-warning" : "text-success"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      product.status === "نشط" ? "badge-success" : "text-destructive bg-destructive/10 border border-destructive/30"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-accent-water transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProducts((p) => p.filter((pr) => pr.id !== product.id))}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      >
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
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-water-xl">
            <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Tag className="w-5 h-5 text-accent-water" />
              إضافة منتج جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">اسم المنتج</label>
                <input className="search-input" placeholder="مثال: جالون مياه 19 لتر" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">السعر (ر.س)</label>
                  <input className="search-input" type="number" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-arabic text-muted-foreground mb-1 block">المخزون</label>
                  <input className="search-input" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">الفئة</label>
                <select className="search-input">
                  {categories.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 py-2.5 text-sm rounded-xl">حفظ المنتج</button>
              <button
                onClick={() => setShowAdd(false)}
                className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
