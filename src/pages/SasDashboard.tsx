import React, { useState } from "react";
import SubscriptionsManager from "@/components/admin/SubscriptionsManager";
import ContractsManager from "@/components/admin/ContractsManager";
import InvoicesManager from "@/components/admin/InvoicesManager";
import PermissionsManager from "@/components/admin/PermissionsManager";
import { Link } from "react-router-dom";
import { ArrowLeft, Crown, FileText, Receipt, Shield, CreditCard, BarChart3 } from "lucide-react";

type SasTab = "subscriptions" | "contracts" | "invoices" | "permissions";

const tabs = [
  { id: "subscriptions" as SasTab, label: "الباقات والمشتركين", icon: Crown },
  { id: "contracts" as SasTab, label: "العقود", icon: FileText },
  { id: "invoices" as SasTab, label: "الفواتير", icon: Receipt },
  { id: "permissions" as SasTab, label: "الصلاحيات", icon: Shield },
];

const SasDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SasTab>("subscriptions");

  const renderContent = () => {
    switch (activeTab) {
      case "subscriptions": return <SubscriptionsManager />;
      case "contracts": return <ContractsManager />;
      case "invoices": return <InvoicesManager />;
      case "permissions": return <PermissionsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 font-arabic" dir="rtl">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-water flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-sm">لوحة تحكم SaaS — إدارة المشتركين</p>
            <p className="text-muted-foreground text-xs">الباقات والعقود والفواتير والصلاحيات</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-water transition-colors font-arabic"
          >
            <span>لوحة التحكم</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-arabic border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-accent-water text-accent-water font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default SasDashboard;
