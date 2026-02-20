import React, { useState } from "react";
import StoreNavbar from "@/components/store/StoreNavbar";
import HeroSection from "@/components/store/HeroSection";
import RegionSelector from "@/components/store/RegionSelector";
import ProductsSection from "@/components/store/ProductsSection";
import PaymentMethods from "@/components/store/PaymentMethods";
import StoreFooter from "@/components/store/StoreFooter";
import CartDrawer from "@/components/store/CartDrawer";

export type Region = {
  id: string;
  name: string;
  nameAr: string;
  available: boolean;
};

export const regions: Region[] = [
  { id: "riyadh", name: "Riyadh", nameAr: "الرياض", available: true },
  { id: "jeddah", name: "Jeddah", nameAr: "جدة", available: true },
  { id: "mecca", name: "Mecca", nameAr: "مكة المكرمة", available: true },
  { id: "dammam", name: "Dammam", nameAr: "الدمام", available: true },
  { id: "medina", name: "Medina", nameAr: "المدينة المنورة", available: true },
  { id: "abha", name: "Abha", nameAr: "أبها", available: false },
  { id: "taif", name: "Taif", nameAr: "الطائف", available: true },
  { id: "tabuk", name: "Tabuk", nameAr: "تبوك", available: false },
];

export type CartItem = {
  id: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
};

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <StoreNavbar
        cartCount={totalItems}
        onCartOpen={() => setCartOpen(true)}
        selectedRegion={selectedRegion}
      />

      <HeroSection />

      <RegionSelector
        regions={regions}
        selectedRegion={selectedRegion}
        onSelect={setSelectedRegion}
      />

      <ProductsSection
        selectedRegion={selectedRegion}
        onAddToCart={addToCart}
      />

      <PaymentMethods />

      <StoreFooter />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        setItems={setCartItems}
      />
    </div>
  );
};

export default Index;
