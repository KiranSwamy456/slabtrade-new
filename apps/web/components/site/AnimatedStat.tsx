"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Counts up to the number embedded in `value` (e.g. "248+", "100%") once it scrolls into view. */
export function AnimatedStat({ value }: { value: string }) {
  const match = value.match(/\d+/);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(
    match ? value.replace(match[0], "0") : value,
  );

  useEffect(() => {
    if (!match || !inView) {
      return;
    }

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const target = Number(match[0]);
    const controls = animate(0, target, {
      duration: 1.5,
      ease,
      onUpdate: (latest) => {
        setDisplay(value.replace(match[0], String(Math.round(latest))));
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per view, not on every value identity change
  }, [inView]);

  return (
    <p
      ref={ref}
      className="font-serif text-3xl tracking-[-0.03em] text-[#0d5c63] sm:text-4xl"
    >
      {display}
    </p>
  );
}
