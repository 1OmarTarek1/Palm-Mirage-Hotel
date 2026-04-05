import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  CalendarDays,
  Eye,
  Edit3,
  BedDouble,
  UtensilsCrossed,
} from "lucide-react";
import {
  closeCart,
  removeItem,
  clearCart,
  selectCartItems,
  selectCartIsOpen,
  selectCartTotal,
  selectCartSidebarTab,
  setCartSidebarTab,
} from "@/store/slices/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RoomNumberBadge from "@/components/rooms/RoomNumberBadge";
import { calculateCartItemTotal, formatBookingDateLabel } from "@/utils/roomBooking";
import { resolveCartRoomDetailId } from "@/utils/resolveCartRoomDetailId";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { RestaurantOrderSidebarSection } from "@/components/restaurant/RestaurantCartChrome";

export default function CartSidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartIsOpen);
  const sidebarTab = useSelector(selectCartSidebarTab);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { cart: restaurantCart } = useRestaurantCart();
  const reduceMotion = useReducedMotion();

  const restaurantCount = useMemo(
    () => Object.values(restaurantCart).reduce((s, q) => s + (typeof q === "number" ? q : 0), 0),
    [restaurantCart],
  );

  const MotionDiv = motion.div;
  const MotionAside = motion.aside;
  const MotionButton = motion.button;

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [isOpen]);

  const slideTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 380, damping: 34, mass: 0.9 };

  const roomsPanelId = "cart-sidebar-panel-rooms";
  const restaurantPanelId = "cart-sidebar-panel-restaurant";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
          />

          <MotionAside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-sidebar-title"
            className="fixed top-0 right-0 z-70 flex h-full w-full max-w-md flex-col border-l border-border/50 bg-card/95 shadow-2xl backdrop-blur-2xl"
          >
            <div className="border-b border-border/40 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <ShoppingCart size={20} className="shrink-0 text-primary" />
                  <h2 id="cart-sidebar-title" className="truncate text-lg font-semibold text-foreground">
                    Your cart
                  </h2>
                </div>
                <MotionButton
                  type="button"
                  onClick={() => dispatch(closeCart())}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted"
                  aria-label="Close cart"
                >
                  <X size={18} className="text-foreground/60" />
                </MotionButton>
              </div>

              <div
                className="mt-4 flex rounded-full border border-border/50 bg-muted/40 p-1"
                role="tablist"
                aria-label="Cart type"
              >
                <button
                  type="button"
                  role="tab"
                  id="cart-tab-rooms"
                  aria-selected={sidebarTab === "rooms"}
                  aria-controls={roomsPanelId}
                  onClick={() => dispatch(setCartSidebarTab("rooms"))}
                  className={cn(
                    "relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
                    sidebarTab === "rooms"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <BedDouble className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span>Rooms</span>
                  {items.length > 0 ? (
                    <span className="min-w-[1.25rem] rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary">
                      {items.length}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  role="tab"
                  id="cart-tab-restaurant"
                  aria-selected={sidebarTab === "restaurant"}
                  aria-controls={restaurantPanelId}
                  onClick={() => dispatch(setCartSidebarTab("restaurant"))}
                  className={cn(
                    "relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
                    sidebarTab === "restaurant"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <UtensilsCrossed className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span>Restaurant</span>
                  {restaurantCount > 0 ? (
                    <span className="min-w-[1.25rem] rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary">
                      {restaurantCount > 99 ? "99+" : restaurantCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <motion.div
                className="flex h-full w-[200%]"
                animate={{ x: sidebarTab === "rooms" ? "0%" : "-50%" }}
                transition={slideTransition}
              >
                <div
                  id={roomsPanelId}
                  role="tabpanel"
                  aria-labelledby="cart-tab-rooms"
                  className="flex h-full w-1/2 min-w-[50%] flex-col"
                >
                  <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                    <AnimatePresence initial={false}>
                      {items.length === 0 ? (
                        <MotionDiv
                          key="empty"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground"
                        >
                          <ShoppingCart size={48} strokeWidth={1.2} className="opacity-30" />
                          <p className="text-sm font-medium">No rooms in your cart</p>
                          <Link
                            onClick={() => {
                              dispatch(closeCart());
                            }}
                            to="/rooms"
                            className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                          >
                            Browse rooms →
                          </Link>
                        </MotionDiv>
                      ) : (
                        items.map((item) => {
                          const roomDetailId = resolveCartRoomDetailId(item);
                          return (
                            <MotionDiv
                              key={item.id}
                              layout
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 28 }}
                              className="mb-4 flex gap-3 rounded-2xl border border-border/30 bg-muted/40 p-3 last:mb-0"
                            >
                              {item.image ? (
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                  <RoomNumberBadge
                                    room={item}
                                    showPrefix={false}
                                    className="left-0.5 top-0.5 right-auto z-10 px-1.5 py-px text-[8px] tracking-[0.1em]"
                                  />
                                </div>
                              ) : null}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                                  <div className="flex shrink-0 items-center gap-0.5">
                                    {roomDetailId ? (
                                      <>
                                        <Link
                                          to={`/rooms/${roomDetailId}`}
                                          onClick={() => dispatch(closeCart())}
                                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary"
                                          aria-label="View room details"
                                          title="View room"
                                        >
                                          <Eye size={14} strokeWidth={2} />
                                        </Link>
                                        <Link
                                          to={`/rooms/${roomDetailId}`}
                                          onClick={() => dispatch(closeCart())}
                                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary"
                                          aria-label="Open room page"
                                          title="Room page"
                                        >
                                          <Edit3 size={14} strokeWidth={2} />
                                        </Link>
                                      </>
                                    ) : null}
                                    <MotionButton
                                      type="button"
                                      onClick={() => {
                                        dispatch(removeItem(item.id));
                                        toast.success(`${item.name} removed from cart`);
                                      }}
                                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/70 hover:text-destructive"
                                      aria-label="Remove from cart"
                                      title="Remove from cart"
                                    >
                                      <Trash2 size={14} strokeWidth={2} />
                                    </MotionButton>
                                  </div>
                                </div>

                                {item.checkInDate && item.checkOutDate ? (
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                      <CalendarDays size={12} className="text-primary" />
                                      {formatBookingDateLabel(item.checkInDate)} -{" "}
                                      {formatBookingDateLabel(item.checkOutDate)}
                                    </span>
                                  </p>
                                ) : null}

                                <div className="mt-3 flex items-center justify-between">
                                  <div className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                                    {item.nights || 0} night{item.nights === 1 ? "" : "s"}
                                  </div>
                                  <p className="text-sm font-bold text-primary">
                                    ${calculateCartItemTotal(item).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </MotionDiv>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>

                  {items.length > 0 && (
                    <div className="space-y-4 border-t border-border/40 px-6 py-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">${total.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-3">
                        <MotionButton
                          type="button"
                          onClick={() => {
                            dispatch(clearCart());
                            toast.success("Cart cleared");
                          }}
                          className={cn(
                            buttonVariants({ variant: "palmSecondary" }),
                            "h-12 flex-1 rounded-2xl px-5 text-sm font-medium",
                          )}
                        >
                          <span>Clear All</span>
                        </MotionButton>
                        <MotionDiv className="flex-2">
                          <Link
                            to="/cart"
                            onClick={() => dispatch(closeCart())}
                            className={cn(
                              buttonVariants({ variant: "palmPrimary" }),
                              "flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                            )}
                          >
                            <span>Go To Cart</span>
                            <ArrowRight size={16} />
                          </Link>
                        </MotionDiv>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  id={restaurantPanelId}
                  role="tabpanel"
                  aria-labelledby="cart-tab-restaurant"
                  className="flex h-full w-1/2 min-w-[50%] flex-col"
                >
                  <RestaurantOrderSidebarSection />
                </div>
              </motion.div>
            </div>
          </MotionAside>
        </>
      )}
    </AnimatePresence>
  );
}
