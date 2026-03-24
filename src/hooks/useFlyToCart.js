import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addAnimation, removeAnimation } from '../store/slices/uiSlice';

export function useFlyToCart() {
  const dispatch = useDispatch();

  const flyToCart = useCallback((sourceElement) => {
    // 1. Get source position
    const sourceRect = sourceElement.getBoundingClientRect();
    
    // 2. Find target (Navbar cart button)
    const targetElements = document.querySelectorAll("#navbar-cart-button");
    const targetElement = Array.from(targetElements).find(
      (el) => el.offsetWidth > 0 && el.offsetHeight > 0
    );

    if (!targetElement) {
      console.warn("FlyToCart: visible navbar-cart-button not found");
      return;
    }
    const targetRect = targetElement.getBoundingClientRect();

    // 3. Prepare animation data
    const animationData = {
      startX: sourceRect.left + sourceRect.width / 2,
      startY: sourceRect.top + sourceRect.height / 2,
      endX: targetRect.left + targetRect.width / 2,
      endY: targetRect.top + targetRect.height / 2,
    };

    // 4. Dispatch action (the ID is generated in the reducer)
    // We need to know the ID to remove it later, but the reducer generates it.
    // To handle removal, we can either:
    // a) Generate ID here
    // b) Have the reducer handle it (current implementation in uiSlice)
    
    // Since we want to remove it after 1s, we should ideally have the ID.
    // Let's modify uiSlice to accept an ID or use a different strategy.
    // Actually, I'll generate the ID here for easier cleanup.
    
    const id = Date.now() + Math.random();
    dispatch(addAnimation({ ...animationData, id }));

    // 5. Remove after completion
    setTimeout(() => {
      dispatch(removeAnimation(id));
    }, 1000);
  }, [dispatch]);

  return { flyToCart };
}
