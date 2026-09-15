"use client";

import { motion } from "framer-motion";
import { History } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp } from "@/components/ui/Reveal";
import { recentEvents } from "@/lib/mock-data";

const tones: Record<string, string> = {
  cyan: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
  purple: "border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-200",
  amber: "border-amber-300/25 bg-amber-400/10 text-amber-200",
  emerald: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
};

/** Compact ledger of the last on-chain karma events. */
export function ActivityFeed() {
  return (
    <motion.div variants={fadeUp} className="lg:col-span-2">
      <GlassCard hoverLift className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
            <History className="h-4.5 w-4.5 text-cyan-300" />
          </span>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-100">Recent Events</h3>
            <p className="mt-0.5 text-xs text-slate-500">On-chain karma ledger · latest 4</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {recentEvents.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl border px-3.5 py-3 ${tones[e.tone]}`}
            >
              <p className="text-[13px] font-medium leading-snug text-slate-100">{e.label}</p>
              <p className="mt-1 font-mono text-[11px] opacity-80">{e.meta}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
