import { useMemo } from "react";
import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { useMenuGroupedQuery } from "@/hooks/useCatalogQueries";
import { cn } from "@/lib/utils";
import { closeCart } from "@/store/slices/cartSlice";

const LINE_IMG_FALLBACK =
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";

export function useMenuFlat() {
  const { data: menuGrouped } = useMenuGroupedQuery();
  return useMemo(() => {
    const grouped = menuGrouped?.groupedItems ?? {};
    const flat = [];
    Object.values(grouped).forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((it) => {
        const id = it._id ?? it.id;
        if (!id) return;
        const img =
          (typeof it.image === "string" && it.image) ||
          (typeof it.image?.url === "string" && it.image.url) ||
          (typeof it.image?.secure_url === "string" && it.image.secure_url) ||
          (typeof it.img === "string" && it.img) ||
          "";
        flat.push({
          id: String(id),
          name: it.name,
          price: Number(it.price ?? 0),
          available: it.available !== false,
          image: img,
        });
      });
    });
    return flat;
  }, [menuGrouped]);
}

function formatPrice(price) {
  if (typeof price === "number") return `$${price.toFixed(0)}`;
  return String(price);
}

/**
 * Restaurant order list + footer for the unified cart sidebar (rooms / restaurant tabs).
 */
export function RestaurantOrderSidebarSection({ className }) {
  const dispatch = useDispatch();
  const { cart, setQty, resetCart, goToBookingWithOrder } = useRestaurantCart();
  const menuItems = useMenuFlat();

  const lines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([menuItemId, qty]) => {
        const item = menuItems.find((m) => m.id === menuItemId);
        return {
          id: menuItemId,
          qty,
          name: item?.name ?? "Menu item",
          price: item?.price ?? 0,
          available: item?.available !== false,
          image: item?.image || LINE_IMG_FALLBACK,
        };
      });
  }, [cart, menuItems]);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.qty, 0), [lines]);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
        {lines.length === 0 ? (
          <motion.div
            key="restaurant-empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground"
          >
            <UtensilsCrossed className="h-12 w-12" />
            <p className="text-sm font-medium">No dishes in your cart</p>
            <Link
              onClick={() => dispatch(closeCart())}
              to="/services/restaurant"
              className="cursor-pointer text-sm font-semibold text-primary hover:underline"
            >
              Browse Menu →
            </Link>
          </motion.div>
        ) : (
          <ul className="space-y-3">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/30 bg-muted">
                  <img
                    src={line.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = LINE_IMG_FALLBACK;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-snug text-foreground">{line.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatPrice(line.price)} each
                    {!line.available ? (
                      <span className="ms-2 text-amber-700">Unavailable — remove to continue</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQty(line.id, line.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={!line.available}
                    onClick={() => setQty(line.id, line.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setQty(line.id, 0)}
                    aria-label={`Remove ${line.name} from cart`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
