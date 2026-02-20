import React from "react";
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { CartItem } from "@/pages/Index";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, items, setItems }) => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-card shadow-water-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-accent-water" />
            <h3 className="font-display font-bold text-foreground text-lg">سلة التسوق</h3>
            {items.length > 0 && (
              <span className="bg-accent-water text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="font-display font-bold text-muted-foreground mb-1">السلة فارغة</p>
              <p className="text-muted-foreground text-sm font-arabic">أضف منتجات للبدء بالتسوق</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-muted/50 rounded-xl p-3 border border-border"
              >
                <img
                  src={item.image}
                  alt={item.nameAr}
                  className="w-16 h-16 object-contain rounded-lg bg-card flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-foreground text-sm leading-tight mb-1 truncate">
                    {item.nameAr}
                  </p>
                  <p className="text-accent-water font-bold text-sm">
                    {(item.price * item.quantity).toFixed(2)} ر.س
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-card rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-arabic text-muted-foreground">المجموع الفرعي</span>
              <span className="font-bold text-foreground">{total.toFixed(2)} ر.س</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-arabic text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
              <span className="font-bold text-foreground">{(total * 0.15).toFixed(2)} ر.س</span>
            </div>
            <div className="flex items-center justify-between text-lg border-t border-border pt-3">
              <span className="font-display font-bold text-foreground">الإجمالي</span>
              <span className="font-display font-black text-primary text-xl">
                {(total * 1.15).toFixed(2)} ر.س
              </span>
            </div>

            <button className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base rounded-xl">
              <CreditCard className="w-5 h-5" />
              إتمام الشراء
            </button>

            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl border border-teal-300 bg-teal-50 text-teal-700 text-sm font-bold font-arabic hover:bg-teal-100 transition-colors">
                تابي
              </button>
              <button className="flex-1 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm font-bold font-arabic hover:bg-emerald-100 transition-colors">
                تمارا
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
