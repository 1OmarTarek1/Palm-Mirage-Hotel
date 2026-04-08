import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  updateItemBookingDates,
  selectPendingRestaurantBookings,
  selectPendingActivityBookings,
  removePendingRestaurantBooking,
  removePendingActivityBooking,
  selectPendingRestaurantTotal,
  selectPendingActivityTotal,
} from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import CartItem from "@/components/shopcart/CartItem";
import CartEmpty from "@/components/shopcart/CartEmpty";
import OrderSummary from "@/components/shopcart/OrderSummary";
import RoomBookingModal from "@/components/rooms/RoomBookingModal";
import PendingRestaurantBookingCard from "@/components/shopcart/PendingRestaurantBookingCard";
import PendingActivityBookingCard from "@/components/shopcart/PendingActivityBookingCard";
import { ShopCartWithItemsSkeleton } from "@/components/shopcart/loading/ShopCartSkeleton";

import { useCartConflicts } from "@/hooks/useCartConflicts";

export default function ShopCart() {
  const dispatch = useDispatch();
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const pendingRestaurantBookings = useSelector(selectPendingRestaurantBookings);
  const pendingActivityBookings = useSelector(selectPendingActivityBookings);
  const [editingItem, setEditingItem] = useState(null);
  const { conflicts, hasConflicts, conflictList } = useCartConflicts();

  const removePendingRestaurantBooking = (id) => {
    dispatch(removePendingRestaurantBooking(id));
    toast.success("Restaurant booking removed from cart");
  };

  const removePendingActivityBooking = (id) => {
    dispatch(removePendingActivityBooking(id));
    toast.success("Activity booking removed from cart");
  };

  const calculatePendingTotals = useMemo(() => {
    const restaurantTotal = pendingRestaurantBookings.reduce((sum, booking) => {
      return sum + (booking.lineItems?.reduce((itemSum, item) => {
        return itemSum + (item.price * item.qty);
      }, 0) || 0);
    }, 0);

    const activityTotal = pendingActivityBookings.reduce((sum, booking) => {
      return sum + (booking.price * booking.guests || 0);
    }, 0);

    return { restaurantTotal, activityTotal, total: restaurantTotal + activityTotal };
  }, [pendingRestaurantBookings, pendingActivityBookings]);

  const allItems = useMemo(() => {
    return [
      ...cartItems,
      ...pendingRestaurantBookings.map(booking => ({
        ...booking,
        type: 'restaurant',
        name: `Restaurant Booking - ${booking.bookingMode}`,
        price: calculatePendingTotals.restaurantTotal / pendingRestaurantBookings.length || 0
      })),
      ...pendingActivityBookings.map(booking => ({
        ...booking,
        type: 'activity',
        name: booking.activityTitle,
        price: booking.price,
        quantity: booking.guests
      }))
    ];
  }, [cartItems, pendingRestaurantBookings, pendingActivityBookings, calculatePendingTotals]);

  const totalWithPending = totalPrice + calculatePendingTotals.total;

  const remove = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(removeItem(id));
      toast.success(`${item.name} removed from cart`);
    }
  };

  const handleConfirmDates = (bookingDraft) => {
    if (!editingItem) return;

    dispatch(
      updateItemBookingDates({
        id: editingItem.id,
        bookingDraft,
      })
    );

    toast.success(`${editingItem.name} booking dates updated.`);
    setEditingItem(null);
  };

  if (isHydrating) return <ShopCartWithItemsSkeleton />;

  const hasAnyItems = cartItems.length > 0 || pendingRestaurantBookings.length > 0 || pendingActivityBookings.length > 0;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="">

        {!hasAnyItems ? (
          <CartEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Regular Cart Items */}
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onEditDates={setEditingItem}
                  onRemove={remove}
                />
              ))}

              {/* Pending Restaurant Bookings */}
              {pendingRestaurantBookings.map((booking) => (
                <PendingRestaurantBookingCard
                  key={booking.id}
                  booking={booking}
                  onRemove={() => removePendingRestaurantBooking(booking.id)}
                  conflict={conflicts[booking.id] || null}
                />
              ))}

              {/* Pending Activity Bookings */}
              {pendingActivityBookings.map((booking) => (
                <PendingActivityBookingCard
                  key={booking.id}
                  booking={booking}
                  onRemove={() => removePendingActivityBooking(booking.id)}
                  conflict={conflicts[booking.id] || null}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <OrderSummary 
                  cartItems={allItems} 
                  totalPrice={totalWithPending}
                  pendingTotals={calculatePendingTotals}
                  hasConflicts={hasConflicts}
                  conflictList={conflictList}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <RoomBookingModal
        isOpen={Boolean(editingItem)}
        room={editingItem}
        initialDraft={editingItem}
        onClose={() => setEditingItem(null)}
        onConfirm={handleConfirmDates}
      />
    </div>
  );
}
