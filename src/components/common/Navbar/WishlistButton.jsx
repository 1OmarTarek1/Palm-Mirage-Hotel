import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useMatch } from 'react-router-dom';
import NavTooltip from './NavTooltip';
import { selectWishlistCount } from '@/store/slices/wishlistSlice';

function WishlistButton({ itemCount: propCount }) {
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  const reduxCount = useSelector(selectWishlistCount);
  const itemCount = isHydrating ? 0 : propCount !== undefined ? propCount : reduxCount;
  const isWishlistPage = useMatch('/wishlist');

  return (
    <NavTooltip label="Wishlist">
      <Link to="/wishlist">
        <motion.button
          id="navbar-wishlist-button"
          aria-label="Wishlist"
          className={`
            relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full
            transition-all duration-300 hover:bg-primary/20 cursor-pointer
            ${isWishlistPage
              ? 'text-primary bg-primary/20 shadow-inner border border-primary/20'
              : 'text-white/60 bg-primary/5 border border-white/10 hover:text-primary hover:border-primary/50'}
          `}
        >
          <Heart className="w-[18px] h-[18px] md:w-5 md:h-5" />

          {/* Badge */}
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="absolute -top-1 -right-1 min-w-[16px] h-[16px] md:min-w-[18px] md:h-[18px] px-1
                           flex items-center justify-center
                           text-[9px] md:text-[10px] font-bold rounded-full
                           bg-primary text-white shadow-md pointer-events-none"
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
