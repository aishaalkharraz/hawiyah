import { useState, useEffect } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Link } from "@tanstack/react-router";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCartCheckout } from "@/utils/payments.functions";

interface CartStripeCheckoutProps {
  items: { product_id: string; qty: number }[];
  shipping: number;
  customerEmail?: string;
  userId?: string;
  returnUrl: string;
}

export function CartStripeCheckout({
  items,
  shipping,
  customerEmail,
  userId,
  returnUrl,
}: CartStripeCheckoutProps) {
  const [stripeObj, setStripeObj] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getStripe()
      .then((s) => setStripeObj(s))
      .catch((err) => {
        console.error("Stripe init error:", err);
        setErrorMsg(err?.message || "لم يتم ربط بوابة الدفع الإلكتروني بعد.");
      });
  }, []);

  const fetchClientSecret = async (): Promise<string> => {
    try {
      const env = getStripeEnvironment();
      const result = await createCartCheckout({
        data: {
          items,
          shipping,
          ...(customerEmail ? { customerEmail } : {}),
          ...(userId ? { userId } : {}),
          returnUrl,
          environment: env,
        },
      });
      if ("error" in result) {
        setErrorMsg(result.error);
        throw new Error(result.error);
      }
      if (!result.clientSecret) {
        setErrorMsg("تعذّر بدء جلسة الدفع بالبطاقة");
        throw new Error("تعذّر بدء الدفع");
      }
      return result.clientSecret;
    } catch (err: any) {
      setErrorMsg(err?.message || "تعذّر الاتصال ببوابة الدفع");
      throw err;
    }
  };

  if (errorMsg) {
    return (
      <div className="mt-8 rounded-[24px] border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-2xl">تم حفظ طلبك بنجاح!</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          طلبك محفوظ برقم محدد في حسابك. سيتم التواصل معك عبر الواتساب/الهاتف لإرسال رابط الدفع المباشر أو تحصيل المبلغ عند التسليم.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/account"
            className="rounded-[16px] bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            متابعة طلباتي في حسابي
          </Link>
        </div>
      </div>
    );
  }

  if (!stripeObj) {
    return (
      <div className="mt-8 rounded-[24px] border border-border bg-card p-8 text-center">
        <p className="animate-pulse text-sm text-muted-foreground">جارٍ تحضير بوابة الدفع بالبطاقة…</p>
      </div>
    );
  }

  return (
    <div id="checkout" className="mt-8">
      <EmbeddedCheckoutProvider stripe={stripeObj} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
