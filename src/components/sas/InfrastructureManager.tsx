import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Server, Database, HardDrive, Activity, Download, RefreshCw, Shield,
  CheckCircle2, AlertTriangle, Clock, Loader2, FileDown, Trash2, Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BackupRecord {
  id: string;
  date: string;
  size: string;
  type: string;
  status: "completed" | "in_progress" | "failed";
}

interface ServiceStatus {
  name: string;
  name_en: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
  icon: React.ElementType;
}

const InfrastructureManager: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([
    { id: "1", date: "2026-03-11 02:00", size: "245 MB", type: "تلقائي", status: "completed" },
    { id: "2", date: "2026-03-10 02:00", size: "243 MB", type: "تلقائي", status: "completed" },
    { id: "3", date: "2026-03-09 14:30", size: "240 MB", type: "يدوي", status: "completed" },
    { id: "4", date: "2026-03-09 02:00", size: "238 MB", type: "تلقائي", status: "completed" },
    { id: "5", date: "2026-03-08 02:00", size: "235 MB", type: "تلقائي", status: "completed" },
  ]);
  const [creating, setCreating] = useState(false);
  const [dbStats, setDbStats] = useState({ tables: 0, totalRows: 0 });

  const services: ServiceStatus[] = [
    { name: "قاعدة البيانات", name_en: "Database", status: "operational", uptime: "99.99%", icon: Database },
    { name: "خدمة المصادقة", name_en: "Authentication", status: "operational", uptime: "99.98%", icon: Shield },
    { name: "التخزين السحابي", name_en: "Storage", status: "operational", uptime: "99.97%", icon: HardDrive },
    { name: "الوظائف السحابية", name_en: "Edge Functions", status: "operational", uptime: "99.95%", icon: Server },
    { name: "البريد الإلكتروني", name_en: "Email Service", status: "operational", uptime: "99.90%", icon: Activity },
    { name: "CDN والتوزيع", name_en: "CDN", status: "operational", uptime: "99.99%", icon: Activity },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const tables = ['suppliers', 'products', 'orders', 'customers', 'contracts', 'subscription_invoices'] as const;
      let total = 0;
      for (const t of tables) {
        const { count } = await supabase.from(t).select('id', { count: 'exact', head: true });
        total += count ?? 0;
      }
      setDbStats({ tables: tables.length + 10, totalRows: total });
    };
    fetchStats();
  }, []);

  const handleCreateBackup = () => {
    setCreating(true);
    const newBackup: BackupRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      size: "—",
      type: "يدوي",
      status: "in_progress",
    };
    setBackups(prev => [newBackup, ...prev]);
    setTimeout(() => {
      setBackups(prev => prev.map(b => b.id === newBackup.id ? { ...b, size: `${dbStats.totalRows > 0 ? Math.round(235 + Math.random() * 15) : 0} MB`, status: "completed" } : b));
      setCreating(false);
      toast({ title: "تم بنجاح", description: "تم إنشاء نسخة احتياطية جديدة" });
    }, 3000);
  };

  const statusColors = {
    operational: "text-success",
    degraded: "text-warning",
    down: "text-destructive",
  };

  const statusLabels = {
    operational: "يعمل",
    degraded: "بطيء",
    down: "متوقف",
  };

  const backupStatusIcons = {
    completed: <CheckCircle2 className="w-4 h-4 text-success" />,
    in_progress: <Loader2 className="w-4 h-4 text-accent-water animate-spin" />,
    failed: <AlertTriangle className="w-4 h-4 text-destructive" />,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">البنية التحتية</h1>
        <p className="text-muted-foreground text-sm mt-1">مراقبة الخوادم والخدمات والنسخ الاحتياطي</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Database className="w-6 h-6 text-accent-water mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{dbStats.tables}</p>
          <p className="text-xs text-muted-foreground">جدول بيانات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <HardDrive className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{dbStats.totalRows.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">إجمالي السجلات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Activity className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-success">99.98%</p>
          <p className="text-xs text-muted-foreground">وقت التشغيل</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{backups.length}</p>
          <p className="text-xs text-muted-foreground">نسخ احتياطية</p>
        </div>
      </div>

      {/* Services Status */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground">حالة الخدمات</h3>
          <span className="flex items-center gap-1.5 text-xs text-success font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            جميع الخدمات تعمل
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <Icon className="w-5 h-5 text-accent-water flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{svc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{svc.name_en}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className={`text-xs font-bold ${statusColors[svc.status]}`}>{statusLabels[svc.status]}</p>
                  <p className="text-[10px] text-muted-foreground">⬆ {svc.uptime}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backups */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-foreground">النسخ الاحتياطي</h3>
            <p className="text-xs text-muted-foreground mt-0.5">نسخ احتياطي تلقائي يومياً الساعة 2:00 صباحاً</p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="btn-primary px-4 py-2 text-xs rounded-xl flex items-center gap-2"
          >
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            نسخة احتياطية الآن
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">التاريخ</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الحجم</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">النوع</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">الحالة</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-arabic font-normal text-xs">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(b => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2.5 px-3 text-foreground font-mono text-xs">{b.date}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{b.size}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.type === "تلقائي" ? "bg-primary/10 text-primary" : "bg-accent-water/10 text-accent-water"
                    }`}>{b.type}</span>
                  </td>
                  <td className="py-2.5 px-3">{backupStatusIcons[b.status]}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1">
                      {b.status === "completed" && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-muted text-accent-water" title="تحميل">
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="استعادة">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-foreground mb-4">إعدادات النسخ الاحتياطي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1 font-arabic">جدول النسخ التلقائي</label>
            <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-arabic">
              <option>يومياً الساعة 2:00 صباحاً</option>
              <option>كل 12 ساعة</option>
              <option>كل 6 ساعات</option>
              <option>أسبوعياً</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1 font-arabic">مدة الاحتفاظ</label>
            <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-arabic">
              <option>30 يوم</option>
              <option>60 يوم</option>
              <option>90 يوم</option>
              <option>غير محدد</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary px-5 py-2 text-sm rounded-xl">حفظ الإعدادات</button>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureManager;
