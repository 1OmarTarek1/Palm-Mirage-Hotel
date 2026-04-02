import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeItem,
  clearCart,
} from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import CartItem from "@/components/shopcart/CartItem";
import CartEmpty from "@/components/shopcart/CartEmpty";
import OrderSummary from "@/components/shopcart/OrderSummary";

export default function ShopCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);

  const increase = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity + 1 }));
      toast.info(`Updated ${item.name} quantity`);
    }
  };

  const decrease = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity - 1 }));
      if (item.quantity - 1 === 0) {
        toast.warning(`${item.name} removed from cart`);
      } else {
        toast.info(`Updated ${item.name} quantity`);
      }
    }
  };

  const remove = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(removeItem(id));
      toast.warning(`${item.name} removed from cart`);
    }
  };

  const clearAll = () => {
    dispatch(clearCart());
    toast.error("Cart cleared");
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="">

        {cartItems.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={increase}
                  onDecrease={decrease}
                  onRemove={remove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}