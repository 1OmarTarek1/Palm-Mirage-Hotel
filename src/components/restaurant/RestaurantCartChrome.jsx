import { useMemo } from "react";
import {
  Trash2,
  UtensilsCrossed,
  CalendarDays,
  Clock,
  Users,
  Utensils,
  Minus,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  getRestaurantBookingLocationLabel,
  getRestaurantBookingModeLabel,
} from "@/components/profile/profileUtils";
import { useMenuGroupedQuery } from "@/hooks/useCatalogQueries";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { cn } from "@/lib/utils";
import {
  closeCart,
  removePendingRestaurantBooking,
  selectPendingRestaurantBookings,
} from "@/store/slices/cartSlice";

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

function formatPrice(val) {
  return `$${Number(val ?? 0).toFixed(2)}`;
}

/**
 * Restaurant tab in the unified cart sidebar.
 * - Section 1: Individual food items (before booking) — shows per-item controls
 * - Section 2: Completed order bundles (pendingRestaurantBookings) — each is one collection
 */
export function RestaurantOrderSidebarSection({ className }) {
  const dispatch = useDispatch();
  const { cart, setQty } = useRestaurantCart();
  const pendingBookings = useSelector(selectPendingRestaurantBookings);
  const menuItems = useMenuFlat();

  // Individual unbundled food lines
  const foodLines = useMemo(() => {
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

  const hasFood = foodLines.length > 0;
  const hasBookings = pendingBookings.length > 0;
  const isEmpty = !hasFood && !hasBookings;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scrollbar-thin space-y-4">
        <AnimatePresence initial={false}>

          {/* ── Empty State ── */}
          {isEmpty && (
            <motion.div
              key="restaurant-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground"
            >
              <UtensilsCrossed className="h-12 w-12" />
              <p className="text-sm font-medium">Your restaurant cart is empty</p>
              <Link
                onClick={() => dispatch(closeCart())}
                to="/services/restaurant"
                className="cursor-pointer text-sm font-semibold text-primary hover:underline"
              >
                Browse Menu →
              </Link>
            </motion.div>
          )}

          {/* ── Section 1: Unbundled food items (before booking) ── */}
          {hasFood && (
            <motion.div
              key="food-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground px-1">
                Items in cart
              </p>
              <ul className="space-y-2">
                {foodLines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/30 bg-muted">
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
                      <p className="truncate text-sm font-medium leading-snug text-foreground">
                        {line.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatPrice(line.price)} each
                        {!line.available && (
                          <span className="ms-2 text-amber-700">Unavailable</span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => setQty(line.id, line.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">
                        {line.qty}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        disabled={!line.available}
                        onClick={() => setQty(line.id, line.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setQty(line.id, 0)}
                        aria-label={`Remove ${line.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Hint to complete booking */}
              <p className="mt-3 rounded-xl border border-dashed border-border/50 bg-muted/10 px-3 py-2.5 text-xs text-muted-foreground">
                Go to{" "}
                <Link
                  onClick={() => dispatch(closeCart())}
                  to="/services/restaurant#table-booking"
                  className="font-semibold text-primary hover:underline"
                >
                  Restaurant Booking
                </Link>{" "}
                to bundle these items with a table, room, or pickup order.
              </p>
            </motion.div>
          )}

          {/* ── Section 2: Completed order bundles ── */}
          {hasBookings && (
            <motion.div
              key="bookings-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground px-1">
                Orders ({pendingBookings.length})
              </p>
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {pendingBookings.map((booking) => {
                    const lineItems = Array.isArray(booking.lineItems) ? booking.lineItems : [];
                    const total = lineItems.reduce((s, li) => s + li.price * li.qty, 0);

                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl border border-border/50 bg-card overflow-hidden"
                      >
                        {/* Order header */}
                        <div className="flex items-start justify-between gap-2 bg-muted/30 px-4 py-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Utensils className="h-3.5 w-3.5 shrink-0 text-secondary" />
                              <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">
                                {getRestaurantBookingModeLabel(booking.bookingMode)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                              {booking.date && (
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  {booking.date}
                                </span>
                              )}
                              {booking.time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.time}
                                </span>
                              )}
                              <span>{getRestaurantBookingLocationLabel(booking)}</span>
                              {booking.guests != null && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {booking.guests} guests
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              dispatch(removePendingRestaurantBooking(booking.id))
                            }
                            aria-label="Remove order"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Food items inside order */}
                        {lineItems.length > 0 ? (
                          <ul className="divide-y divide-border/30 px-4 py-1">
                            {lineItems.map((li) => {
                              const meta = menuItems.find((m) => m.id === li.menuItemId);
                              const img = meta?.image || LINE_IMG_FALLBACK;
                              return (
                                <li key={li.menuItemId} className="flex items-center gap-3 py-2">
                                  <img
                                    src={img}
                                    alt=""
                                    className="h-9 w-9 shrink-0 rounded-lg object-cover border border-border/30"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.src = LINE_IMG_FALLBACK;
                                    }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">
                                      {li.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      ×{li.qty} · {formatPrice(li.price)} each
                                    </p>
                                  </div>
                                  <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                                    {formatPrice(li.price * li.qty)}
                                  </p>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="px-4 py-3 text-xs text-muted-foreground">
                            {booking.bookingMode === "table_only"
                              ? "Table only - no food items."
                              : "No food items added yet."}
                          </p>
                        )}

                        {/* Order subtotal */}
                        {lineItems.length > 0 && (
                          <div className="flex items-center justify-between border-t border-border/30 bg-muted/10 px-4 py-2">
                            <span className="text-xs text-muted-foreground">Food subtotal</span>
                            <span className="text-sm font-bold text-secondary tabular-nums">
                              {formatPrice(total)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
