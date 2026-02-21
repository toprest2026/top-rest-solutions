import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowUpLeft, ArrowDownLeft } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  color: string;
  index?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  positive,
  icon: Icon,
  color,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center`}
          style={{ backgroundColor: color + "20", color: color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-1 ${
            positive
              ? "text-success bg-success/10"
              : "text-destructive bg-destructive/10"
          }`}
        >
          {positive ? (
            <ArrowUpLeft className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownLeft className="w-3.5 h-3.5" />
          )}
          {change}
        </div>
      </div>
      <p className="text-2xl font-display font-black text-foreground mb-1">
        {value}
      </p>
      <p className="text-muted-foreground text-sm font-arabic">{title}</p>
    </motion.div>
  );
};

export default StatCard;
