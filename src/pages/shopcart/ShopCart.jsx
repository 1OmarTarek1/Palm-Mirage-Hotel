import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  updateItemBookingDates,
} from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import CartItem from "@/components/shopcart/CartItem";
import CartEmpty from "@/components/shopcart/CartEmpty";
import OrderSummary from "@/components/shopcart/OrderSummary";
import RoomBookingModal from "@/components/rooms/RoomBookingModal";
import { useState } from "react";

export default function ShopCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const [editingItem, setEditingItem] = useState(null);

  const remove = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(removeItem(id));
      toast.warning(`${item.name} removed from cart`);
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

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="">

        {cartItems.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onEditDates={setEditingItem}
                  onRemove={remove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
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
