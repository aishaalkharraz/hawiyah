import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/test-payment/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string | undefined } => ({
    session_id: typeof search['session_id'] === "string" ? (search['session_id'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "نتيجة الدفع التجريبي | هوية" },
      { name: "description", content: "نتيجة عملية الدفع التجريبية في متجر هوية." },
      { property: "og:title", content: "نتيجة الدفع التجريبي | هوية" },
      { property: "og:description", content: "نتيجة عملية الدفع التجريبية في متجر هوية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestPaymentReturn,
});

function TestPaymentReturn() {
  const { session_id: sessionId } = Route.useSearch();

  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {sessionId ? "تمت العملية التجريبية بنجاح" : "لا توجد بيانات عملية"}
        </h1>
        {sessionId && (
          <p className="text-sm text-muted-foreground break-all">رقم العملية: {sessionId}</p>
        )}
        <Link to="/test-payment" className="inline-block text-primary underline">
          رجوع لصفحة التجربة
        </Link>
      </div>
    </div>
  );
}
