"use client";

import { motion } from "framer-motion";
import { Fingerprint, MousePointerClick } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

/** Pre-search placeholder. */
export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="mt-12"
    >
      <GlassCard className="px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [-8, 8, -8], rotateZ: [-3, 3, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-20 w-20 place-items-center rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-[0_30px_60px_-25px_rgba(34,211,238,0.7)]"
          >
            <Fingerprint className="h-9 w-9 text-cyan-300" strokeWidth={1.6} />
          </motion.div>

          <h3 className="mt-7 text-xl font-semibold text-slate-100">No identity loaded</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Enter a GitHub username above and run an evaluation round. Karma aggregates six sources
            and returns a single consensus score.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-600">
            <MousePointerClick className="h-3.5 w-3.5" /> Try “torvalds”
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
