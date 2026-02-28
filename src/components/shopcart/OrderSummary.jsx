import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderSummary({ cartItems, totalPrice }) {
  const navigate = useNavigate()
  return (
    <div className="bg-card shadow-sm border border-transparent dark:border-white/10 rounded-2xl p-6 sticky top-24 space-y-5">
      <h2 className="text-lg font-bold text-foreground">
        Order Summary
      </h2>

      {/* Per-item breakdown */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm text-gray-500 dark:text-gray-400"
          >
            <span className="truncate pr-2">
              {item.name}{" "}
              <span className="text-gray-400 dark:text-gray-600">
                ×{item.quantity}
              </span>
            </span>
            <span className="font-medium text-[#1a1a1a] dark:text-white flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between items-center">
        <span className="font-bold text-[#1a1a1a] dark:text-white">Total</span>
        <span className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
          ${totalPrice.toFixed(2)}
        </span>
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-600">
        * Price is per night. Final total may vary based on stay duration.
      </p>

      <Button onClick={()=> navigate("/cart/checkout")} className="w-full h-12 bg-primary hover:bg-secondary text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
        <Link to="/cart/checkout">Proceed to Checkout</Link>
      </Button>

    
    </div>
  );
}