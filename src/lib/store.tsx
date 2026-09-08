import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/products";

export type CartLine = { id: string; qty: number };

type StoreValue = {
  cart: CartLine[];
  cartItems: { product: Product; qty: number }[];
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>("hawiya-cart", []));
    setFavorites(read<string[]>("hawiya-favorites", []));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("hawiya-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("hawiya-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartItems = cart
      .map((line) => {
        const product = products.find((p) => p.id === line.id);
        return product ? { product, qty: line.qty } : null;
      })
      .filter(Boolean) as { product: Product; qty: number }[];

    return {
      cart,
      cartItems,
      cartCount: cartItems.reduce((s, i) => s + i.qty, 0),
      subtotal: cartItems.reduce((s, i) => s + i.qty * i.product.price, 0),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      favorites,
      toggleFavorite,
      isFavorite: (id: string) => favorites.includes(id),
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
    };
  }, [cart, favorites, cartOpen, searchOpen, addToCart, setQty, removeFromCart, clearCart, toggleFavorite]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
