import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { categories, products } from "@/data/products";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "المجموعات | هوية" },
      { name: "description", content: "مجموعات هوية: مكتبيات، هدايا، ديكور وإكسسوارات بروح عربية معاصرة." },
      { property: "og:title", content: "المجموعات | هوية" },
      { property: "og:description", content: "استكشف مجموعات هوية المصممة حول الحرف العربي." },
    ],
  }),
  component: Collections,
});

const tones = [
  "bg-[#7E1E20] text-[#F5EFE7]",
  "bg-[#D7C0A3] text-[#2F2221]",
  "bg-[#79856B] text-[#F5EFE7]",
  "bg-[#2F2221] text-[#F5EFE7]",
];

function Collections() {
  return (
    <section className="container-hawiya py-12 lg:py-20">
      <h1 className="font-display text-4xl lg:text-5xl">المجموعات</h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
        أربع مجموعات، كل واحدة تبدأ من حرف وتنتهي بتفصيلة تستخدمها كل يوم.
      </p>

      <div className="mt-12 space-y-6">
        {categories.map((c, i) => {
          const items = products.filter((p) => p.category === c);
          return (
            <Reveal key={c} delay={i * 60}>
              <Link
                to="/shop"
                search={{ cat: c }}
                className={`group grid overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-1 lg:grid-cols-2 ${tones[i]}`}
              >
                <div className="relative flex flex-col justify-center gap-4 p-8 lg:p-14">
                  <span className="pointer-events-none absolute inset-0 pattern-geo" aria-hidden />
                  <h2 className="relative font-display text-4xl lg:text-5xl">{c}</h2>
                  <p className="relative text-sm opacity-80">{items.length} قطعة ضمن المجموعة</p>
                  <span className="relative mt-2 inline-flex items-center gap-2 text-sm">
                    تصفّح المجموعة
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1.5" />
                  </span>
                </div>

                <div className="h-56 overflow-hidden lg:h-72">
                  <img
                    src={items[0]?.image ?? products[0]?.image}
                    alt={c}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
