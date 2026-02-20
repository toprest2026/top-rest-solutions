import React from "react";
import { ShoppingCart, MapPin, Phone, Menu } from "lucide-react";
import { Region } from "@/pages/Index";
import { Link } from "react-router-dom";

interface StoreNavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  selectedRegion: Region | null;
}

const StoreNavbar: React.FC<StoreNavbarProps> = ({
  cartCount,
  onCartOpen,
  selectedRegion,
}) => {
  return (
    <header className="navbar-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-water flex items-center justify-center shadow-water-glow">
              <span className="text-white font-display font-bold text-lg">ت</span>
            </div>
            <div>
              <p className="text-white font-display font-bold text-lg leading-tight">توب رست</p>
              <p className="text-accent-water text-xs leading-tight">لتوزيع المياه</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#products" className="text-white/80 hover:text-accent-water transition-colors text-sm font-arabic">المنتجات</a>
            <a href="#regions" className="text-white/80 hover:text-accent-water transition-colors text-sm font-arabic">المناطق</a>
            <a href="#payment" className="text-white/80 hover:text-accent-water transition-colors text-sm font-arabic">طرق الدفع</a>
            <Link to="/admin" className="text-white/80 hover:text-accent-water transition-colors text-sm font-arabic">لوحة التحكم</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {selectedRegion && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent-water" />
                <span className="text-white text-xs font-arabic">{selectedRegion.nameAr}</span>
              </div>
            )}

            <a href="tel:+966" className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors">
              <Phone className="w-3.5 h-3.5 text-accent-water" />
              <span className="text-white text-xs">920000000</span>
            </a>

            <button
              onClick={onCartOpen}
              className="relative btn-accent px-4 py-2 text-sm flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline font-arabic">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="md:hidden text-white/80 hover:text-white p-2">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreNavbar;
