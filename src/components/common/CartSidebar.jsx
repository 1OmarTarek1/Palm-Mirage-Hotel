import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import {
  closeCart,
  removeItem,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartIsOpen,
  selectCartTotal,
} from "@/store/slices/cartSlice";
import { Link } from "react-router-dom";

export default function CartSidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartIsOpen);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
          />

          {/* Sidebar Panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-70 flex flex-col
                       bg-card/95 backdrop-blur-2xl border-l border-border/50 shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Your Cart</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary/20 text-primary">
                    {items.length}
                  </span>
                )}
              </div>
              <motion.button
                onClick={() => dispatch(closeCart())}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X size={18} className="text-foreground/60" />
              </motion.button>
            </div>

            {/* ── Items List ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground"
                  >
                    <ShoppingCart size={48} strokeWidth={1.2} className="opacity-30" />
                    <p className="text-sm font-medium">Your cart is empty</p>
                    <motion.button
                      onClick={() => dispatch(closeCart())}
                      className="text-primary text-sm font-semibold hover:underline"
                    >
                      Browse Rooms & Services →
                    </motion.button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="flex gap-4 p-3 rounded-2xl bg-muted/40 border border-border/30"
                    >
                      {/* Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {item.name}
                          </p>
                          <motion.button
                            onClick={() => dispatch(removeItem(item.id))}
                            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>

                        {item.nights && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.nights} night{item.nights > 1 ? "s" : ""}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-background/60 rounded-full px-2 py-1 border border-border/40">
                            <motion.button
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-foreground/70"
                            >
                              <Minus size={11} />
                            </motion.button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <motion.button
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-foreground/70"
                            >
                              <Plus size={11} />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <p className="text-sm font-bold text-primary">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border/40 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Total</span>
                  <span className="text-xl font-bold text-foreground">
                    ${total.toLocaleString()}
                  </span>
                </div>

                {/* Clear + Checkout */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => dispatch(clearCart())}
                    className="flex-1 py-3 rounded-2xl text-sm font-medium border border-border/50
                               text-foreground/70 hover:bg-muted transition-colors"
                  >
                    Clear All
                  </motion.button>

                  <motion.div className="flex-2">
                    <Link
                      to="/checkout"
                      onClick={() => dispatch(closeCart())}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl
                                 bg-primary text-white font-semibold text-sm shadow-lg
                                 hover:bg-primary/90 transition-colors"
                    >
                      Checkout
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
