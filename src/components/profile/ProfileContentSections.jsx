import { useMemo } from "react";
import {
  BadgeCheck,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  EmptyState,
  SectionCard,
  SectionCarousel,
  SectionDivider,
  SectionHeader,
  StatCard,
} from "@/components/profile/ProfileSectionParts";
import { formatCurrency, getWishlistRoomId } from "@/components/profile/profileUtils";
import { useMenuFlat } from "@/components/restaurant/RestaurantCartChrome";
import {
  ActivityBookingCard,
  CartCard,
  RestaurantMenuCartLineCard,
  RoomBookingCard,
  TableBookingCard,
  WishlistCard,
} from "@/components/profile/ProfileCards";

export default function ProfileContentSections(props) {
  const {
    stats,
    snapshotCards,
    wishlistItems,
    wishlistCount,
    cartItems,
    cartCount,
    cartTotal,
    cartRequiresAttention,
    restaurantMenuTotalQty = 0,
    restaurantMenuCart = {},
    roomBookings,
    roomBookingsLoading,
    roomBookingsError,
    activityBookings,
    activityBookingsLoading,
    activityBookingsError,
    tableBookings,
    tableBookingsLoading,
    tableBookingsError,
    pendingCancelKey,
    axiosPrivate,
    cancelBooking,
    cancelActivityBooking,
    cancelTableBooking,
    runCancelAction,
  } = props;

  const overviewCards = [...stats, ...snapshotCards];
  const menuItems = useMenuFlat();

  const restaurantCartLines = useMemo(() => {
    return Object.entries(restaurantMenuCart || {})
      .filter(([, q]) => typeof q === "number" && q > 0)
      .map(([menuItemId, qty]) => {
        const item = menuItems.find((m) => m.id === menuItemId);
        return {
          id: menuItemId,
          qty,
          name: item?.name ?? "Menu item",
          price: item?.price ?? 0,
          available: item?.available !== false,
          image: item?.image || "",
        };
      });
  }, [restaurantMenuCart, menuItems]);

  const restaurantCartSubtotal = useMemo(
    () => restaurantCartLines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [restaurantCartLines],
  );

  const cartSectionBothEmpty = cartItems.length === 0 && restaurantCartLines.length === 0;

  return (
    <div className="mt-8 space-y-6">
      <SectionCard index={0}>
        <SectionHeader
          icon={BadgeCheck}
          title="Profile Overview"
          subtitle="Your key numbers and account highlights are grouped into one swipeable overview."
        />
        <SectionCarousel
          stretchItems
          items={overviewCards}
          getItemKey={(item, index) =>
            item?.id ?? item?.key ?? `${item?.label ?? "overview"}-${index}`
          }
          itemClassName="md:basis-1/2 xl:basis-1/4"
          renderItem={(item, index) => <StatCard {...item} index={index} className="h-full w-full min-h-0" />}
        />
      </SectionCard>
      <SectionDivider />

      <SectionCard index={1} id="room-bookings-section">
        <SectionHeader
          icon={ShoppingBag}
          title="Room Bookings"
          subtitle="All your room reservations in card format. Eligible future stays can still be cancelled from here."
          count={`${roomBookings.length} booking${roomBookings.length === 1 ? "" : "s"}`}
          actionLabel="Browse Rooms"
          actionTo="/rooms"
        />
        {roomBookingsLoading ? (
          <p className="text-sm text-muted-foreground">Loading your room bookings...</p>
        ) : roomBookingsError ? (
          <EmptyState
            title="Couldn't load room bookings"
            description={roomBookingsError}
            actionLabel="Browse Rooms"
            actionTo="/rooms"
          />
        ) : roomBookings.length === 0 ? (
          <EmptyState
            title="No room bookings yet"
            description="Once you confirm a stay, it will appear here as a profile card with its latest status."
            actionLabel="Book a Room"
            actionTo="/rooms"
          />
        ) : (
          <SectionCarousel
            items={roomBookings}
            getItemKey={(booking, index) => booking?._id || booking?.id || `room-booking-${index}`}
            renderItem={(booking) => (
              <RoomBookingCard
                booking={booking}
                pendingCancelKey={pendingCancelKey}
                axiosPrivate={axiosPrivate}
                cancelBooking={cancelBooking}
                runCancelAction={runCancelAction}
              />
            )}
          />
        )}
      </SectionCard>
      <SectionDivider />

      <SectionCard index={2} id="activity-bookings-section">
        <SectionHeader
          icon={Ticket}
          title="Activity Bookings"
          subtitle="Your reserved spa, leisure, and experience sessions presented as activity cards."
          count={`${activityBookings.length} booking${activityBookings.length === 1 ? "" : "s"}`}
          actionLabel="Explore Activities"
          actionTo="/services/activities"
        />
        {activityBookingsLoading ? (
          <p className="text-sm text-muted-foreground">Loading your activity bookings...</p>
        ) : activityBookingsError ? (
          <EmptyState
            title="Couldn't load activity bookings"
            description={activityBookingsError}
            actionLabel="Explore Activities"
            actionTo="/services/activities"
          />
        ) : activityBookings.length === 0 ? (
          <EmptyState
            title="No activity bookings yet"
            description="Reserve activities from the activities page and they will appear here as bookable profile cards."
            actionLabel="Explore Activities"
            actionTo="/services/activities"
          />
        ) : (
          <SectionCarousel
            items={activityBookings}
            getItemKey={(booking, index) => booking?._id || booking?.id || `activity-booking-${index}`}
            renderItem={(booking) => (
              <ActivityBookingCard
                booking={booking}
                pendingCancelKey={pendingCancelKey}
                axiosPrivate={axiosPrivate}
                cancelActivityBooking={cancelActivityBooking}
                runCancelAction={runCancelAction}
              />
            )}
          />
        )}
      </SectionCard>
      <SectionDivider />

      <SectionCard index={3} id="table-bookings-section">
        <SectionHeader
          icon={UtensilsCrossed}
          title="Restaurant Bookings"
          subtitle="Table reservations, in-room dining, and in-table service—tracked here as booking cards."
          count={`${tableBookings.length} booking${tableBookings.length === 1 ? "" : "s"}`}
          actionLabel="Restaurant Page"
          actionTo="/services/restaurant"
        />
        {tableBookingsLoading ? (
          <p className="text-sm text-muted-foreground">Loading your restaurant bookings...</p>
        ) : tableBookingsError ? (
          <EmptyState
            title="Couldn't load restaurant bookings"
            description={tableBookingsError}
            actionLabel="Book A Table"
            actionTo="/services/restaurant"
          />
        ) : tableBookings.length === 0 ? (
          <EmptyState
            title="No restaurant bookings yet"
            description="Book a table, order to your room, or arrange in-table dining from the restaurant page—your bookings will show up here."
            actionLabel="Restaurant"
            actionTo="/services/restaurant"
          />
        ) : (
          <SectionCarousel
            items={tableBookings}
            getItemKey={(booking, index) => booking?.id || booking?._id || `table-booking-${index}`}
            renderItem={(booking) => (
              <TableBookingCard
                booking={booking}
                pendingCancelKey={pendingCancelKey}
                axiosPrivate={axiosPrivate}
                cancelTableBooking={cancelTableBooking}
                runCancelAction={runCancelAction}
              />
            )}
          />
        )}
      </SectionCard>
      <SectionDivider />

      <SectionCard index={4}>
        <SectionHeader
          icon={Heart}
          title="Wishlist"
          subtitle="Rooms you've saved for later, displayed as swipeable cards."
          count={`${wishlistCount} saved`}
          actionLabel="Show More"
          actionTo="/wishlist"
        />
        {wishlistItems.length === 0 ? (
          <EmptyState
            title="Your wishlist is still empty"
            description="Save rooms from the rooms page and they will show up here as cards for quick access."
            actionLabel="Explore Rooms"
            actionTo="/rooms"
          />
        ) : (
          <SectionCarousel
            items={wishlistItems}
            getItemKey={(room, index) => getWishlistRoomId(room) || `wishlist-${index}`}
            renderItem={(room) => <WishlistCard room={room} />}
          />
        )}
      </SectionCard>
      <SectionDivider />

      <SectionCard index={5}>
        <SectionHeader
          icon={ShoppingCart}
          title="Cart"
          subtitle="Swipe through restaurant dishes and room stays separately—same data as the header cart (Restaurant / Rooms tabs)."
          count={`${cartCount} room${cartCount === 1 ? "" : "s"}${
            restaurantMenuTotalQty > 0
              ? ` · ${restaurantMenuTotalQty} dish${restaurantMenuTotalQty === 1 ? "" : "es"}`
              : ""
          }`}
          actionLabel="Open cart page"
          actionTo="/cart"
        />
        {cartSectionBothEmpty ? (
          <EmptyState
            title="Your carts are empty"
            description="Add dishes from the restaurant or menu pages, and rooms from the rooms listing—everything syncs to the nav cart."
            actionLabel="Browse rooms"
            actionTo="/rooms"
          />
        ) : (
          <div className="space-y-10">
            <div>
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Restaurant cart
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {restaurantCartLines.length > 0
                      ? `${restaurantCartLines.length} line${restaurantCartLines.length === 1 ? "" : "s"} · adjust qty from the header cart`
                      : "No dishes saved yet."}
                  </p>
                </div>
                {restaurantCartLines.length > 0 ? (
                  <Button asChild variant="outline" size="sm" className="mt-2 w-fit shrink-0 rounded-full sm:mt-0">
                    <Link to="/services/restaurant#table-booking">Complete booking</Link>
                  </Button>
                ) : null}
              </div>
              {restaurantCartLines.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-border/60 bg-muted/10 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">No restaurant dishes in your cart</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Add items from the restaurant page or full menu, then finish date and time on the booking block.
                  </p>
                  <Button asChild variant="palmSecondary" size="sm" className="mt-5 rounded-full px-6">
                    <Link to="/services/restaurant">Restaurant</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <SectionCarousel
                    items={restaurantCartLines}
                    getItemKey={(line) => line.id}
                    renderItem={(line) => <RestaurantMenuCartLineCard line={line} />}
                  />
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-primary/15 bg-primary/8 px-5 py-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                        Restaurant subtotal
                      </p>
                      <p className="mt-2 text-lg font-black text-foreground">
                        {formatCurrency(restaurantCartSubtotal)}
                      </p>
                    </div>
                    <Button asChild variant="palmPrimary" size="sm" className="px-6">
                      <Link to="/services/restaurant#table-booking">Go to restaurant booking</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border/40 pt-10">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Room cart</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cartItems.length > 0
                      ? `${cartCount} selection${cartCount === 1 ? "" : "s"} for checkout`
                      : "No room stays in your cart."}
                  </p>
                </div>
                {cartItems.length > 0 ? (
                  <Button asChild variant="outline" size="sm" className="mt-2 w-fit shrink-0 rounded-full sm:mt-0">
                    <Link to="/cart">Review on cart page</Link>
                  </Button>
                ) : null}
              </div>
              {cartItems.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-border/60 bg-muted/10 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">No rooms in your cart</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    {restaurantCartLines.length > 0
                      ? "You have restaurant items saved. Add a room whenever you are ready for a stay."
                      : "Pick dates on a room and add it to your cart to see it here."}
                  </p>
                  <Button asChild variant="palmSecondary" size="sm" className="mt-5 rounded-full px-6">
                    <Link to="/rooms">Browse rooms</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <SectionCarousel
                    items={cartItems}
                    getItemKey={(item, index) => item.id || `cart-${index}`}
                    renderItem={(item) => <CartCard item={item} />}
                  />
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-primary/15 bg-primary/8 px-5 py-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                        Room cart total
                      </p>
                      <p className="mt-2 text-lg font-black text-foreground">
                        {formatCurrency(cartTotal)}
                      </p>
                    </div>
                    <Button asChild variant="palmPrimary" size="sm" className="px-6">
                      <Link to={cartRequiresAttention ? "/cart" : "/cart/checkout"}>
                        {cartRequiresAttention ? "Review Cart" : "Go To Checkout"}
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
