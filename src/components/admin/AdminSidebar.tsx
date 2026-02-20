import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Search,
  Image,
  Webhook,
  ChevronRight,
  Settings,
  BarChart3,
  Tag,
  Truck,
} from "lucide-react";
import { AdminSection } from "@/pages/AdminDashboard";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    id: "overview" as AdminSection,
    label: "نظرة عامة",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "products" as AdminSection,
    label: "المنتجات والوحدات",
    icon: Package,
    badge: null,
  },
  {
    id: "orders" as AdminSection,
    label: "الطلبات",
    icon: ShoppingBag,
    badge: "12",
  },
  {
    id: "suppliers" as AdminSection,
    label: "الموردون",
    icon: Truck,
    badge: null,
  },
  {
    id: "banners" as AdminSection,
    label: "البنرات والإعلانات",
    icon: Image,
    badge: null,
  },
  {
    id: "seo" as AdminSection,
    label: "تحسين SEO",
    icon: Search,
    badge: null,
  },
  {
    id: "webhooks" as AdminSection,
    label: "Webhooks والإشعارات",
    icon: Webhook,
    badge: null,
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  open,
}) => {
  return (
    <aside
      className={`admin-sidebar flex flex-col transition-all duration-300 flex-shrink-0 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-water flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-bold">ت</span>
          </div>
          {open && (
            <div>
              <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight">
                توب رست
              </p>
              <p className="text-sidebar-primary text-xs">لوحة التحكم</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {open && (
          <p className="text-sidebar-foreground/40 text-xs px-3 py-2 uppercase tracking-widest font-arabic">
            القائمة الرئيسية
          </p>
        )}

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`sidebar-item w-full ${activeSection === item.id ? "active" : ""} ${
              !open ? "justify-center px-2" : ""
            }`}
            title={!open ? item.label : undefined}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
            {open && (
              <>
                <span className="flex-1 text-right">{item.label}</span>
                {item.badge && (
                  <span className="bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}

        {open && (
          <p className="text-sidebar-foreground/40 text-xs px-3 py-2 pt-4 uppercase tracking-widest font-arabic">
            التقارير
          </p>
        )}

        <button
          className={`sidebar-item w-full ${!open ? "justify-center px-2" : ""}`}
          title={!open ? "التقارير" : undefined}
        >
          <BarChart3 style={{ width: 18, height: 18 }} className="flex-shrink-0" />
          {open && <span className="flex-1 text-right">التقارير والتحليلات</span>}
        </button>

        <button
          className={`sidebar-item w-full ${!open ? "justify-center px-2" : ""}`}
          title={!open ? "الكوبونات" : undefined}
        >
          <Tag style={{ width: 18, height: 18 }} className="flex-shrink-0" />
          {open && <span className="flex-1 text-right">الكوبونات والخصومات</span>}
        </button>

        <button
          className={`sidebar-item w-full ${!open ? "justify-center px-2" : ""}`}
          title={!open ? "العملاء" : undefined}
        >
          <Users style={{ width: 18, height: 18 }} className="flex-shrink-0" />
          {open && <span className="flex-1 text-right">إدارة العملاء</span>}
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          className={`sidebar-item w-full ${!open ? "justify-center px-2" : ""}`}
          title={!open ? "الإعدادات" : undefined}
        >
          <Settings style={{ width: 18, height: 18 }} className="flex-shrink-0" />
          {open && <span className="flex-1 text-right">إعدادات المتجر</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
