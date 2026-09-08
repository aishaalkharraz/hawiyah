import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { formatKWD } from "@/data/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, setQty, removeFromCart, subtotal } = useStore();

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300",
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-label="السلة"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-background transition-transform duration-300 ease-out",
          cartOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-xl">سلة المشتريات</h2>
          <button type="button" aria-label="إغلاق" onClick={() => setCartOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cartItems.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              سلتك فارغة… ابدأ باكتشاف المجموعة.
            </p>
          ) : (
            <ul className="space-y-5">
              {cartItems.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="h-24 w-24 shrink-0 rounded-xl bg-secondary/60 object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <p className="mt-1 text-sm text-primary">{formatKWD(product.price)}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1">
                        <button
                          type="button"
                          aria-label="زيادة"
                          onClick={() => setQty(product.id, qty + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-4 text-center text-sm">{qty}</span>
                        <button
                          type="button"
                          aria-label="إنقاص"
                          onClick={() => setQty(product.id, qty - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="حذف"
                        onClick={() => removeFromCart(product.id)}
                        className="text-muted-foreground transition-colors duration-200 hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span className="text-base text-primary">{formatKWD(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">الشحن يُحتسب عند إتمام الطلب.</p>
          <Link
            to="/checkout"
            onClick={() => setCartOpen(false)}
            className="mt-4 block rounded-[16px] bg-primary px-5 py-3.5 text-center text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            إتمام الطلب
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="mt-2 w-full rounded-[16px] border border-border px-5 py-3 text-sm transition-colors duration-200 hover:bg-secondary/50"
          >
            متابعة التسوق
          </button>
        </div>
      </aside>
    </>
  );
}
