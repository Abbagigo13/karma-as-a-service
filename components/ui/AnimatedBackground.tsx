"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  /** Renders drifting particles (disabled on the dashboard for readability). */
  particles?: boolean;
  /** Number of particles. */
  count?: number;
};

/**
 * Fixed, non-interactive backdrop: grid, two orbiting neon blobs,
 * a conic aurora sweep and optional drifting particles.
 */
export function AnimatedBackground({ particles = true, count = 26 }: Props) {
  // Deterministic pseudo-random so SSR and client markup match.
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
        return {
          id: i,
          left: r(1) * 100,
          top: r(2) * 100,
          size: 1 + r(3) * 2.5,
          duration: 9 + r(4) * 16,
          delay: r(5) * 8,
          drift: -30 - r(6) * 90,
          cyan: r(7) > 0.45,
        };
      }),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* grid */}
      <div className="absolute inset-0 bg-grid-slate bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_35%,transparent_100%)]" />

      {/* base radial tint */}
      <div className="absolute inset-0 bg-radial-fade" />

      {/* orbiting neon blobs */}
      <motion.div
        className="absolute -left-40 top-[-10%] h-[38rem] w-[38rem] rounded-full bg-cyan-500/20 blur-[130px]"
        animate={{ x: [0, 120, -40, 0], y: [0, 90, 40, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 top-1/3 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-[140px]"
        animate={{ x: [0, -110, 30, 0], y: [0, -70, 60, 0], scale: [1, 0.9, 1.12, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-700/15 blur-[150px]"
        animate={{ x: [0, 70, -70, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* aurora sweep */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[90rem] w-[90rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, #22d3ee 60deg, transparent 140deg, #a855f7 250deg, transparent 340deg)",
          maskImage: "radial-gradient(circle, transparent 32%, #000 46%, transparent 66%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 32%, #000 46%, transparent 66%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      {/* particles */}
      {particles &&
        dots.map((d) => (
          <motion.span
            key={d.id}
            className={`absolute rounded-full ${d.cyan ? "bg-cyan-300" : "bg-fuchsia-300"}`}
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              boxShadow: d.cyan
                ? "0 0 10px 2px rgba(34,211,238,0.6)"
                : "0 0 10px 2px rgba(232,121,249,0.55)",
            }}
            animate={{ y: [0, d.drift], opacity: [0, 0.85, 0] }}
            transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950" />
    </div>
  );
}
