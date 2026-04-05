import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useRestaurantCart } from "@/context/RestaurantCartContext";
import { useFlyToCart } from "@/hooks/useFlyToCart";

const DISH_FALLBACK_IMG =
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=320&fit=crop";

/**
 * Adds a menu line to the restaurant cart (sidebar, not auto-opened), flies a marker to the nav cart, and toasts.
 */
export default function RestaurantDishAddButton({ dish, size = "md" }) {
  const { addToCart } = useRestaurantCart();
  const { flyToCart } = useFlyToCart();
  const rawId = dish?.id ?? dish?._id;
  const dishId = rawId != null ? String(rawId) : "";
  if (!dishId) return null;
  const unavailable = dish.available === false;
  const imageUrl = (typeof dish?.image === "string" && dish.image) || dish?.img || DISH_FALLBACK_IMG;
  const name = dish?.name || "Dish";

  const isSm = size === "sm";
  const btnClass = isSm
    ? "h-9 w-9 rounded-full border border-border/50 bg-card/95 text-primary shadow-sm backdrop-blur-sm hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
    : "h-11 w-11 rounded-full border border-border/50 bg-card/95 text-primary shadow-md backdrop-blur-sm hover:bg-primary hover:text-primary-foreground disabled:opacity-40";

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      disabled={unavailable}
      className={`shrink-0 ${btnClass}`}
      aria-label={unavailable ? `${name} is unavailable` : `Add ${name} to cart`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = addToCart(dishId, { openDrawer: false });
        if (!added) return;
        flyToCart(e.currentTarget, "navbar-cart-button", { imageUrl });
        toast.success(`“${name}” added to your cart`);
      }}
    >
      <Plus className={isSm ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
    </Button>
  );
}
