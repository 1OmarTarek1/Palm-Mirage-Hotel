import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavTooltip from "./NavTooltip";
import { toggleCart, selectCartCount, selectCartIsOpen } from "@/store/slices/cartSlice";

function CartButton({ itemCount: propCount }) {
  const dispatch = useDispatch();
  const reduxCount = useSelector(selectCartCount);
  const isOpen = useSelector(selectCartIsOpen);

  const itemCount = propCount !== undefined ? propCount : reduxCount;

  return (
    <NavTooltip label="Cart">
      <motion.button
        onClick={() => dispatch(toggleCart())}
        aria-label="Shopping Cart"
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full
          transition-all duration-300 hover:bg-primary/20 cursor-pointer
          ${isOpen
            ? "text-primary bg-primary/20 shadow-inner border border-primary/20"
            : "text-white/60 bg-primary/5 border border-white/10"}
        `}
      >
        <ShoppingCart size={18} />

        {/* Badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                         flex items-center justify-center
                         text-[10px] font-bold rounded-full
                         bg-primary text-white shadow-md pointer-events-none"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </NavTooltip>
  );
}

export default memo(CartButton);
