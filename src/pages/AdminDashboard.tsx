import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";
import SuppliersManager from "@/components/admin/SuppliersManager";
import SeoManager from "@/components/admin/SeoManager";
import BannersManager from "@/components/admin/BannersManager";
import WebhookManager from "@/components/admin/WebhookManager";
import { Link } from "react-router-dom";
import { ArrowLeft, Store } from "lucide-react";

export type AdminSection =
  | "overview"
  | "products"
  | "orders"
  | "suppliers"
  | "seo"
  | "banners"
  | "webhooks";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <DashboardOverview />;
      case "products": return <ProductsManager />;
      case "orders": return <OrdersManager />;
      case "suppliers": return <SuppliersManager />;
      case "seo": return <SeoManager />;
      case "banners": return <BannersManager />;
      case "webhooks": return <WebhookManager />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/30 font-arabic overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
              </div>
            </button>
            <div>
              <p className="font-display font-bold text-foreground text-sm">لوحة التحكم — توب رست</p>
              <p className="text-muted-foreground text-xs font-arabic">نظام إدارة متكامل</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-water transition-colors font-arabic"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">المتجر</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-water flex items-center justify-center">
                <span className="text-white text-xs font-bold">م</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-foreground">المدير العام</p>
                <p className="text-xs text-muted-foreground">admin@toprest.sa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
