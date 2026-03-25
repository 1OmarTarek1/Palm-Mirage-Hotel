import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NavTooltip from './NavTooltip';
import { selectWishlistCount } from '@/store/slices/wishlistSlice';

function WishlistButton({ itemCount: propCount }) {
  const reduxCount = useSelector(selectWishlistCount);
  const itemCount = propCount !== undefined ? propCount : reduxCount;

  return (
    <NavTooltip label="Wishlist">
      <Link to="/wishlist">
        <motion.button
          id="navbar-wishlist-button"
          aria-label="Wishlist"
          className={`
            relative flex items-center justify-center w-10 h-10 rounded-full
            transition-all duration-300 hover:bg-primary/20 cursor-pointer
            text-white/60 bg-primary/5 border border-white/10 hover:text-primary hover:border-primary/50
          `}
        >
          <Heart size={18} />

          {/* Badge */}
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1
                           flex items-center justify-center
                           text-[10px] font-bold rounded-full
                           bg-red-500 text-white shadow-md pointer-events-none"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </Link>
    </NavTooltip>
  );
}

export default memo(WishlistButton);
