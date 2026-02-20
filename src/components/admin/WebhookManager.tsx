import React, { useState } from "react";
import { Webhook, Plus, CheckCircle, AlertCircle, Clock, Bell, Mail, MessageSquare } from "lucide-react";

const webhookEvents = [
  { id: "order.created", label: "طلب جديد", description: "عند إنشاء طلب جديد" },
  { id: "order.paid", label: "تم الدفع", description: "عند تأكيد الدفع" },
  { id: "order.shipped", label: "قيد التوصيل", description: "عند إرسال الطلب للمورد" },
  { id: "order.delivered", label: "تم التسليم", description: "عند تسليم الطلب للعميل" },
  { id: "order.cancelled", label: "ملغي", description: "عند إلغاء الطلب" },
  { id: "order.review", label: "تحت المراجعة", description: "عند وضع الطلب قيد المراجعة" },
];

const notificationChannels = [
  { id: "email", icon: Mail, label: "البريد الإلكتروني", active: true, color: "text-blue-500" },
  { id: "whatsapp", icon: MessageSquare, label: "واتساب", active: true, color: "text-success" },
  { id: "push", icon: Bell, label: "إشعار فوري", active: false, color: "text-warning" },
];

const recentWebhooks = [
  { event: "order.created", orderId: "#TR-4521", status: "success", time: "منذ 5 دقائق" },
  { event: "order.shipped", orderId: "#TR-4519", status: "success", time: "منذ 12 دقيقة" },
  { event: "order.paid", orderId: "#TR-4518", status: "failed", time: "منذ 30 دقيقة" },
  { event: "order.delivered", orderId: "#TR-4515", status: "success", time: "منذ 1 ساعة" },
];

const WebhookManager: React.FC = () => {
  const [channels, setChannels] = useState(notificationChannels);
  const [activeEvents, setActiveEvents] = useState<string[]>(["order.created", "order.paid", "order.delivered"]);
  const [showAddWebhook, setShowAddWebhook] = useState(false);

  const toggleEvent = (id: string) => {
    setActiveEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleChannel = (id: string) => {
    setChannels((c) => c.map((ch) => ch.id === id ? { ...ch, active: !ch.active } : ch));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">Webhooks والإشعارات</h1>
          <p className="text-muted-foreground text-sm font-arabic mt-1">إدارة أحداث النظام وقنوات الإشعارات</p>
        </div>
        <button
          onClick={() => setShowAddWebhook(true)}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          إضافة Webhook
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Channels */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent-water" />
            قنوات الإشعارات
          </h3>
          <div className="space-y-3">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-card flex items-center justify-center ${channel.color}`}>
                    <channel.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{channel.label}</p>
                    <p className="text-muted-foreground text-xs font-arabic">
                      {channel.active ? "مفعّل" : "معطّل"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleChannel(channel.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    channel.active ? "bg-success" : "bg-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      channel.active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Email Config */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-arabic text-muted-foreground mb-2 font-bold">إعدادات البريد الإلكتروني</p>
            <input className="search-input mb-2" placeholder="SMTP Server" defaultValue="smtp.mailgun.org" />
            <input className="search-input" placeholder="From Email" defaultValue="noreply@toprest.sa" />
          </div>
        </div>

        {/* Events */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Webhook className="w-4 h-4 text-accent-water" />
            أحداث الطلبات
          </h3>
          <div className="space-y-2">
            {webhookEvents.map((event) => {
              const active = activeEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? "bg-accent-water/10 border-accent-water/30"
                      : "bg-muted/50 border-border hover:bg-muted"
                  }`}
                  onClick={() => toggleEvent(event.id)}
                >
                  <div>
                    <p className="font-bold text-foreground text-sm">{event.label}</p>
                    <p className="text-muted-foreground text-xs font-arabic">{event.description}</p>
                    <p className="text-muted-foreground text-xs font-mono mt-0.5">{event.id}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    active
                      ? "bg-accent-water border-accent-water"
                      : "border-muted-foreground"
                  }`}>
                    {active && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Webhook Logs */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-foreground">سجل آخر الأحداث</h3>
        </div>
        <div className="divide-y divide-border">
          {recentWebhooks.map((wh, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  wh.status === "success" ? "bg-success/20" : "bg-destructive/20"
                }`}>
                  {wh.status === "success" ? (
                    <CheckCircle className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-mono text-xs text-foreground">{wh.event}</p>
                  <p className="text-muted-foreground text-xs font-arabic">{wh.orderId}</p>
                </div>
              </div>
              <div className="text-left">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  wh.status === "success" ? "badge-success" : "text-destructive bg-destructive/10 border border-destructive/30"
                }`}>
                  {wh.status === "success" ? "ناجح" : "فشل"}
                </span>
                <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1 justify-end">
                  <Clock className="w-2.5 h-2.5" />
                  {wh.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Webhook Modal */}
      {showAddWebhook && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-water-xl">
            <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Webhook className="w-5 h-5 text-accent-water" />
              إضافة Webhook
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">Endpoint URL</label>
                <input className="search-input font-mono" placeholder="https://your-erp.com/webhook" />
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-1 block">Secret Key</label>
                <input className="search-input font-mono" type="password" placeholder="whsec_..." />
              </div>
              <div>
                <label className="text-sm font-arabic text-muted-foreground mb-2 block">الأحداث</label>
                <div className="space-y-2">
                  {webhookEvents.map((ev) => (
                    <label key={ev.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm font-arabic text-foreground">{ev.label}</span>
                      <span className="text-xs font-mono text-muted-foreground">{ev.id}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 py-2.5 text-sm rounded-xl">حفظ الـ Webhook</button>
              <button onClick={() => setShowAddWebhook(false)} className="btn-outline-water flex-1 py-2.5 text-sm rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookManager;
