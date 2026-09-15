"use client";

import { motion } from "framer-motion";
import { Clock, Gavel, Github, ShieldCheck, TrendingDown, TrendingUp, Users } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp } from "@/components/ui/Reveal";
import type { KarmaProfile } from "@/lib/mock-data";

type Props = {
  profile: KarmaProfile;
  onAppeal: () => void;
};

/** Hero tile of the dashboard: massive score, animated progress bar, appeal CTA. */
export function OverallKarmaCard({ profile, onAppeal }: Props) {
  const meta = [
    { icon: Users, label: "Validators", value: `${profile.validators}` },
    { icon: ShieldCheck, label: "Consensus", value: `${profile.consensus}%` },
    { icon: TrendingDown, label: "Decay", value: profile.decayRate },
    { icon: Clock, label: "Evaluated", value: profile.lastEvaluated },
  ];

  return (
    <motion.div variants={fadeUp} className="lg:col-span-2">
      <GlassCard gradientBorder glow="cyan" className="p-6 sm:p-8">
        {/* ambient glows */}
        <motion.div
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/25 blur-[80px]"
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-fuchsia-600/20 blur-[80px]"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.12, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* identity + score */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05]">
                <Github className="h-4.5 w-4.5 text-slate-200" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-lg font-semibold text-slate-50">@{profile.handle}</p>
                  <span className="shrink-0 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                    {profile.tier}
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-500">{profile.address}</p>
              </div>
            </div>

            {/* massive score */}
            <div className="mt-7 flex items-end gap-4">
              <CountUp
                to={profile.score}
                immediate
                duration={2.1}
                className="bg-gradient-to-br from-white via-cyan-100 to-fuchsia-300 bg-clip-text text-[5.5rem] font-bold leading-[0.85] tracking-tighter text-transparent sm:text-[7rem]"
              />
              <div className="pb-3">
                <span className="text-2xl font-medium text-slate-600">/100</span>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                  <TrendingUp className="h-4 w-4" />+{profile.delta} <span className="font-normal text-slate-500">30d</span>
                </div>
              </div>
            </div>

            {/* animated progress bar */}
            <div className="mt-6 max-w-xl">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-500">
                <span>Overall karma</span>
                <span className="text-slate-400">Top {100 - profile.percentile}% of identities</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.05]">
                <motion.div
                  className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.score}%` }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  style={{ boxShadow: "0 0 22px rgba(34,211,238,0.65)" }}
                >
                  <motion.span
                    className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: [-60, 10, -60] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                {/* tick marks */}
                {[25, 50, 75].map((t) => (
                  <span key={t} className="absolute top-0 h-full w-px bg-slate-950/60" style={{ left: `${t}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* right rail: appeal + meta */}
          <div className="w-full shrink-0 lg:w-64">
            <motion.button
              onClick={onAppeal}
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.975 }}
              className="btn-glow group relative w-full overflow-hidden py-3.5"
            >
              <motion.span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ["-100%", "180%"] }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
              />
              <Gavel className="h-4 w-4" strokeWidth={2.5} />
              Appeal Score
            </motion.button>
            <p className="mt-2.5 text-center text-[11px] leading-relaxed text-slate-500">
              Opens a new validator round. Stake is refunded if the appeal succeeds.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {meta.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                  <m.icon className="mb-1.5 h-3.5 w-3.5 text-fuchsia-300" />
                  <p className="truncate text-[13px] font-semibold text-slate-100">{m.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
