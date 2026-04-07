import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Heart, ShoppingBag, ShoppingCart, Ticket, Trash2, UtensilsCrossed, CreditCard } from "lucide-react";
import { motion as Motion } from "framer-motion";
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
import RoomNumberBadge from "@/components/rooms/RoomNumberBadge";
import { calculateCartItemTotal, formatBookingDateLabel } from "@/utils/roomBooking";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { removeItem, setRestaurantMenuCartQty } from "@/store/slices/cartSlice";

const RESTAURANT_CART_CARD_IMG_FALLBACK =
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";

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
        <span className="absolute left-4 top-4 z-20 rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
          {getWishlistRoomType(room)}
        </span>
        <div className="absolute right-4 top-4 z-20">
          <RoomNumberBadge room={room} floating={false} />
        </div>
        {roomId ? (
          <div className="absolute bottom-4 right-4 z-20 flex flex-row items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove from wishlist"
              className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition active:scale-95 active:bg-black/40 hover:bg-black/35 hover:text-white"
              onClick={handleRemoveFromWishlist}
            >
              <Motion.span
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
              </Motion.span>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white"
            >
              <Link to={`/rooms/${roomId}`} aria-label="View Room">
                <Eye size={16} />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col p-5">
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
        <div className="absolute left-4 top-4 z-20 flex max-w-[calc(100%-5.5rem)] flex-wrap gap-2">
          <span className="rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
            {itemTotal}
          </span>
        </div>
        <div className="absolute right-4 top-4 z-20">
          <RoomNumberBadge room={item} floating={false} />
        </div>
        <div className="absolute bottom-4 right-4 z-20 flex flex-row items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition active:scale-95 active:bg-black/40 hover:bg-black/35 hover:text-white"
            onClick={handleRemoveFromCart}
            aria-label="Remove from cart"
          >
            <Motion.span
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
            </Motion.span>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white"
          >
            <Link to={roomLink} aria-label="View Room">
              <Eye size={16} />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col p-5">
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

        <div className="mt-5">
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

/** One restaurant menu line for profile cart carousel (image, qty, remove). */
export function RestaurantMenuCartLineCard({ line }) {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const lineTotal = formatCurrency(line.price * line.qty);
  const eachLabel = formatCurrency(line.price);

  const handleRemove = () => {
    if (!line?.id || isRemoving) return;
    setIsRemoving(true);
    dispatch(setRestaurantMenuCartQty({ id: line.id, qty: 0 }));
    toast.success("Removed from restaurant cart.");
  };

  return (
    <CarouselCard className="overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        <img
          src={line.image || RESTAURANT_CART_CARD_IMG_FALLBACK}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = RESTAURANT_CART_CARD_IMG_FALLBACK;
          }}
        />
        <span className="absolute left-4 top-4 z-20 rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
          ×{line.qty}
        </span>
        {!line.available ? (
          <span className="absolute bottom-4 left-4 z-20 rounded-full bg-amber-600/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Unavailable
          </span>
        ) : null}
        <div className="absolute bottom-4 right-4 z-20 flex flex-row items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition active:scale-95 active:bg-black/40 hover:bg-black/35 hover:text-white"
            onClick={handleRemove}
            aria-label="Remove dish from cart"
          >
            <Motion.span
              animate={
                isRemoving
                  ? { scale: [1, 1.24, 0.9, 1], rotate: [0, -8, 6, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              onAnimationComplete={() => setIsRemoving(false)}
              className="flex items-center justify-center"
            >
              <Trash2 size={16} />
            </Motion.span>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white"
          >
            <Link to="/services/restaurant#table-booking" aria-label="Open restaurant booking">
              <Eye size={16} />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-lg font-bold leading-snug text-foreground">{line.name}</p>
          <UtensilsCrossed className="mt-0.5 h-5 w-5 shrink-0 text-primary/60" strokeWidth={1.5} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {eachLabel} each · <span className="font-semibold text-foreground">{lineTotal}</span> line total
        </p>
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
  const navigate = useNavigate();
  const bookingId = booking?._id || booking?.id;
  const roomId = booking?.room?._id || booking?.room?.id;
  const roomName =
    booking?.room?.roomName || `Room ${booking?.room?.roomNumber || ""}`.trim();
  const image = resolveImage(booking?.room);
  const canCancel = isRoomBookingCancellable(booking);
  const needsPayment = booking?.paymentStatus === "awaiting_payment";

  const handleCompletePayment = () => {
    // Navigate to checkout with the booking ID to complete payment
    navigate(`/cart/checkout?bookingId=${bookingId}`);
  };

  return (
    <CarouselCard className="relative overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        {image ? (
          <img src={image} alt={roomName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            <ShoppingBag size={24} />
          </div>
        )}
        <div className="absolute left-4 top-4 z-20 flex max-w-[calc(100%-5.5rem)] flex-wrap gap-2">
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
        <div className="absolute right-4 top-4 z-20">
          <RoomNumberBadge room={booking?.room} floating={false} />
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-2">
          <div className="flex max-w-[min(100%,calc(100%-3.5rem))] flex-wrap gap-2">
            <StatusBadge
              status={booking?.status}
              className="border-white/20 bg-white/12 px-2.5 py-1 text-[9px] tracking-[0.12em] text-white shadow-sm backdrop-blur-md"
            />
            <StatusBadge
              status={booking?.paymentStatus}
              className="border-white/20 bg-white/12 px-2.5 py-1 text-[9px] tracking-[0.12em] text-white shadow-sm backdrop-blur-md"
            />
          </div>
          {roomId ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="pointer-events-auto h-8 w-8 shrink-0 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white"
            >
              <Link to={`/rooms/${roomId}`} aria-label="View Room">
                <Eye size={16} />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div>
          <p className="text-lg font-bold text-foreground">{roomName}</p>
        </div>

        <div className="mt-4 space-y-2">
          {roomBookingMeta(booking, formatBookingDateLabel).map((item) => (
            <BookingMeta key={`${bookingId}-${item.label}`} {...item} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        {needsPayment && (
          <Button
            type="button"
            variant="palmPrimary"
            size="sm"
            className="px-4 shadow-md"
            onClick={handleCompletePayment}
            aria-label="Complete payment for room booking"
          >
            <CreditCard size={14} className="mr-1" />
            Complete Payment
          </Button>
        )}
        {canCancel && !needsPayment && (
          <Button
            type="button"
            variant="palmPrimary"
            size="sm"
            className="px-4 shadow-md"
            disabled={Boolean(pendingCancelKey)}
            aria-label="Cancel room booking"
            onClick={() =>
              runCancelAction({
                key: `room-${bookingId}`,
                action: cancelBooking({ id: bookingId, axiosPrivate }),
                successMessage: "Room booking cancelled successfully.",
                fallbackMessage: "Failed to cancel room booking.",
              })
            }
          >
            {pendingCancelKey === `room-${bookingId}` ? "..." : "Cancel"}
          </Button>
        )}
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
  const navigate = useNavigate();
  const bookingId = booking?._id || booking?.id;
  const activityId = booking?.activity?.id || booking?.activity?._id;
  const activityName = booking?.activity?.title || "Activity session";
  const image = resolveImage(booking?.activity);
  const canCancel = isActivityBookingCancellable(booking);
  const needsPayment = booking?.paymentStatus === "awaiting_payment";

  const handleCompletePayment = () => {
    // Navigate to checkout with the booking ID to complete payment
    navigate(`/cart/checkout?bookingId=${bookingId}`);
  };

  return (
    <CarouselCard className="relative overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
        {image ? (
          <img src={image} alt={activityName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            <Ticket size={24} />
          </div>
        )}
        <div className="absolute left-4 top-4 z-20 max-w-[calc(100%-5.5rem)]">
          <span className="inline-flex rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
            {booking?.paymentStatus === "paid"
              ? `Paid in full - Total ${formatCurrency(booking?.totalPrice || 0)}`
              : `Booked ${formatDateOnly(booking?.createdAt)}`}
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-2">
          <div className="flex max-w-[min(100%,calc(100%-3.5rem))] flex-wrap gap-2">
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
          {activityId ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="pointer-events-auto h-8 w-8 shrink-0 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/35 hover:text-white"
            >
              <Link to={`/services/activities/${activityId}`} aria-label="View Activity">
                <Eye size={16} />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div>
          <p className="text-lg font-bold text-foreground">{activityName}</p>
        </div>

        <div className="mt-4 space-y-2">
          {activityBookingMeta(booking).map((item) => (
            <BookingMeta key={`${bookingId}-${item.label}`} {...item} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        {needsPayment && (
          <Button
            type="button"
            variant="palmPrimary"
            size="sm"
            className="px-4 shadow-md"
            onClick={handleCompletePayment}
            aria-label="Complete payment for activity booking"
          >
            <CreditCard size={14} className="mr-1" />
            Complete Payment
          </Button>
        )}
        {canCancel && !needsPayment && (
          <Button
            type="button"
            variant="palmSecondary"
            size="sm"
            className="px-4 shadow-md"
            disabled={Boolean(pendingCancelKey)}
            aria-label="Cancel activity booking"
            onClick={() =>
              runCancelAction({
                key: `activity-${bookingId}`,
                action: cancelActivityBooking({ axiosPrivate, bookingId }),
                successMessage: "Activity booking cancelled successfully.",
                fallbackMessage: "Failed to cancel activity booking.",
              })
            }
          >
            {pendingCancelKey === `activity-${bookingId}` ? "..." : "Cancel"}
          </Button>
        )}
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
  const navigate = useNavigate();
  const bookingId = booking?.id || booking?._id;
  const canCancel = isTableBookingCancellable(booking);
  const needsPayment = booking?.paymentStatus === "awaiting_payment";
  const tableLabel =
    booking?.tableNumber === null ? "Waitlist request" : `Table ${booking.tableNumber}`;
  const paymentBadgeStatus = booking?.paymentStatus === "paid" ? "paid" : booking?.paymentStatus === "refunded" ? "refunded" : "unpaid";

  const handleCompletePayment = () => {
    // Navigate to checkout with the booking ID to complete payment
    navigate(`/cart/checkout?bookingId=${bookingId}`);
  };

  return (
    <CarouselCard className="relative">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 text-lg font-bold text-foreground leading-snug">{tableLabel}</p>
          <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
            <StatusBadge status={paymentBadgeStatus} />
            <StatusBadge status={booking?.status} />
          </div>
        </div>
        <p className="w-full text-sm leading-relaxed text-muted-foreground">
          {booking?.tableNumber === null
            ? "We'll upgrade this waitlist request when a matching table becomes available."
            : "Your dining reservation at Palm Mirage Restaurant."}
        </p>
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
      </BookingActionBar>

      {/* Action Buttons */}
      <div className="absolute bottom-5 right-5 z-20 flex gap-2">
        {needsPayment && (
          <Button
            type="button"
            variant="palmPrimary"
            size="sm"
            className="px-4 shadow-md"
            onClick={handleCompletePayment}
            aria-label="Complete payment for table booking"
          >
            <CreditCard size={14} className="mr-1" />
            Complete Payment
          </Button>
        )}
        {canCancel && !needsPayment && (
          <Button
            type="button"
            variant="palmSecondary"
            size="sm"
            className="px-4 shadow-md"
            disabled={Boolean(pendingCancelKey)}
            aria-label="Cancel restaurant booking"
            onClick={() =>
              runCancelAction({
                key: `table-${bookingId}`,
                action: cancelTableBooking({ axiosPrivate, bookingId }),
                successMessage: "Restaurant booking cancelled successfully.",
                fallbackMessage: "Failed to cancel restaurant booking.",
              })
            }
          >
            {pendingCancelKey === `table-${bookingId}` ? "..." : "Cancel"}
          </Button>
        )}
      </div>
    </CarouselCard>
  );
}
