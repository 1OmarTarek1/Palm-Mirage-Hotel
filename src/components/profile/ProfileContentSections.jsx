import {
  BadgeCheck,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  User,
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
import {
  ActivityBookingCard,
  CartCard,
  RoomBookingCard,
  TableBookingCard,
  WishlistCard,
} from "@/components/profile/ProfileCards";

export default function ProfileContentSections(props) {
  const {
    accountDetails,
    stats,
    snapshotCards,
    wishlistItems,
    wishlistCount,
    cartItems,
    cartCount,
    cartTotal,
    cartRequiresAttention,
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

  return (
    <div className="mt-8 space-y-6">
      <SectionCard index={0}>
        <SectionHeader
          icon={BadgeCheck}
          title="Profile Overview"
          subtitle="Your key numbers and account highlights are grouped into one swipeable overview."
        />
        <SectionCarousel
          items={overviewCards}
          getItemKey={(item, index) =>
            item?.id ?? item?.key ?? `${item?.label ?? "overview"}-${index}`
          }
          itemClassName="md:basis-1/2 xl:basis-1/4"
          renderItem={(item, index) => <StatCard {...item} index={index} className="h-full" />}
        />
      </SectionCard>
      <SectionDivider />

      <SectionCard index={1}>
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

      <SectionCard index={2}>
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

      <SectionCard index={3}>
        <SectionHeader
          icon={UtensilsCrossed}
          title="Restaurant Table Bookings"
          subtitle="Dining reservations and waitlist requests grouped into restaurant booking cards."
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
            description="Reserve a table from the restaurant page and you'll be able to track it here as a booking card."
            actionLabel="Reserve A Table"
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
          subtitle="Rooms waiting for checkout, each one shown as its own booking-ready card."
          count={`${cartCount} item${cartCount === 1 ? "" : "s"}`}
          actionLabel="Show More"
          actionTo="/cart"
        />
        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Add rooms to your cart to keep booking details handy and proceed to checkout faster."
            actionLabel="Start Booking"
            actionTo="/rooms"
          />
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
                  Cart Total
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
      </SectionCard>
    </div>
  );
}
