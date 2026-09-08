import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "سياسة الشحن | هوية" },
      { name: "description", content: "تفاصيل الشحن داخل الكويت ودول الخليج ومدة التوصيل." },
      { property: "og:title", content: "سياسة الشحن | هوية" },
      { property: "og:description", content: "توصيل داخل الكويت خلال ١–٣ أيام عمل." },
    ],
  }),
  component: Shipping,
});

function Shipping() {
  return (
    <section className="container-hawiya max-w-3xl py-12 lg:py-20">
      <h1 className="font-display text-4xl lg:text-5xl">سياسة الشحن</h1>
      <div className="mt-8 space-y-6 text-sm leading-9 text-muted-foreground">
        <p>التوصيل داخل الكويت خلال ١–٣ أيام عمل، ورسوم الشحن ١.٥٠٠ د.ك.</p>
        <p>الشحن مجاني للطلبات التي تتجاوز ٢٥.٠٠٠ د.ك.</p>
        <p>الشحن لدول الخليج خلال ٣–٧ أيام عمل، وتُحتسب الرسوم عند إتمام الطلب.</p>
        <p>تصلك رسالة بتفاصيل التتبع فور خروج الطلب من المستودع.</p>
      </div>
    </section>
  );
}
