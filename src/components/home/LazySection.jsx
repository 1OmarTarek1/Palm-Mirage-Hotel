import { useEffect, useRef, useState } from "react";

function DefaultFallback({ minHeight = "320px" }) {
  return (
    <div className="px-4 py-10">
      <div
        className="animate-pulse rounded-[2rem] bg-muted/40"
        style={{ minHeight }}
      />
    </div>
  );
}

export default function LazySection({
  children,
  fallback,
  minHeight,
  sectionId,
  rootMargin = "250px 0px",
  triggerOnce = true,
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        if (triggerOnce) {
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin, triggerOnce]);

  return (
    <div ref={containerRef} data-section-anchor={sectionId}>
      {isVisible ? children : fallback ?? <DefaultFallback minHeight={minHeight} />}
    </div>
  );
}
