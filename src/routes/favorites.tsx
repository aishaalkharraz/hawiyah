import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "مفضلتي | هوية" },
      { name: "description", content: "القطع التي اخترتها من هوية وحفظتها في مفضلتك." },
      { property: "og:title", content: "مفضلتي | هوية" },
      { property: "og:description", content: "قائمة منتجاتك المفضلة من هوية." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useStore();
  const list = products.filter((p) => favorites.includes(p.id));

  return (
    <section className="container-hawiya py-12 lg:py-20">
      <h1 className="font-display text-4xl lg:text-5xl">مفضلتي</h1>
      {list.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">لم تضف أي قطعة بعد.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            تصفّح المتجر
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
