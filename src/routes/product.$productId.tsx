import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { formatKWD, getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "المنتج غير متاح | هوية" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.title} | هوية` },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: `${product.title} | هوية` },
        { property: "og:description", content: product.description.slice(0, 155) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const fav = isFavorite(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <section className="container-hawiya py-10 lg:py-16">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            الرئيسية
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" search={{ cat: product.category }} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="px-2">/</span>
          <span>{product.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col-reverse gap-4 lg:flex-row">
            <div className="flex gap-3 lg:flex-col">
              {product.gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={`صورة ${i + 1}`}
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-xl border transition-colors duration-200",
                    activeImg === i ? "border-primary" : "border-border",
                  )}
                >
                  <img src={g} alt="" loading="lazy" width={900} height={900} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden rounded-[24px] bg-secondary/50">
              <img
                src={product.gallery[activeImg] ?? product.image}
                alt={product.title}
                width={900}
                height={900}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="mt-2 font-display text-4xl lg:text-5xl">{product.title}</h1>
            <p className="mt-4 text-2xl text-primary">{formatKWD(product.price)}</p>
            <p className="mt-6 max-w-lg text-sm leading-9 text-muted-foreground">{product.description}</p>

            <p className={cn("mt-6 text-sm", product.inStock ? "text-[#79856B]" : "text-destructive")}>
              {product.inStock ? "متوفر — جاهز للشحن" : "غير متوفر حاليًا"}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-5 rounded-[16px] border border-border px-5 py-3.5">
                <button type="button" aria-label="زيادة" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
                <span className="min-w-5 text-center text-sm">{qty}</span>
                <button type="button" aria-label="إنقاص" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product.id, qty);
                  toast("تمت إضافة المنتج إلى السلة");
                }}
                className="flex-1 rounded-[16px] bg-primary px-8 py-4 text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground sm:flex-none"
              >
                أضف للسلة
              </button>

              <button
                type="button"
                aria-label="المفضلة"
                aria-pressed={fav}
                onClick={() => toggleFavorite(product.id)}
                className="grid h-[54px] w-[54px] place-items-center rounded-[16px] border border-border transition-colors duration-200 hover:bg-secondary/60"
              >
                <Heart className={cn("h-5 w-5", fav && "fill-primary text-primary")} />
              </button>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-[20px] bg-secondary/50 p-5 text-sm text-foreground/80">
              <Truck className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-7">
                توصيل داخل الكويت خلال ١–٣ أيام عمل، وشحن مجاني للطلبات فوق ٢٥.٠٠٠ د.ك.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-hawiya section-pad pt-4">
        <h2 className="font-display text-3xl">قد يعجبك أيضًا</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
