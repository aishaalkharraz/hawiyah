import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "الاستبدال والاسترجاع | هوية" },
      { name: "description", content: "شروط استبدال واسترجاع منتجات هوية خلال ١٤ يومًا." },
      { property: "og:title", content: "الاستبدال والاسترجاع | هوية" },
      { property: "og:description", content: "استبدال أو استرجاع خلال ١٤ يومًا من الاستلام." },
    ],
  }),
  component: Returns,
});

function Returns() {
  return (
    <section className="container-hawiya max-w-3xl py-12 lg:py-20">
      <h1 className="font-display text-4xl lg:text-5xl">الاستبدال والاسترجاع</h1>
      <div className="mt-8 space-y-6 text-sm leading-9 text-muted-foreground">
        <p>يمكنك طلب الاستبدال أو الاسترجاع خلال ١٤ يومًا من استلام الطلب.</p>
        <p>يجب أن تكون القطعة بحالتها الأصلية وبتغليفها كما وصلت.</p>
        <p>لا تشمل السياسة القطع المخصصة أو المطبوعة بالاسم.</p>
        <p>للبدء، راسلنا على hello@hawiya.co مع رقم الطلب.</p>
      </div>
    </section>
  );
}
