import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { formatKWD } from "@/data/products";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/lib/orders.functions";
import { CartStripeCheckout } from "@/components/CartStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب | هوية" },
      { name: "description", content: "أكمل بيانات التوصيل وأتمم طلبك من هوية." },
      { property: "og:title", content: "إتمام الطلب | هوية" },
      { property: "og:description", content: "خطوة أخيرة لاستلام قطعك من هوية." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { cartItems, subtotal, clearCart } = useStore();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const placeOrder = useServerFn(createOrder);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"cod" | "card">("cod");
  const [payLines, setPayLines] = useState<{ product_id: string; qty: number }[] | null>(null);
  const [payShipping, setPayShipping] = useState(0);
  const [form, setForm] = useState({ full_name: "", phone: "", area: "", address: "" });
  const shipping = subtotal > 25 || subtotal === 0 ? 0 : 1.5;

  const fields = [
    { key: "full_name", label: "الاسم الكامل" },
    { key: "phone", label: "رقم الهاتف" },
    { key: "area", label: "المنطقة" },
    { key: "address", label: "العنوان بالتفصيل" },
  ] as const;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("سجّل دخولك أولًا لحفظ الطلب في حسابك");
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    try {
      const lines = cartItems.map(({ product, qty }) => ({ product_id: product.id, qty }));
      const result = await placeOrder({
        data: {
          ...form,
          shipping,
          items: cartItems.map(({ product, qty }) => ({
            product_id: product.id,
            title: product.title,
            unit_price: product.price,
            qty,
          })),
        },
      });
      if (method === "card") {
        setPayShipping(shipping);
        setPayLines(lines);
        setDone(result.orderNumber);
        clearCart();
        return;
      }
      clearCart();
      setDone(result.orderNumber);
    } catch {
      toast.error("تعذّر إتمام الطلب، حاول مرة أخرى");
    } finally {
      setBusy(false);
    }
  };

  if (done && payLines) {
    return (
      <section className="container-hawiya max-w-2xl py-16">
        <PaymentTestModeBanner />
        <h1 className="mt-6 font-display text-4xl">الدفع بالبطاقة</h1>
        <p className="mt-3 text-sm leading-8 text-muted-foreground">
          طلبك <span dir="ltr">{done}</span> محفوظ في حسابك. أكمل الدفع بالأسفل.
        </p>
        <CartStripeCheckout
          items={payLines}
          shipping={payShipping}
          {...(user?.email ? { customerEmail: user.email } : {})}
          {...(user?.id ? { userId: user.id } : {})}
          returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
        />
      </section>
    );
  }


  if (done) {
    return (
      <section className="container-hawiya max-w-xl py-24 text-center">
        <h1 className="font-display text-4xl">تم استلام طلبك</h1>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          شكرًا لثقتك بهوية. رقم طلبك <span dir="ltr">{done}</span> — تقدر تتابع حالته من صفحة حسابي.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/account"
            className="rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            متابعة الطلب
          </Link>
          <Link
            to="/shop"
            className="rounded-[16px] border border-border px-7 py-4 text-sm transition-colors hover:bg-secondary/50"
          >
            متابعة التسوق
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-hawiya grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
      <div>
        <h1 className="font-display text-4xl lg:text-5xl">إتمام الطلب</h1>

        {!loading && !user && (
          <div className="mt-6 rounded-[20px] border border-border bg-card p-5 text-sm">
            <p>سجّل دخولك حتى نحفظ الطلب في حسابك وتقدر تتابع حالته لاحقًا.</p>
            <Link
              to="/auth"
              className="mt-4 inline-block rounded-[16px] bg-primary px-5 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              تسجيل الدخول أو إنشاء حساب
            </Link>
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-4">
          {fields.map((field) => (
            <input
              key={field.key}
              required
              value={form[field.key]}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              placeholder={field.label}
              className="w-full rounded-[16px] border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary"
            />
          ))}
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            {([
              { id: "cod", label: "الدفع عند الاستلام" },
              { id: "card", label: "الدفع بالبطاقة" },
            ] as const).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                className={`rounded-[16px] border px-5 py-4 text-sm transition-colors ${
                  method === option.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-secondary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={cartItems.length === 0 || busy}
            className="w-full rounded-[16px] bg-primary px-6 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
          >
            {busy ? "جارٍ الإرسال…" : method === "card" ? "المتابعة للدفع" : "تأكيد الطلب"}
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-[24px] border border-border bg-card p-6 lg:p-8">
        <h2 className="text-xl">ملخص الطلب</h2>
        {cartItems.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">سلتك فارغة.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {cartItems.map(({ product, qty }) => (
              <li key={product.id} className="flex items-center justify-between gap-4 text-sm">
                <span>
                  {product.title} × {qty}
                </span>
                <span className="text-primary">{formatKWD(product.price * qty)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{formatKWD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>{shipping === 0 ? "مجاني" : formatKWD(shipping)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <span>الإجمالي</span>
            <span className="text-primary">{formatKWD(subtotal + shipping)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
