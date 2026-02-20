import React from "react";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const StoreFooter: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-water flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">ت</span>
              </div>
              <div>
                <p className="text-background font-display font-bold text-lg leading-tight">توب رست</p>
                <p className="text-accent-water text-xs">لتوزيع المياه</p>
              </div>
            </div>
            <p className="text-background/60 text-sm font-arabic leading-relaxed mb-4">
              مؤسسة توب رست لتوزيع المياه — نوصل المياه النقية لباب منزلك في جميع أنحاء المملكة العربية السعودية.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-accent-water rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-background" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-background mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {["الرئيسية", "المنتجات", "الاشتراكات", "العروض", "تتبع طلبي"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/60 hover:text-accent-water text-sm font-arabic transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-background mb-4">الدعم</h4>
            <ul className="space-y-2">
              {["سياسة الخصوصية", "الشروط والأحكام", "سياسة الإرجاع", "الأسئلة الشائعة", "اتصل بنا"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/60 hover:text-accent-water text-sm font-arabic transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-background mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-water flex-shrink-0" />
                <span className="text-background/70 text-sm">920-000-000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-water flex-shrink-0" />
                <span className="text-background/70 text-sm">info@toprest.sa</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-water flex-shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm font-arabic leading-relaxed">
                  الرياض، المملكة العربية السعودية
                </span>
              </li>
            </ul>

            {/* VAT */}
            <div className="mt-4 bg-white/5 rounded-lg p-3">
              <p className="text-background/50 text-xs font-arabic">الرقم الضريبي</p>
              <p className="text-background/80 text-sm font-bold">300000000000003</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/40 text-xs font-arabic">
            © 2025 توب رست لتوزيع المياه. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-background/40 text-xs">CR: 1234567890</span>
            <span className="text-accent-water text-xs font-arabic">مرخص من وزارة التجارة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
