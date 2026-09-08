import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export const Route = createFileRoute("/test-payment")({
  head: () => ({
    meta: [
      { title: "تجربة الدفع | هوية" },
      { name: "description", content: "صفحة تجريبية لاختبار الدفع الإلكتروني في متجر هوية قبل تفعيله للزبائن." },
      { property: "og:title", content: "تجربة الدفع | هوية" },
      { property: "og:description", content: "صفحة تجريبية لاختبار الدفع الإلكتروني في متجر هوية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestPayment,
});

function TestPayment() {
  const [open, setOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">تجربة الدفع</h1>
          <p className="text-muted-foreground leading-relaxed">
            هذه صفحة اختبار فقط. جرّبي الدفع ببطاقة تجريبية بدون أي خصم حقيقي.
          </p>
        </header>

        <div className="rounded-lg border border-border p-6 space-y-2 bg-card">
          <h2 className="text-xl font-medium text-foreground">دفتر أثر</h2>
          <p className="text-muted-foreground">12.00 USD</p>
        </div>

        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-md bg-primary text-primary-foreground py-3 font-medium hover:opacity-90 transition"
          >
            ابدأ الدفع التجريبي
          </button>
        ) : (
          <StripeEmbeddedCheckout
            priceId="daftar_athar_onetime"
            quantity={1}
            returnUrl={`${window.location.origin}/test-payment/return?session_id={CHECKOUT_SESSION_ID}`}
          />
        )}

        <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">بطاقات للتجربة:</p>
          <p>نجاح: 4242 4242 4242 4242</p>
          <p>رفض: 4000 0000 0000 0002</p>
          <p>أي تاريخ مستقبلي وأي رمز CVC.</p>
        </div>
      </div>
    </div>
  );
}
