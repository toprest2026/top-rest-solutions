import React from "react";
import {
  LayoutDashboard, Crown, Globe, DollarSign, FileText, Receipt, Shield,
  AppWindow, CreditCard, Server, Palette, Image, FileCheck, Archive
} from "lucide-react";

export type SasSection =
  | "overview"
  | "subscriptions"
  | "storefronts"
  | "profit_models"
  | "contracts"
  | "invoices"
  | "permissions"
  | "app_store"
  | "payment_gateways"
  | "infrastructure"
  | "domains"
  | "themes"
  | "media"
  | "zatca"
  | "financial_archive";

interface SasSidebarProps {
  activeSection: SasSection;
  onSectionChange: (section: SasSection) => void;
  open: boolean;
  onToggle: () => void;
}

const mainNav = [
  { id: "overview" as SasSection, label: "نظرة عامة", icon: LayoutDashboard },
  { id: "subscriptions" as SasSection, label: "الباقات والمشتركين", icon: Crown },
  { id: "storefronts" as SasSection, label: "واجهات المتاجر", icon: Globe },
  { id: "profit_models" as SasSection, label: "نماذج الربح", icon: DollarSign },
  { id: "contracts" as SasSection, label: "العقود", icon: FileText },
  { id: "invoices" as SasSection, label: "الفواتير", icon: Receipt },
  { id: "financial_archive" as SasSection, label: "الأرشيف المالي", icon: Archive },
];

const platformNav = [
  { id: "app_store" as SasSection, label: "متجر التطبيقات", icon: AppWindow },
  { id: "payment_gateways" as SasSection, label: "بوابات الدفع", icon: CreditCard },
  { id: "domains" as SasSection, label: "إدارة الدومينات", icon: Globe },
  { id: "themes" as SasSection, label: "الثيمات والقوالب", icon: Palette },
  { id: "media" as SasSection, label: "مركز الوسائط", icon: Image },
  { id: "infrastructure" as SasSection, label: "البنية التحتية", icon: Server },
];

const systemNav = [
  { id: "permissions" as SasSection, label: "الصلاحيات", icon: Shield },
  { id: "zatca" as SasSection, label: "الامتثال والزكاة", icon: FileCheck },
];

const SasSidebar: React.FC<SasSidebarProps> = ({ activeSection, onSectionChange, open }) => {
  const renderItem = (item: { id: SasSection; label: string; icon: React.ElementType }) => {
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

  const renderGroup = (title: string, items: typeof mainNav) => (
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
            <Crown className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div>
              <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight">توب رست</p>
              <p className="text-sidebar-primary text-xs">Super Admin</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {renderGroup("الإدارة المالية", mainNav)}
        {renderGroup("المنصة والبنية التحتية", platformNav)}
        {renderGroup("النظام والامتثال", systemNav)}
      </nav>
    </aside>
  );
};

export default SasSidebar;
