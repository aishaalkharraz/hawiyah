import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { formatKWD, type Product } from "@/data/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CornerFrame } from "@/components/Ornament";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite(product.id);

  return (
    <article className="group relative flex flex-col text-right">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/60">
        <span className="pointer-events-none absolute inset-0 z-[1] pattern-geo" aria-hidden />
        <CornerFrame />
        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          aria-label={product.title}
          className="block"
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            width={900}
            height={900}
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        </Link>


        <button
          type="button"
          onClick={() => {
            toggleFavorite(product.id);
            toast(fav ? "أُزيل من المفضلة" : "أُضيف إلى المفضلة");
          }}
          aria-label="إضافة إلى المفضلة"
          aria-pressed={fav}
          className={cn(
            "absolute top-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-background/85 backdrop-blur transition-all duration-300",
            fav ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          )}
        >
          <Heart
            className={cn("h-[18px] w-[18px]", fav ? "fill-primary text-primary" : "text-foreground")}
          />
        </button>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => {
              addToCart(product.id);
              toast("تمت إضافة المنتج إلى السلة");
            }}
            className="w-full rounded-[16px] bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {product.inStock ? "أضف للسلة" : "غير متوفر حاليًا"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <h3 className="text-lg">
          <Link to="/product/$productId" params={{ productId: product.id }}>
            {product.title}
          </Link>
        </h3>
        <p className="text-sm text-primary">{formatKWD(product.price)}</p>
      </div>
    </article>
  );
}
