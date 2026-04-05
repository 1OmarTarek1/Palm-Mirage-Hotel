import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingBag, ShoppingCart, Ticket, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  BookingActionBar,
  BookingMeta,
  CarouselCard,
  StatusBadge,
} from "@/components/profile/ProfileSectionParts";
import {
  activityBookingMeta,
  formatCurrency,
  formatDateOnly,
  getWishlistRoomId,
  getWishlistRoomName,
  getWishlistRoomType,
  isActivityBookingCancellable,
  isRoomBookingCancellable,
  isTableBookingCancellable,
  resolveImage,
  roomBookingMeta,
  tableBookingMeta,
} from "@/components/profile/profileUtils";
import { calculateCartItemTotal, formatBookingDateLabel } from "@/utils/roomBooking";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { removeItem } from "@/store/slices/cartSlice";

export function WishlistCard({ room }) {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const roomId = getWishlistRoomId(room);
  const image = resolveImage(room);
  const handleRemoveFromWishlist = () => {
    if (!roomId || isRemoving) return;
    setIsRemoving(true);
    dispatch(removeFromWishlist(roomId));
    toast.success("Removed from wishlist.");
  };

  return (
    <CarouselCard className="overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        {image ? (
          <img src={image} alt={getWishlistRoomName(room)} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            <Heart size={24} />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
          {getWishlistRoomType(room)}
        </span>
        {roomId ? (
          <Button asChild variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white">
            <Link to={`/rooms/${roomId}`} aria-label="View Room">
              <Eye size={16} />
            </Link>
          </Button>
        ) : null}
        {roomId ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove from wishlist"
            className="absolute bottom-4 right-4 h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition active:scale-95 active:bg-black/40 hover:bg-black/35 hover:text-white"
            onClick={handleRemoveFromWishlist}
          >
            <motion.span
              animate={
                isRemoving
                  ? { scale: [1, 1.28, 0.88, 1], rotate: [0, -10, 8, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              onAnimationComplete={() => setIsRemoving(false)}
              className="flex items-center justify-center"
            >
              <Heart size={16} className="fill-current" />
            </motion.span>
          </Button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-lg font-bold text-foreground">{getWishlistRoomName(room)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          From {formatCurrency(room?.price || 0)} per night
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Saved to revisit later from your profile.
        </p>
      </div>
    </CarouselCard>
  );
}

export function CartCard({ item }) {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const image = resolveImage(item);
  const requiresReview = item.availabilityStatus !== "available";
  const roomLink = item.id ? `/rooms/${item.id}` : "/rooms";
  const cartLink = requiresReview ? "/cart" : "/cart/checkout";
  const itemTotal = formatCurrency(calculateCartItemTotal(item));
  const handleRemoveFromCart = () => {
    if (!item?.id || isRemoving) return;
    setIsRemoving(true);
    dispatch(removeItem(item.id));
    toast.success("Removed from cart.");
  };

  return (
    <CarouselCard className="overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        {image ? (
          <img src={image} alt={item.name || "Room"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            <ShoppingCart size={24} />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
            {itemTotal}
          </span>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white">
            <Link to={roomLink} aria-label="View Room">
              <Eye size={16} />
            </Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition active:scale-95 active:bg-black/40 hover:bg-black/35 hover:text-white"
          onClick={handleRemoveFromCart}
          aria-label="Remove from cart"
        >
          <motion.span
            animate={
              isRemoving
                ? { scale: [1, 1.24, 0.9, 1], rotate: [0, -8, 6, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
            onAnimationComplete={() => setIsRemoving(false)}
            className="flex items-center justify-center"
          >
            <ShoppingCart size={16} />
          </motion.span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-foreground">{item.name || "Room"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatBookingDateLabel(item.checkInDate)} - {formatBookingDateLabel(item.checkOutDate)}
            </p>
          </div>
          <StatusBadge status={requiresReview ? "review" : "ready"} />
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>{item.roomsCount || 1} room(s) / {item.guests || 1} guest(s)</p>
          <p>{Math.max(1, Number(item.nights || 1))} night(s)</p>
        </div>

        <div className="mt-auto pt-5">
          <Button asChild variant={requiresReview ? "palmSecondary" : "palmPrimary"} size="sm" className="px-5">
            <Link to={cartLink}>
              {requiresReview ? "Review Cart" : "Go To Checkout"}
            </Link>
          </Button>
        </div>
      </div>
    </CarouselCard>
  );
}

export function RoomBookingCard({
  booking,
  pendingCancelKey,
  axiosPrivate,
  cancelBooking,
  runCancelAction,
}) {
  const bookingId = booking?._id || booking?.id;
  const roomId = booking?.room?._id || booking?.room?.id;
  const roomName =
    booking?.room?.roomName || `Room ${booking?.room?.roomNumber || ""}`.trim();
  const image = resolveImage(booking?.room);
  const canCancel = isRoomBookingCancellable(booking);

  return (
    <CarouselCard className="overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        {image ? (
          <img src={image} alt={roomName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            <ShoppingBag size={24} />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
              {booking?.paymentStatus === "paid"
                ? "Paid Booking"
                : `Reserved ${formatDateOnly(booking?.createdAt || booking?.bookedAt)}`}
            </span>
            {booking?.room?.roomType ? (
              <span className="rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
                {booking.room.roomType}
              </span>
            ) : null}
          </div>
          {roomId ? (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white">
              <Link to={`/rooms/${roomId}`} aria-label="View Room">
                <Eye size={16} />
              </Link>
            </Button>
          ) : null}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4">
          <StatusBadge
            status={booking?.status}
            className="border-white/20 bg-white/12 px-2.5 py-1 text-[9px] tracking-[0.12em] text-white shadow-sm backdrop-blur-md"
          />
          <StatusBadge
            status={booking?.paymentStatus}
            className="border-white/20 bg-white/12 px-2.5 py-1 text-[9px] tracking-[0.12em] text-white shadow-sm backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-lg font-bold text-foreground">{roomName}</p>
        </div>

        <div className="mt-4 space-y-2">
          {roomBookingMeta(booking, formatBookingDateLabel).map((item) => (
            <BookingMeta key={`${bookingId}-${item.label}`} {...item} />
          ))}
        </div>

        <BookingActionBar>
          <div className="flex flex-wrap gap-3">
            {canCancel ? (
              <Button
                type="button"
                variant="palmPrimary"
                size="sm"
                className="px-5"
                disabled={Boolean(pendingCancelKey)}
                onClick={() =>
                  runCancelAction({
                    key: `room-${bookingId}`,
                    action: cancelBooking({ id: bookingId, axiosPrivate }),
                    successMessage: "Room booking cancelled successfully.",
                    fallbackMessage: "Failed to cancel room booking.",
                  })
                }
              >
                {pendingCancelKey === `room-${bookingId}` ? "Cancelling..." : "Cancel Booking"}
              </Button>
            ) : null}
          </div>
        </BookingActionBar>
      </div>
    </CarouselCard>
  );
}

export function ActivityBookingCard({
  booking,
  pendingCancelKey,
  axiosPrivate,
  cancelActivityBooking,
  runCancelAction,
}) {
  const bookingId = booking?._id || booking?.id;
  const activityId = booking?.activity?.id || booking?.activity?._id;
  const activityName = booking?.activity?.title || "Activity session";
  const image = resolveImage(booking?.activity);
  const canCancel = isActivityBookingCancellable(booking);

  return (
    <CarouselCard className="overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        {image ? (
          <img src={image} alt={activityName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            <Ticket size={24} />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
            {booking?.paymentStatus === "paid"
              ? `Paid in full - Total ${formatCurrency(booking?.totalPrice || 0)}`
              : `Booked ${formatDateOnly(booking?.createdAt)}`}
          </span>
          {activityId ? (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white">
              <Link to={`/services/activities/${activityId}`} aria-label="View Activity">
                <Eye size={16} />
              </Link>
            </Button>
          ) : null}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4">
          {booking?.activity?.category ? (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
              {booking.activity.category}
            </span>
          ) : null}
          <StatusBadge
            status={booking?.status}
            className="border-white/20 bg-white/12 px-2.5 py-1 text-[9px] tracking-[0.12em] text-white shadow-sm backdrop-blur-md"
          />
          <StatusBadge
            status={booking?.paymentStatus}
            className="border-white/20 bg-white/12 px-2.5 py-1 text-[9px] tracking-[0.12em] text-white shadow-sm backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-lg font-bold text-foreground">{activityName}</p>
        </div>

        <div className="mt-4 space-y-2">
          {activityBookingMeta(booking).map((item) => (
            <BookingMeta key={`${bookingId}-${item.label}`} {...item} />
          ))}
        </div>

        {canCancel ? (
          <BookingActionBar>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="palmSecondary"
                size="sm"
                className="px-5"
                disabled={Boolean(pendingCancelKey)}
                onClick={() =>
                  runCancelAction({
                    key: `activity-${bookingId}`,
                    action: cancelActivityBooking({ axiosPrivate, bookingId }),
                    successMessage: "Activity booking cancelled successfully.",
                    fallbackMessage: "Failed to cancel activity booking.",
                  })
                }
              >
                {pendingCancelKey === `activity-${bookingId}` ? "Cancelling..." : "Cancel Booking"}
              </Button>
            </div>
          </BookingActionBar>
        ) : null}
      </div>
    </CarouselCard>
  );
}

export function TableBookingCard({
  booking,
  pendingCancelKey,
  axiosPrivate,
  cancelTableBooking,
  runCancelAction,
}) {
  const bookingId = booking?.id || booking?._id;
  const canCancel = isTableBookingCancellable(booking);
  const tableLabel =
    booking?.tableNumber === null ? "Waitlist request" : `Table ${booking.tableNumber}`;

  return (
    <CarouselCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-foreground">{tableLabel}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {booking?.tableNumber === null
              ? "We'll upgrade this waitlist request when a matching table becomes available."
              : "Your dining reservation at Palm Mirage Restaurant."}
          </p>
        </div>
        <StatusBadge status={booking?.status} />
      </div>

      <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UtensilsCrossed size={22} />
      </div>

      <div className="mt-5 space-y-2">
        {tableBookingMeta(booking).map((item) => (
          <BookingMeta key={`${bookingId}-${item.label}`} {...item} />
        ))}
      </div>

      <BookingActionBar>
        <div className="text-sm text-muted-foreground">
          {booking?.paymentStatus === "paid"
            ? "Paid bookings are view-only from your account."
            : `Created on ${formatDateOnly(booking?.createdAt)}`}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="ghost" size="sm" className="px-5">
            <Link to="/services/restaurant">Restaurant Page</Link>
          </Button>
          {canCancel ? (
            <Button
              type="button"
              variant="palmSecondary"
              size="sm"
              className="px-5"
              disabled={Boolean(pendingCancelKey)}
              onClick={() =>
                runCancelAction({
                  key: `table-${bookingId}`,
                  action: cancelTableBooking({ axiosPrivate, bookingId }),
                  successMessage: "Table booking cancelled successfully.",
                  fallbackMessage: "Failed to cancel table booking.",
                })
              }
            >
              {pendingCancelKey === `table-${bookingId}` ? "Cancelling..." : "Cancel Booking"}
            </Button>
          ) : null}
        </div>
      </BookingActionBar>
    </CarouselCard>
  );
}
