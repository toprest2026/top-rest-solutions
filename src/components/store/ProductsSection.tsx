import React, { useState } from "react";
import { ShoppingCart, Star, Tag, Zap, Package } from "lucide-react";
import { Region, CartItem } from "@/pages/Index";
import waterProducts from "@/assets/water-products.jpg";

interface Product {
  id: string;
  nameAr: string;
  descAr: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeType?: "sale" | "new" | "best";
  minQty: number;
}

const products: Product[] = [
  {
    id: "gallon-19l",
    nameAr: "جالون مياه 19 لتر",
    descAr: "مياه نقية معبأة بمعايير صحية عالية",
    price: 15,
    originalPrice: 20,
    unit: "جالون",
    category: "جالونات",
    rating: 4.8,
    reviews: 1240,
    image: waterProducts,
    badge: "الأكثر مبيعاً",
    badgeType: "best",
    minQty: 1,
  },
  {
    id: "bottle-1500ml",
    nameAr: "مياه 1.5 لتر",
    descAr: "زجاجة مياه منعشة للاستخدام اليومي",
    price: 2.5,
    unit: "قارورة",
    category: "قوارير",
    rating: 4.6,
    reviews: 856,
    image: waterProducts,
    badge: "جديد",
    badgeType: "new",
    minQty: 6,
  },
  {
    id: "bottle-500ml",
    nameAr: "مياه 500 مل",
    descAr: "مياه معبأة صغيرة مثالية للرحلات",
    price: 1.5,
    unit: "قارورة",
    category: "قوارير",
    rating: 4.7,
    reviews: 432,
    image: waterProducts,
    minQty: 12,
  },
  {
    id: "package-gallon-6",
    nameAr: "كرتون 6 جالون",
    descAr: "عرض عائلي اقتصادي - 6 جالون 19 لتر",
    price: 80,
    originalPrice: 100,
    unit: "كرتون",
    category: "عروض",
    rating: 4.9,
    reviews: 2100,
    image: waterProducts,
    badge: "خصم 20%",
    badgeType: "sale",
    minQty: 1,
  },
  {
    id: "dispenser",
    nameAr: "برادة مياه كهربائية",
    descAr: "برادة حار وبارد مع ضمان سنة",
    price: 349,
    unit: "جهاز",
    category: "أجهزة",
    rating: 4.5,
    reviews: 320,
    image: waterProducts,
    minQty: 1,
  },
  {
    id: "package-monthly",
    nameAr: "اشتراك شهري - عائلي",
    descAr: "12 جالون شهرياً مع توصيل مجاني",
    price: 150,
    originalPrice: 200,
    unit: "شهر",
    category: "اشتراكات",
    rating: 4.9,
    reviews: 890,
    image: waterProducts,
    badge: "وفّر 25%",
    badgeType: "sale",
    minQty: 1,
  },
];

const categories = ["الكل", "جالونات", "قوارير", "عروض", "اشتراكات", "أجهزة"];

interface ProductsSectionProps {
  selectedRegion: Region | null;
  onAddToCart: (item: CartItem) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ selectedRegion, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filtered = activeCategory === "الكل"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const getQty = (id: string, minQty: number) => quantities[id] ?? minQty;

  const updateQty = (id: string, val: number, min: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(min, val) }));
  };

  return (
    <section id="products" className="py-16 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 badge-primary rounded-full px-4 py-1.5 mb-3 text-sm font-arabic">
              <Package className="w-4 h-4" />
              {selectedRegion ? `منتجات ${selectedRegion.nameAr}` : "جميع المنتجات"}
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              اختر منتجك المفضل
            </h2>
          </div>

          {!selectedRegion && (
            <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning flex-shrink-0" />
              <p className="text-warning text-sm font-arabic">حدد منطقتك للحصول على أسعار خاصة</p>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-arabic transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-water-primary"
                  : "bg-card border border-border text-foreground hover:border-accent-water hover:text-accent-water"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const qty = getQty(product.id, product.minQty);
            return (
              <div key={product.id} className="product-card group">
                {/* Image */}
                <div className="relative h-52 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameAr}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                      product.badgeType === "sale" ? "bg-destructive" :
                      product.badgeType === "best" ? "bg-primary" : "bg-accent-water"
                    }`}>
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display font-bold text-foreground text-base leading-tight">
                      {product.nameAr}
                    </h3>
                    <span className="text-xs font-arabic text-muted-foreground border border-border rounded px-1.5 py-0.5 flex-shrink-0 mr-2">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs font-arabic mb-3 leading-relaxed">
                    {product.descAr}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-warning fill-warning"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-arabic">
                      {product.rating} ({product.reviews.toLocaleString("ar-SA")})
                    </span>
                  </div>

                  {/* Price & Qty */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-display font-black text-primary">
                          {product.price}
                        </span>
                        <span className="text-sm text-muted-foreground font-arabic">
                          ر.س / {product.unit}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground line-through font-arabic">
                            {product.originalPrice} ر.س
                          </span>
                          <span className="text-xs text-success font-bold">
                            وفّر {product.originalPrice - product.price} ر.س
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => updateQty(product.id, qty - 1, product.minQty)}
                        className="w-6 h-6 rounded flex items-center justify-center text-foreground hover:bg-card transition-colors font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{qty}</span>
                      <button
                        onClick={() => updateQty(product.id, qty + 1, product.minQty)}
                        className="w-6 h-6 rounded flex items-center justify-center text-foreground hover:bg-card transition-colors font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() =>
                      onAddToCart({
                        id: product.id,
                        nameAr: product.nameAr,
                        price: product.price,
                        quantity: qty,
                        image: product.image,
                      })
                    }
                    className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm rounded-xl"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    أضف للسلة
                  </button>

                  {/* BNPL Hint */}
                  <p className="text-center text-xs text-muted-foreground mt-2 font-arabic">
                    <Tag className="w-3 h-3 inline ml-1" />
                    أو قسّط مع{" "}
                    <span className="text-accent-water font-semibold">تابي</span> أو{" "}
                    <span className="text-primary font-semibold">تمارا</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
