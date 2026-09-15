"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/** Parent variants: children animate in sequence when the group scrolls into view. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

/** Child variants: fade + rise + slight 3D rotation. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 42, rotateX: -8, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 90, damping: 16, mass: 0.7 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of extra delay before this element animates. */
  delay?: number;
  /** Viewport amount required before triggering (0–1). */
  amount?: number;
  /** Use the stagger container variants instead of a single fade-up. */
  stagger?: boolean;
  as?: "div" | "section" | "li" | "header";
};

/**
 * Scroll-triggered wrapper. `stagger` turns it into a container whose
 * <RevealItem/> children animate one after another.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.25,
  stagger = false,
  as = "div",
}: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger ? staggerParent : fadeUp}
      transition={delay ? { delay } : undefined}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </Comp>
  );
}

/** A single staggered child inside a <Reveal stagger>. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}
