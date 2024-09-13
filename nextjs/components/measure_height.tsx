import { useEffect, useState } from "react";

export const useMeasureHeight = (initialHeight: number) => {
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);

  const [hasMeasuredHeight, setHasMeasuredHeight] = useState(false);
  const [height, setHeight] = useState<number>(initialHeight);

  useEffect(() => {
    if (!wrapperRef) {
      return;
    }
    let t: number;
    const updateHeight = (h: number) => {
      cancelAnimationFrame(t);
      t = requestAnimationFrame(() => {
        setHeight(h);
        setHasMeasuredHeight(true);
      });
    };
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        updateHeight(entry.contentRect.height);
      }
    });
    observer.observe(wrapperRef);
    return () => {
      observer.disconnect();
    };
  }, [wrapperRef]);
  return { height, setWrapperRef, hasMeasuredHeight };
};
