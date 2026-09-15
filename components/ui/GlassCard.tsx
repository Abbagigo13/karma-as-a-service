"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type GlassCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  /** Adds a cyan→purple gradient hairline border around the card. */
  gradientBorder?: boolean;
  /** Lifts the card on hover (used across the features grid + dashboard tiles). */
  hoverLift?: boolean;
  /** Extra classes for the inner surface. */
  className?: string;
  /** Optional glow color behind the card. */
  glow?: "none" | "cyan" | "purple";
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * The single glassmorphic surface used everywhere in the app:
 * blurred translucent panel, subtle inner highlight, optional gradient hairline.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    {
      children,
      className,
      gradientBorder = false,
      hoverLift = false,
      glow = "none",
      ...rest
    },
    ref,
  ) {
    const surface = (
      <div
        className={cx(
          "noise relative h-full w-full overflow-hidden rounded-2xl backdrop-blur-xl",
          // A gradient hairline sits *behind* the surface, so the surface itself
          // must stay dark enough for the border to read as a 1px line.
          gradientBorder
            ? "border-0 bg-slate-950/90"
            : "border border-white/10 bg-slate-900/45",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_24px_70px_-30px_rgba(2,6,23,0.95)]",
          className,
        )}
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {children}
      </div>
    );

    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverLift
            ? { y: -8, rotateX: 3, rotateY: -3, transition: { type: "spring", stiffness: 260, damping: 18 } }
            : undefined
        }
        className={cx(
          "group relative rounded-2xl",
          gradientBorder && "bg-gradient-to-br from-cyan-400/40 via-fuchsia-500/30 to-white/5 p-[1px]",
          glow === "cyan" && "shadow-[0_0_60px_-25px_rgba(34,211,238,0.75)]",
          glow === "purple" && "shadow-[0_0_60px_-25px_rgba(168,85,247,0.75)]",
        )}
        style={{ transformStyle: "preserve-3d", ...(rest.style ?? {}) }}
        {...rest}
      >
        {surface}
      </motion.div>
    );
  },
);
