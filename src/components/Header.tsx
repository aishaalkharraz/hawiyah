import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/collections", label: "المجموعات" },
  { to: "/assistant", label: "مساعدك الذكي" },
  { to: "/email", label: "الإيميل الترويجي" },
  { to: "/about", label: "عن هوية" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function Header() {
  const { setCartOpen, setSearchOpen, cartCount, favorites } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container-hawiya flex h-[72px] items-center justify-between gap-6 lg:h-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden"
            aria-label="القائمة"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="font-display text-2xl leading-none text-primary lg:text-[28px]">
            هوية
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="text-sm text-foreground/80 transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="بحث"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:bg-secondary/60"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link
            to={user ? "/account" : "/auth"}
            aria-label="حسابي"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:bg-secondary/60"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link
            to="/favorites"
            aria-label="المفضلة"
            className="relative hidden h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:bg-secondary/60 sm:grid"
          >
            <Heart className="h-[18px] w-[18px]" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 left-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="السلة"
            onClick={() => setCartOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:bg-secondary/60"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 left-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="container-hawiya flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="border-b border-border/40 py-3 text-sm last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? "/account" : "/auth"}
              onClick={() => setMenuOpen(false)}
              className="border-b border-border/40 py-3 text-sm"
            >
              {user ? "حسابي" : "تسجيل الدخول"}
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm text-foreground/80"
            >
              مفضلتي
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export { X };
