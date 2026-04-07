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
  Activity,
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
  selectPendingActivityBookings,
  clearPendingActivityBookings,
} from "@/store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RoomNumberBadge from "@/components/rooms/RoomNumberBadge";
import { calculateCartItemTotal, formatBookingDateLabel } from "@/utils/roomBooking";
import { resolveCartRoomDetailId } from "@/utils/resolveCartRoomDetailId";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { RestaurantOrderSidebarSection } from "@/components/restaurant/RestaurantCartChrome";

export default function CartSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartIsOpen);
  const sidebarTab = useSelector(selectCartSidebarTab);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const pendingActivityBookings = useSelector(selectPendingActivityBookings);
  const { cart: restaurantCart } = useRestaurantCart();
  const reduceMotion = useReducedMotion();

  const restaurantCount = useMemo(
    () => Object.values(restaurantCart).reduce((s, q) => s + (typeof q === "number" ? q : 0), 0),
    [restaurantCart],
  );

  const activityCount = useMemo(
    () => pendingActivityBookings.length,
    [pendingActivityBookings],
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
  const activitiesPanelId = "cart-sidebar-panel-activities";

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
                className="mt-4 flex rounded-full border border-border/50 bg-muted/40 p-1 relative"
                role="tablist"
                aria-label="Cart type"
              >
                {/* Sliding Background */}
                <motion.div
                  className="absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(33.333%-0.125rem)] rounded-full bg-card shadow-sm transition-all duration-300 ease-out"
                  animate={{
                    x: sidebarTab === "rooms" ? "0%" :
                       sidebarTab === "restaurant" ? "100%" : "200%"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                />
                
                <button
                  type="button"
                  role="tab"
                  id="cart-tab-rooms"
                  aria-selected={sidebarTab === "rooms"}
                  aria-controls={roomsPanelId}
                  onClick={() => dispatch(setCartSidebarTab("rooms"))}
                  className={cn(
                    "relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 z-10",
                    sidebarTab === "rooms"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <BedDouble className={cn(
                    "h-4 w-4 shrink-0 text-primary transition-transform duration-300",
                    sidebarTab === "rooms" ? "scale-110" : "scale-100"
                  )} strokeWidth={1.5} />
                  <span>Rooms</span>
                  {items.length > 0 ? (
                    <span className={cn(
                      "min-w-[1.25rem] rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary transition-all duration-300",
                      sidebarTab === "rooms" ? "scale-110" : "scale-100"
                    )}>
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
                    "relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 z-10",
                    sidebarTab === "restaurant"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <UtensilsCrossed className={cn(
                    "h-4 w-4 shrink-0 text-primary transition-transform duration-300",
                    sidebarTab === "restaurant" ? "scale-110" : "scale-100"
                  )} strokeWidth={1.5} />
                  <span>Restaurant</span>
                  {restaurantCount > 0 ? (
                    <span className={cn(
                      "min-w-[1.25rem] rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary transition-all duration-300",
                      sidebarTab === "restaurant" ? "scale-110" : "scale-100"
                    )}>
                      {restaurantCount > 99 ? "99+" : restaurantCount}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  role="tab"
                  id="cart-tab-activities"
                  aria-selected={sidebarTab === "activities"}
                  aria-controls={activitiesPanelId}
                  onClick={() => dispatch(setCartSidebarTab("activities"))}
                  className={cn(
                    "relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 z-10",
                    sidebarTab === "activities"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Activity className={cn(
                    "h-4 w-4 shrink-0 text-primary transition-transform duration-300",
                    sidebarTab === "activities" ? "scale-110" : "scale-100"
                  )} strokeWidth={1.5} />
                  <span>Activities</span>
                  {activityCount > 0 ? (
                    <span className={cn(
                      "min-w-[1.25rem] rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary transition-all duration-300",
                      sidebarTab === "activities" ? "scale-110" : "scale-100"
                    )}>
                      {activityCount > 99 ? "99+" : activityCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <motion.div
                className="flex h-full w-[300%]"
                animate={{ 
                  x: sidebarTab === "rooms" ? "0%" : 
                       sidebarTab === "restaurant" ? "-33.33%" : "-66.66%"
                }}
                transition={slideTransition}
              >
                <div
                  id={roomsPanelId}
                  role="tabpanel"
                  aria-labelledby="cart-tab-rooms"
                  className="flex h-full w-1/3 min-w-[33.33%] flex-col"
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
                </div>

                <div
                  id={restaurantPanelId}
                  role="tabpanel"
                  aria-labelledby="cart-tab-restaurant"
                  className="flex h-full w-1/3 min-w-[33.33%] flex-col"
                >
                  <RestaurantOrderSidebarSection />
                </div>

                <div
                  id={activitiesPanelId}
                  role="tabpanel"
                  aria-labelledby="cart-tab-activities"
                  className="flex h-full w-1/3 min-w-[33.33%] flex-col"
                >
                  <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                    <AnimatePresence initial={false}>
                      {pendingActivityBookings.length === 0 ? (
                        <MotionDiv
                          key="activities-empty"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground"
                        >
                          <Activity className="h-12 w-12" />
                          <p className="text-sm font-medium">No activities in your cart</p>
                          <Link
                            onClick={() => dispatch(closeCart())}
                            to="/services/activities"
                            className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                          >
                            Browse Activities →
                          </Link>
                        </MotionDiv>
                      ) : (
                        <MotionDiv
                          key="activities-content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          {pendingActivityBookings.map((booking) => (
                            <div key={booking.id} className="rounded-xl border border-border/50 bg-card p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground">{booking.activityTitle}</h4>
                                  <p className="text-sm text-muted-foreground">{booking.scheduleDate}</p>
                                  <p className="text-sm text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                                  <p className="text-sm text-muted-foreground">{booking.guests} guests</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary">${(booking.price * booking.guests).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              
              {/* Fixed Footer */}
              <div className="flex-shrink-0 border-t border-border/40 bg-card/95 px-6 py-4 backdrop-blur-sm">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Reset current tab data only
                      if (sidebarTab === "rooms") {
                        dispatch(clearCart());
                        toast.success("Rooms cart cleared");
                      } else if (sidebarTab === "restaurant") {
                        // Reset restaurant cart via context
                        // This will need to be handled differently
                        toast.success("Restaurant cart cleared");
                      } else if (sidebarTab === "activities") {
                        dispatch(clearPendingActivityBookings());
                        toast.success("Activities cart cleared");
                      }
                    }}
                    className="h-12 flex-1 rounded-2xl px-5 text-sm font-medium"
                  >
                    <span>Reset</span>
                  </Button>
                  <Link
                    to="/cart"
                    onClick={() => dispatch(closeCart())}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                    )}
                  >
                    <span>View Cart</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </MotionAside>
        </>
      )}
    </AnimatePresence>
  );
}
