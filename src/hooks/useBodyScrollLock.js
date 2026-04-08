import { useEffect } from "react";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

function applyLock() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      savedPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }
  }
  lockCount += 1;
}

function releaseLock() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
    savedOverflow = "";
    savedPaddingRight = "";
  }
}

/**
 * Locks document scroll while `locked` is true (reference-counted for nested overlays).
 */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    applyLock();
    return () => {
      releaseLock();
    };
  }, [locked]);
}
