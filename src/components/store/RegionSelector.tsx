import React from "react";
import { MapPin, CheckCircle, XCircle } from "lucide-react";
import { Region } from "@/pages/Index";

interface RegionSelectorProps {
  regions: Region[];
  selectedRegion: Region | null;
  onSelect: (region: Region) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  selectedRegion,
  onSelect,
}) => {
  return (
    <section id="regions" className="py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 badge-primary rounded-full px-4 py-1.5 mb-4 text-sm font-arabic">
            <MapPin className="w-4 h-4" />
            اختر منطقتك
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            نغطي جميع مناطق المملكة
          </h2>
          <p className="text-muted-foreground font-arabic max-w-md mx-auto">
            حدد منطقتك لعرض المنتجات والأسعار المتاحة في منطقتك
          </p>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => region.available && onSelect(region)}
              className={`region-card relative transition-all duration-200 ${
                !region.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${selectedRegion?.id === region.id ? "selected" : ""}`}
              disabled={!region.available}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  selectedRegion?.id === region.id
                    ? "bg-accent-water text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <MapPin className="w-5 h-5" />
              </div>

              <p className="font-display font-bold text-foreground text-sm mb-1">
                {region.nameAr}
              </p>

              {/* Status */}
              <div className="flex items-center justify-center gap-1 mt-1">
                {region.available ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="text-success text-xs font-arabic">متاح</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs font-arabic">قريباً</span>
                  </>
                )}
              </div>

              {/* Selected indicator */}
              {selectedRegion?.id === region.id && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent-water rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedRegion && (
          <div className="mt-6 p-4 bg-accent-water/10 border border-accent-water/30 rounded-xl flex items-center gap-3 max-w-md mx-auto animate-fade-up">
            <div className="w-9 h-9 rounded-full bg-accent-water flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-arabic font-semibold text-foreground text-sm">
                تم تحديد منطقة {selectedRegion.nameAr}
              </p>
              <p className="text-muted-foreground text-xs font-arabic">
                يتم الآن عرض المنتجات المتاحة في منطقتك
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegionSelector;
