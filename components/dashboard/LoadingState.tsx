"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Globe2, ScrollText, Search, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const stages = [
  { icon: Globe2, label: "Fetching public evidence" },
  { icon: BrainCircuit, label: "Validator LLMs scoring" },
  { icon: ShieldCheck, label: "Reaching consensus" },
  { icon: ScrollText, label: "Writing result on-chain" },
];

/** Shown for the 2s mocked evaluation round. */
export function LoadingState({ handle }: { handle: string }) {
  return (
    <div className="mt-10 space-y-6">
      <GlassCard className="p-8">
        <div className="flex flex-col items-center text-center">
          {/* scanning orbit */}
          <div className="relative h-24 w-24">
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-cyan-400/30 border-t-cyan-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-3 rounded-full border-2 border-fuchsia-500/25 border-b-fuchsia-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute inset-0 grid place-items-center">
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search className="h-6 w-6 text-cyan-300" />
              </motion.span>
            </span>
          </div>

          <p className="mt-6 text-lg font-semibold text-slate-100">
            Evaluating <span className="text-gradient">@{handle}</span>
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            GenLayer validators are running the karma rubric on live evidence
          </p>

          <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-4">
            {stages.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0.25, y: 8 }}
                animate={{ opacity: [0.25, 1, 0.35] }}
                transition={{ duration: 2, delay: i * 0.45, repeat: Infinity, repeatDelay: 0.2 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
              >
                <s.icon className="mx-auto mb-2 h-4 w-4 text-cyan-300" />
                <p className="text-[11px] leading-snug text-slate-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* shimmering skeletons */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1, 2].map((i) => (
          <GlassCard key={i} className={`h-64 overflow-hidden p-6 ${i === 0 ? "lg:col-span-2" : ""}`}>
            <div className="relative h-full w-full">
              <div className="h-4 w-1/3 rounded-full bg-white/[0.06]" />
              <div className="mt-3 h-3 w-1/4 rounded-full bg-white/[0.04]" />
              <div className="mt-8 flex h-28 items-end gap-3">
                {[40, 70, 55, 85, 60, 75].map((h, j) => (
                  <motion.div
                    key={j}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-cyan-500/15 to-fuchsia-500/15"
                    animate={{ height: [`${h * 0.55}%`, `${h}%`, `${h * 0.7}%`] }}
                    transition={{ duration: 1.8, delay: j * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                animate={{ x: ["0%", "420%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
