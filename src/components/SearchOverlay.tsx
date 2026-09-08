import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { formatKWD, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return products
      .filter((p) => p.title.includes(q) || p.category.includes(q) || p.description.includes(q))
      .slice(0, 6);
  }, [query]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        searchOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div
        className={cn(
          "relative mx-auto mt-0 w-full max-w-3xl bg-background px-6 pt-8 pb-10 transition-transform duration-300 ease-out sm:mt-24 sm:rounded-3xl",
          searchOpen ? "translate-y-0" : "-translate-y-4",
        )}
      >
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus={searchOpen}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتج…"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <button type="button" aria-label="إغلاق البحث" onClick={() => setSearchOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          {query.trim() === "" ? (
            <p className="text-sm text-muted-foreground">جرّب: دفتر، كوب، حقيبة، هدايا…</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$productId"
                    params={{ productId: p.id }}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 rounded-2xl p-2 transition-colors duration-200 hover:bg-secondary/50"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      width={900}
                      height={900}
                      className="h-14 w-14 rounded-xl bg-secondary/60 object-cover"
                    />
                    <span className="flex-1 text-sm">{p.title}</span>
                    <span className="text-sm text-primary">{formatKWD(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
