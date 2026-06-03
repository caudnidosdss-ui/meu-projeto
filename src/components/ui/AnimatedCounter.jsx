import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value = 0, duration = 400 }) {
  const target = Number(value) || 0;
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);

  useEffect(() => {
    const start = shownRef.current;
    if (start === target) return;

    const diff = target - start;
    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(start + diff * eased);
      shownRef.current = next;
      setShown(next);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        shownRef.current = target;
        setShown(target);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return <span className="animated-counter">{shown}</span>;
}
