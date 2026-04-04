import { memo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ThemeToggle from '../ThemeToggle';
import LanguageToggle from '../LanguageToggle';
import LoginButton from '../LoginButton';
import CartButton from '../CartButton';
import WishlistButton from '../WishlistButton';

const MotionDiv = motion.div;

const actionVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

function NavActions({ activeMenu, onHover, onLeave }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-3">
      {isAuthenticated && (
        <MotionDiv variants={actionVariants}>
          <WishlistButton />
        </MotionDiv>
      )}
      {isAuthenticated && (
        <MotionDiv variants={actionVariants}>
          <CartButton />
        </MotionDiv>
      )}
      <MotionDiv variants={actionVariants}>
        <LanguageToggle
          activeMenu={activeMenu}
          onHover={onHover}
          onLeave={onLeave}
        />
      </MotionDiv>
      <MotionDiv variants={actionVariants}>
        <ThemeToggle />
      </MotionDiv>
      <MotionDiv variants={actionVariants}>
        <LoginButton />
      </MotionDiv>
    </div>
  );
}

export default memo(NavActions);
