import { useState } from "react";
import { mockCartItems } from "./mockData";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import CartEmpty from "./CartEmpty";
import OrderSummary from "./OrderSummary";

export default function ShopCart() {
  const [cartItems, setCartItems] = useState(mockCartItems);

  const increase = (id) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decrease = (id) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const remove = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const clearAll = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="container mx-auto px-4 pt-28 pb-16 font-main">

        <CartHeader
          totalItems={totalItems}
          hasItems={cartItems.length > 0}
          onClearAll={clearAll}
        />

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