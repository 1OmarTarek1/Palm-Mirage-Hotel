import { useMemo } from "react";
import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { useMenuGroupedQuery } from "@/hooks/useCatalogQueries";
import { cn } from "@/lib/utils";

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
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <UtensilsCrossed className="mb-4 h-10 w-10 text-muted-foreground/40" strokeWidth={1.25} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tap <span className="font-semibold text-foreground">+</span> on any dish to add it here, then use{" "}
              <span className="font-semibold text-foreground">Order</span> in the booking section to finish date, time,
              and guests.
            </p>
          </div>
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

      <div className="space-y-4 border-t border-border/40 bg-card/95 px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Subtotal</span>
          <span className="font-header text-xl font-bold tabular-nums text-primary">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex min-w-0 flex-row gap-2 sm:gap-3">
          <Button
            type="button"
            variant="palmSecondary"
            className="h-11 min-w-0 flex-1 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em]"
            onClick={() => resetCart()}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="palmPrimary"
            className="h-11 min-w-0 flex-1 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em]"
            onClick={goToBookingWithOrder}
          >
            Order
          </Button>
        </div>
      </div>
    </div>
  );
}
