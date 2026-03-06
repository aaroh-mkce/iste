import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

/**
 * Sentinel element — when it enters the viewport, calls onVisible.
 */
export function InfiniteSentinel({ onVisible, loading }) {
  const [ref, inView] = useInView({ threshold: 0.1, rootMargin: "200px" });

  useEffect(() => {
    if (inView && !loading) {
      onVisible();
    }
  }, [inView, loading, onVisible]);

  return <div ref={ref} className="h-4 w-full" aria-hidden="true" />;
}

export default InfiniteSentinel;
