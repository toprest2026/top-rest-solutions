import React, { useState } from "react";
import VendorSidebar, { type VendorSection } from "@/components/vendor/VendorSidebar";
import VendorOverview from "@/components/vendor/VendorOverview";
import VendorBranding from "@/components/vendor/VendorBranding";
import VendorPayments from "@/components/vendor/VendorPayments";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";
import DriversManager from "@/components/admin/DriversManager";
import { Link } from "react-router-dom";
import { ArrowLeft, Crown } from "lucide-react";

const VendorDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<VendorSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <VendorOverview />;
      case "products": return <ProductsManager />;
      case "orders": return <OrdersManager />;
      case "drivers": return <DriversManager />;
      case "branding": return <VendorBranding />;
      case "payments": return <VendorPayments />;
      case "domain":
      case "analytics":
      case "settings":
        return (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">هذا القسم قيد التطوير</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-muted/30 font-arabic overflow-hidden" dir="rtl">
      <VendorSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        storeName="متجر المياه"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
              </div>
            </button>
            <div>
              <p className="font-display font-bold text-foreground text-sm">لوحة تحكم المورد</p>
              <p className="text-muted-foreground text-xs font-arabic">إدارة متجرك المستقل</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-water transition-colors font-arabic">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">لوحة الإدارة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-water to-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">م</span>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
