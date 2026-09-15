"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  /** Start immediately instead of waiting for the element to enter the viewport. */
  immediate?: boolean;
};

/** Spring-eased number counter used for scores and stats. */
export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!immediate && !inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, immediate, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
