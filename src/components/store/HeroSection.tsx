import React from "react";
import { ArrowLeft, Star, Truck, Shield, Droplets } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-gradient wave-divider min-h-[580px] flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="توب رست - مياه نقية"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-accent-water/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-primary-glow/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full">
        <div className="max-w-2xl animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-accent-water fill-accent-water" />
            <span className="text-white/90 text-sm font-arabic">الموثوق رقم 1 في المملكة</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-4">
            مياه نقية{" "}
            <span className="text-water-gradient">لحياة</span>{" "}
            <br />أفضل
          </h1>

          <p className="text-white/75 text-lg font-arabic leading-relaxed mb-8 max-w-lg">
            نوصل أفضل أنواع المياه المعبأة إلى باب منزلك في جميع أنحاء المملكة العربية السعودية بكل سهولة وأمان
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="btn-accent px-8 py-3 text-base flex items-center gap-2 rounded-xl font-display"
            >
              اطلب الآن
              <ArrowLeft className="w-4 h-4" />
            </a>
            <a
              href="#regions"
              className="btn-outline-water px-8 py-3 text-base rounded-xl font-display"
            >
              تحقق من منطقتك
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent-water" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">+50</p>
                <p className="text-white/60 text-xs font-arabic">منطقة توصيل</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-accent-water" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">+10K</p>
                <p className="text-white/60 text-xs font-arabic">عميل راضٍ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-water" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">100%</p>
                <p className="text-white/60 text-xs font-arabic">جودة مضمونة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
