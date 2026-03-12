import React, { useState } from "react";
import SasSidebar, { type SasSection } from "@/components/sas/SasSidebar";
import SaasOverview from "@/components/sas/SaasOverview";
import SubscriptionsManager from "@/components/admin/SubscriptionsManager";
import ContractsManager from "@/components/admin/ContractsManager";
import InvoicesManager from "@/components/admin/InvoicesManager";
import PermissionsManager from "@/components/admin/PermissionsManager";
import StorefrontsManager from "@/components/admin/StorefrontsManager";
import ProfitModelsManager from "@/components/admin/ProfitModelsManager";
import AppStoreManager from "@/components/sas/AppStoreManager";
import PaymentGatewaysManager from "@/components/sas/PaymentGatewaysManager";
import InfrastructureManager from "@/components/sas/InfrastructureManager";
import DomainsManager from "@/components/sas/DomainsManager";
import ThemesManager from "@/components/sas/ThemesManager";
import MediaCenter from "@/components/sas/MediaCenter";
import ZatcaCompliance from "@/components/sas/ZatcaCompliance";
import FinancialArchive from "@/components/sas/FinancialArchive";
import { Link } from "react-router-dom";
import { ArrowLeft, Store } from "lucide-react";

const SasDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SasSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <SaasOverview />;
      case "subscriptions": return <SubscriptionsManager />;
      case "storefronts": return <StorefrontsManager />;
      case "profit_models": return <ProfitModelsManager />;
      case "contracts": return <ContractsManager />;
      case "invoices": return <InvoicesManager />;
      case "permissions": return <PermissionsManager />;
      case "app_store": return <AppStoreManager />;
      case "payment_gateways": return <PaymentGatewaysManager />;
      case "infrastructure": return <InfrastructureManager />;
      case "domains": return <DomainsManager />;
      case "themes": return <ThemesManager />;
      case "media": return <MediaCenter />;
      case "zatca": return <ZatcaCompliance />;
      case "financial_archive": return <FinancialArchive />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/30 font-arabic overflow-hidden" dir="rtl">
      <SasSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
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
              <p className="font-display font-bold text-foreground text-sm">Super Admin — توب رست</p>
              <p className="text-muted-foreground text-xs font-arabic">المحرك المركزي للمنظومة</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-water transition-colors font-arabic">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">لوحة التحكم</span>
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

export default SasDashboard;
