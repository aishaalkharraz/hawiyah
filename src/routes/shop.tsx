import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type ShopSearch = { cat?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    cat: typeof search["cat"] === "string" ? search["cat"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المتجر | هوية" },
      { name: "description", content: "تصفّح كل منتجات هوية: مكتبيات، هدايا، ديكور وإكسسوارات." },
      { property: "og:title", content: "المتجر | هوية" },
      { property: "og:description", content: "قطع عربية معاصرة بأسعار بالدينار الكويتي." },
    ],
  }),
  component: Shop,
});

const sorts = ["الأحدث", "الأكثر طلبًا", "السعر من الأقل", "السعر من الأعلى"] as const;

function Shop() {
  const { cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof sorts)[number]>("الأحدث");
  const active = cat ?? "الكل";

  const list = useMemo(() => {
    let out = products.filter((p) => (active === "الكل" ? true : p.category === active));
    const q = query.trim();
    if (q) out = out.filter((p) => p.title.includes(q) || p.description.includes(q));
    const sorted = [...out];
    if (sort === "الأحدث") sorted.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "الأكثر طلبًا") sorted.sort((a, b) => b.popularity - a.popularity);
    if (sort === "السعر من الأقل") sorted.sort((a, b) => a.price - b.price);
    if (sort === "السعر من الأعلى") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [active, query, sort]);

  return (
    <section className="container-hawiya py-12 lg:py-20">
      <h1 className="font-display text-4xl lg:text-5xl">المتجر</h1>
      <p className="mt-3 text-sm text-muted-foreground">كل ما صممناه ليكون جزءًا من تفاصيلك.</p>

      <div className="mt-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-sm items-center gap-3 rounded-[16px] border border-border bg-card px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتج…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          الترتيب
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
            className="rounded-[16px] border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
          >
            {sorts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["الكل", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() =>
              navigate({ search: { cat: c === "الكل" ? undefined : c }, replace: true })
            }
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm transition-colors duration-200",
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary/60",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">لا توجد منتجات مطابقة.</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
