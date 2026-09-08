import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string | undefined } => ({
    session_id: typeof search['session_id'] === "string" ? (search['session_id'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "نتيجة الدفع | هوية" },
      { name: "description", content: "تأكيد نتيجة عملية الدفع لطلبك من متجر هوية." },
      { property: "og:title", content: "نتيجة الدفع | هوية" },
      { property: "og:description", content: "تأكيد نتيجة عملية الدفع لطلبك من متجر هوية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();

  return (
    <section className="container-hawiya max-w-xl py-24 text-center">
      <h1 className="font-display text-4xl">
        {sessionId ? "تم الدفع بنجاح" : "لا توجد بيانات دفع"}
      </h1>
      <p className="mt-4 text-sm leading-8 text-muted-foreground">
        {sessionId
          ? "شكرًا لك. تقدر تتابع طلبك من صفحة حسابي."
          : "ارجع للسلة وأعد المحاولة."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/account"
          className="rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          حسابي
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
