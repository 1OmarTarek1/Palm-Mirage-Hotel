import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { useMenuGroupedQuery } from "@/hooks/useCatalogQueries";
import {
  selectCreatingTableBooking,
  selectRestaurantCheckoutLoading,
} from "@/services/restaurantBookings/restaurantBookingsSlice";
import {
  addPendingRestaurantBooking,
  resetRestaurantMenuCart,
  openCart,
} from "@/store/slices/cartSlice";
import { useFlyToCart } from "@/hooks/useFlyToCart";

const BOOKING_MODES = [
  { value: "table_only", label: "Table only (pay on arrival)" },
  { value: "dine_in", label: "Dine in — food at your table" },
  { value: "room_service", label: "Room service" },
  { value: "pickup", label: "Pickup - order now, collect at the restaurant" },
];

export default function RestaurantBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();
  const isCreating = useSelector(selectCreatingTableBooking);
  const checkoutLoading = useSelector(selectRestaurantCheckoutLoading);
  const { cart, resetCart: resetCartContext, bookingPrefill, clearBookingPrefill } =
    useRestaurantCart();

  const [bookingMode, setBookingMode] = useState("table_only");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [activeStay, setActiveStay] = useState(null);
  const [submitBtnEl, setSubmitBtnEl] = useState(null);
  const { flyToCart } = useFlyToCart();

  const { data: menuGrouped } = useMenuGroupedQuery();
  const menuItems = useMemo(() => {
    const grouped = menuGrouped?.groupedItems ?? {};
    const flat = [];
    Object.values(grouped).forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((it) => {
        const id = it._id ?? it.id;
        if (!id) return;
        flat.push({
          id: String(id),
          name: it.name,
          price: Number(it.price ?? 0),
          available: it.available !== false,
          image: it.image?.secure_url || it.image || "",
        });
      });
    });
    return flat;
  }, [menuGrouped]);

  useEffect(() => {
    if (!isAuthenticated || bookingMode !== "room_service") {
      setActiveStay(null);
      return;
    }
    let cancelled = false;
    void axiosPrivate
      .get("/reservations/active-stay")
      .then((res) => {
        if (!cancelled) {
          setActiveStay(res?.data?.data?.stay ?? null);
          const rn = res?.data?.data?.stay?.roomNumber;
          if (rn != null) setRoomNumber(String(rn));
        }
      })
      .catch(() => {
        if (!cancelled) setActiveStay(null);
      });
    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, bookingMode, isAuthenticated]);

  useEffect(() => {
    if (!bookingPrefill?.mode) return;
    setBookingMode(bookingPrefill.mode);
    clearBookingPrefill();
  }, [bookingPrefill, clearBookingPrefill]);

  useEffect(() => {
    if (bookingMode === "room_service") {
      setSelectedTable("");
      setAvailableTables([]);
    }
  }, [bookingMode]);

  useEffect(() => {
    const needsTable = bookingMode === "table_only" || bookingMode === "dine_in";
    if (!isAuthenticated || !needsTable) {
      setAvailableTables([]);
      return;
    }
    if (!date || !time) {
      setAvailableTables([]);
      return;
    }
    let cancelled = false;
    setTablesLoading(true);
    void axiosPrivate
      .get("/booking/available-tables", { params: { date, time } })
      .then((res) => {
        if (!cancelled) {
          setAvailableTables(Array.isArray(res?.data?.data?.tables) ? res.data.data.tables : []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableTables([]);
          toast.error("Could not load available tables.");
        }
      })
      .finally(() => {
        if (!cancelled) setTablesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, isAuthenticated, bookingMode, date, time]);

  useEffect(() => {
    if (!selectedTable) return;
    const n = Number(selectedTable);
    const stillThere = availableTables.some((t) => Number(t.number) === n);
    if (!stillThere) setSelectedTable("");
  }, [availableTables, selectedTable]);

  const paymentReturn = searchParams.get("payment");
  const paymentSessionId = searchParams.get("session_id");

  useEffect(() => {
    const stripPaymentQuery = () => {
      navigate(
        { pathname: location.pathname, hash: location.hash || undefined },
        { replace: true },
      );
    };

    if (paymentReturn === "cancel") {
      toast.info("Card checkout was cancelled.");
      stripPaymentQuery();
      return;
    }

    if (paymentReturn !== "success") return;

    let cancelled = false;

    const finalizeRestaurantStripeReturn = async () => {
      const clearFoodCart = () => {
        dispatch(resetRestaurantMenuCart());
      };

      if (!paymentSessionId) {
        clearFoodCart();
        toast.success("Payment received — restaurant booking confirmed.");
        stripPaymentQuery();
        return;
      }

      try {
        const maxAttempts = 15;
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          if (cancelled) return;
          const res = await axiosPrivate.get(`/payment/checkout-session/${paymentSessionId}`);
          const status = res?.data?.data?.status;

          if (status === "fulfilled") {
            if (cancelled) return;
            clearFoodCart();
            toast.success("Payment received — restaurant booking confirmed.");
            stripPaymentQuery();
            return;
          }

          if (status === "failed" || status === "expired" || status === "cancelled") {
            toast.error("Payment could not be confirmed. Contact support if you were charged.");
            stripPaymentQuery();
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        clearFoodCart();
        toast.info("Payment is confirmed. Your order may take a moment to appear in your account.");
        stripPaymentQuery();
      } catch (err) {
        console.error("Restaurant checkout finalization failed:", err);
        toast.error("Could not verify payment. Your restaurant cart was left unchanged.");
        stripPaymentQuery();
      }
    };

    void finalizeRestaurantStripeReturn();

    return () => {
      cancelled = true;
    };
  }, [
    axiosPrivate,
    dispatch,
    location.hash,
    location.pathname,
    navigate,
    paymentReturn,
    paymentSessionId,
  ]);

  const cartLineItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([menuItemId, qty]) => ({ menuItemId, qty }));
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartLineItems.reduce((sum, { menuItemId, qty }) => {
      const item = menuItems.find((m) => m.id === menuItemId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cartLineItems, menuItems]);

  const cartDishCount = useMemo(
    () => cartLineItems.reduce((sum, { qty }) => sum + qty, 0),
    [cartLineItems],
  );

  const resetForm = () => {
    setDate("");
    setTime("");
    setSelectedTable("");
    setAvailableTables([]);
    setRoomNumber(activeStay?.roomNumber != null ? String(activeStay.roomNumber) : "");
    resetCartContext();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please sign in first to reserve.");
      return;
    }

    if (!date || !time) {
      toast.info("Please select both date and time.");
      return;
    }

    if (
      (bookingMode === "dine_in" || bookingMode === "room_service" || bookingMode === "pickup") &&
      cartLineItems.length === 0
    ) {
      toast.info("Add dishes from the header cart (Restaurant tab), then submit this form.");
      return;
    }

    if (bookingMode === "room_service") {
      if (!roomNumber.trim()) {
        toast.info("Enter your room number.");
        return;
      }
      if (!activeStay) {
        toast.info("No active stay found — room service requires a current reservation.");
        return;
      }
    }

    if (bookingMode === "table_only" || bookingMode === "dine_in") {
      if (tablesLoading) {
        toast.info("Loading available tables…");
        return;
      }
      const tableNum = Number(selectedTable);
      if (!Number.isInteger(tableNum) || tableNum < 1) {
        toast.info("Please choose a table.");
        return;
      }
      if (availableTables.length === 0) {
        toast.info("No tables available for this date, time, and party size — try another slot.");
        return;
      }
      if (!availableTables.some((t) => Number(t.number) === tableNum)) {
        toast.info("That table is no longer available — pick again from the list.");
        return;
      }
    }

    const selectedTableData =
      bookingMode === "table_only" || bookingMode === "dine_in"
        ? availableTables.find((t) => Number(t.number) === Number(selectedTable))
        : null;
    const derivedGuests = selectedTableData?.chairs != null ? Number(selectedTableData.chairs) : 1;

    // Create booking data object and add to Redux store
    const lineItemsSnapshot = cartLineItems.map(({ menuItemId, qty }) => {
      const item = menuItems.find((m) => m.id === menuItemId);
      return {
        menuItemId,
        qty,
        name: item?.name || "Menu item",
        price: Number(item?.price || 0),
        image: item?.image || "",
      };
    });

    const bookingData = {
      bookingMode,
      date,
      time,
      guests: derivedGuests,
      lineItems: lineItemsSnapshot,
      lineItemsTotal: Number(cartTotal.toFixed(2)),
    };

    if (bookingMode === "room_service") {
      bookingData.roomNumber = Number(roomNumber);
    }

    if (bookingMode === "table_only" || bookingMode === "dine_in") {
      bookingData.number = Number(selectedTable);
    }

    // Add to Redux store as a unified booking (food + table details)
    dispatch(addPendingRestaurantBooking({
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }));

    // Clear the food items from the floating menu cart — they're now bundled in the booking
    dispatch(resetRestaurantMenuCart());

    // Fly animation then open cart sidebar on the restaurant tab
    if (submitBtnEl) {
      flyToCart(submitBtnEl, "navbar-cart-button");
    }
    setTimeout(() => {
      dispatch(openCart({ tab: "restaurant" }));
    }, 600);

    if (bookingMode === "pickup") {
      toast.success("Pickup order added to cart - collect it from the restaurant.");
    } else if (bookingMode === "table_only") {
      toast.success("Table booking added to cart.");
    } else {
      toast.success("Booking added to cart - food and service bundled together.");
    }

    // Reset booking form fields
    setDate("");
    setTime("");
    setSelectedTable("");
    setAvailableTables([]);
    setBookingMode("table_only");
    setRoomNumber("");
  };

  const busy = isCreating || checkoutLoading;

  return (
    <section id="table-booking" className="scroll-mt-24 border-t border-border/30">
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-md">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Plan Your Visit
            </span>
            <h2 className="mb-6 text-3xl font-header font-bold leading-tight text-foreground sm:text-4xl">
              Restaurant bookings
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                For table-only and dine-in, pick an available table after you set date and time. Room service
                uses your stay&apos;s room, and pickup lets you order food in advance and collect it from the
                restaurant. Add dishes from the header cart (Restaurant tab) for dine-in, room service, or
                pickup. Card checkout confirms immediately; cash stays pending until the team approves or
                collects payment.
              </p>
              <p>
                Questions? <span className="font-bold text-secondary">+20 95 123 4567</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4 lg:mt-0">
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-muted-foreground">Booking type*</label>
              <Select value={bookingMode} onValueChange={setBookingMode}>
                <SelectTrigger className="h-12 rounded-xl border-border/40 bg-transparent text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-[12px] font-bold text-muted-foreground">
                  Date*
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  variant="palm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="time" className="block text-[12px] font-bold text-muted-foreground">
                  Time*
                </label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                  variant="palm"
                />
              </div>
            </div>

            {bookingMode === "table_only" || bookingMode === "dine_in" ? (
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Table*</label>
                <p className="text-xs text-muted-foreground">
                  Only free tables for this date and time are listed. Each option shows max seats.
                </p>
                {tablesLoading ? (
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    Finding available tables…
                  </div>
                ) : !date || !time ? (
                  <p className="rounded-xl border border-dashed border-border/50 bg-muted/10 px-3 py-3 text-sm text-muted-foreground">
                    Select date and time first to see available tables.
                  </p>
                ) : availableTables.length === 0 ? (
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-3 text-sm text-amber-800 dark:text-amber-200/90">
                    No tables available for this slot — try another time.
                  </p>
                ) : (
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger className="h-12 rounded-xl border-border/40 bg-transparent text-sm">
                      <SelectValue placeholder="Choose a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map((t) => (
                        <SelectItem key={t.number} value={String(t.number)}>
                          Table {t.number} · seats {t.chairs}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ) : null}

            {bookingMode === "room_service" ? (
              <div className="space-y-2">
                <label htmlFor="room" className="block text-[12px] font-bold text-muted-foreground">
                  Room number*
                </label>
                <Input
                  id="room"
                  name="room"
                  type="number"
                  min="1"
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  required
                  variant="palm"
                />
                {activeStay ? (
                  <p className="text-xs text-muted-foreground">
                    Active stay: room {activeStay.roomNumber} — number must match.
                  </p>
                ) : (
                  <p className="text-xs text-amber-700">No active stay on file for your account.</p>
                )}
              </div>
            ) : null}

            {bookingMode !== "table_only" ? (
              <>
                <div className="rounded-2xl border border-border/50 bg-muted/15 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Your order (from cart)
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Food is added only from the site cart. Open the shopping icon in the header and use the{" "}
                    <span className="font-semibold text-foreground">Restaurant</span> tab to choose dishes.
                  </p>
                  {menuItems.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">Loading prices for your cart…</p>
                  ) : cartLineItems.length === 0 ? (
                    <p className="mt-3 text-sm font-medium text-amber-800 dark:text-amber-200/90">
                      No dishes in your restaurant cart yet.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-foreground">
                      <span className="font-semibold">{cartDishCount}</span>{" "}
                      {cartDishCount === 1 ? "item" : "items"} in cart ·{" "}
                      <span className="font-bold text-secondary tabular-nums">
                        ${cartTotal.toFixed(2)}
                      </span>{" "}
                      estimated subtotal
                    </p>
                  )}
                </div>
              </>
            ) : null}

            <div className="flex justify-center sm:justify-start pt-4">
              <Button
                variant="palmPrimary"
                type="submit"
                ref={setSubmitBtnEl}
                disabled={busy}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full px-6 text-xs font-bold uppercase tracking-[0.12em] sm:w-auto"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Add to cart"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
