import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  toggleCart,
  selectCartCount,
  selectCartIsOpen,
  selectRestaurantMenuCartTotalQty,
  clearCart,
  clearPendingRestaurantBookings,
  clearPendingActivityBookings,
} from "@/store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  const reduxCount = useSelector(selectCartCount);
  const isOpen = useSelector(selectCartIsOpen);
  const restaurantQty = useSelector(selectRestaurantMenuCartTotalQty);

  const roomLineCount = isHydrating ? 0 : reduxCount;
  const totalItems = roomLineCount + restaurantQty;

  const handleViewCart = () => {
    if (totalItems === 0) {
      toast.info("Your cart is empty");
      return;
    }
    navigate("/cart");
  };

  const handleToggleCart = () => {
    dispatch(toggleCart());
  };

  const handleResetCart = () => {
    if (totalItems === 0) {
      toast.info("Your cart is already empty");
      return;
    }

    if (window.confirm("Are you sure you want to clear your entire cart? This action cannot be undone.")) {
      dispatch(clearCart());
      dispatch(clearPendingRestaurantBookings());
      dispatch(clearPendingActivityBookings());
      toast.success("Cart cleared successfully");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* View Cart Button */}
      <Button
        onClick={handleViewCart}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 w-full justify-start"
        disabled={totalItems === 0}
      >
        <Eye className="h-4 w-4" />
        <span>View Cart</span>
        {totalItems > 0 && (
          <span className="ml-auto bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {totalItems}
          </span>
        )}
      </Button>

      {/* Toggle Cart Sidebar Button */}
      <Button
        onClick={handleToggleCart}
        variant={isOpen ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-2 w-full justify-start"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>{isOpen ? "Close Cart" : "Open Cart"}</span>
        {totalItems > 0 && (
          <span className="ml-auto bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {totalItems}
          </span>
        )}
      </Button>

      {/* Reset Cart Button */}
      <Button
        onClick={handleResetCart}
        variant="destructive"
        size="sm"
        className="flex items-center gap-2 w-full justify-start"
        disabled={totalItems === 0}
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset Cart</span>
      </Button>
    </div>
  );
}
