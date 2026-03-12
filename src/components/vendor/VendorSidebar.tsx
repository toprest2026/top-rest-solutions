import React from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Truck, Palette, Globe, CreditCard,
  BarChart3, Settings, ChevronRight, Store
} from "lucide-react";

export type VendorSection =
  | "overview"
  | "products"
  | "orders"
  | "drivers"
  | "branding"
  | "domain"
  | "payments"
  | "analytics"
  | "settings";

interface VendorSidebarProps {
  activeSection: VendorSection;
  onSectionChange: (section: VendorSection) => void;
  open: boolean;
  onToggle: () => void;
  storeName?: string;
}

const storeNav = [
  { id: "overview" as VendorSection, label: "نظرة عامة", icon: LayoutDashboard },
  { id: "products" as VendorSection, label: "المنتجات والمخزون", icon: Package },
  { id: "orders" as VendorSection, label: "الطلبات", icon: ShoppingBag },
  { id: "drivers" as VendorSection, label: "السائقون", icon: Truck },
];

const customizeNav = [
  { id: "branding" as VendorSection, label: "الهوية والألوان", icon: Palette },
  { id: "domain" as VendorSection, label: "النطاق", icon: Globe },
  { id: "payments" as VendorSection, label: "بوابات الدفع", icon: CreditCard },
];

const toolsNav = [
  { id: "analytics" as VendorSection, label: "التقارير", icon: BarChart3 },
  { id: "settings" as VendorSection, label: "الإعدادات", icon: Settings },
];

const VendorSidebar: React.FC<VendorSidebarProps> = ({ activeSection, onSectionChange, open, storeName }) => {
  const renderItem = (item: { id: VendorSection; label: string; icon: React.ElementType }) => {
    const Icon = item.icon;
    const active = activeSection === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSectionChange(item.id)}
        className={`sidebar-item w-full ${active ? "active" : ""} ${!open ? "justify-center px-2" : ""}`}
        title={!open ? item.label : undefined}
      >
        <Icon className="flex-shrink-0" style={{ width: 18, height: 18 }} />
        {open && <span className="flex-1 text-right">{item.label}</span>}
      </button>
    );
  };

  const renderGroup = (title: string, items: typeof storeNav) => (
    <>
      {open && (
        <p className="text-sidebar-foreground/40 text-xs px-3 py-2 pt-4 uppercase tracking-widest font-arabic">
          {title}
        </p>
      )}
      {items.map(renderItem)}
    </>
  );

  return (
    <aside className={`admin-sidebar flex flex-col transition-all duration-300 flex-shrink-0 ${open ? "w-64" : "w-16"}`}>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-water flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div>
              <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight">{storeName || "متجري"}</p>
              <p className="text-sidebar-primary text-xs">لوحة تحكم المورد</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {renderGroup("المتجر", storeNav)}
        {renderGroup("التخصيص", customizeNav)}
        {renderGroup("أدوات", toolsNav)}
      </nav>
    </aside>
  );
};

export default VendorSidebar;
