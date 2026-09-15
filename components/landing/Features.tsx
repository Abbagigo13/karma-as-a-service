"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Gavel, Globe2, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  copy: string;
  bullets: string[];
  accent: string;
  glowFrom: string;
};

const features: Feature[] = [
  {
    icon: Globe2,
    title: "Multi-Platform",
    copy:
      "One score, every surface. Karma aggregates GitHub, Reddit, Discord, X, LinkedIn and raw on-chain history into a single portable identity.",
    bullets: ["6 connected sources", "Sybil-resistant linking", "Zero custody of your data"],
    accent: "text-cyan-300",
    glowFrom: "from-cyan-400/70",
  },
  {
    icon: BrainCircuit,
    title: "AI Evaluated",
    copy:
      "GenLayer validators run LLMs on the raw evidence and reach optimistic consensus on subjective quality — not just counting commits, but judging them.",
    bullets: ["12 independent validators", "92% consensus threshold", "Natural-language rubrics"],
    accent: "text-fuchsia-300",
    glowFrom: "from-fuchsia-400/70",
  },
  {
    icon: Gavel,
    title: "Decay & Appeals",
    copy:
      "Reputation is a living value. Inactivity decays your score over time, and any evaluation can be appealed on-chain for a fresh validator round.",
    bullets: ["-0.4 karma / idle week", "On-chain appeal window", "Fully auditable history"],
    accent: "text-violet-300",
    glowFrom: "from-violet-400/70",
  },
];

/** Three-column features grid: scroll-triggered stagger + 3D hover lift. */
export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* section header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            The protocol
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-50 sm:text-[2.6rem] sm:leading-tight">
            Reputation that <span className="text-gradient">can&apos;t be faked</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Three primitives make Karma work as public infrastructure for agents, DAOs and
            protocols that need to know who they are dealing with.
          </p>
        </Reveal>

        {/* grid */}
        <Reveal
          stagger
          amount={0.15}
          className="mt-16 grid gap-6 [perspective:1400px] lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <RevealItem key={f.title} className="h-full">
              <GlassCard hoverLift gradientBorder className="flex h-full flex-col p-7">
                {/* corner glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${f.glowFrom} to-transparent opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45`}
                />

                {/* 3D icon tile */}
                <motion.div
                  whileHover={{ rotateY: 18, rotateX: -10, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.12] to-white/[0.02] shadow-[0_18px_40px_-20px_rgba(34,211,238,0.65)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <f.icon className={`h-6 w-6 ${f.accent}`} strokeWidth={2} />
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-fuchsia-500/10" />
                </motion.div>

                <div className="mt-6 flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-50">{f.title}</h3>
                  <span className="font-mono text-[11px] text-slate-600">0{i + 1}</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.copy}</p>

                <ul className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-[13px] text-slate-300">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* bottom accent line grows on hover */}
                <div className="mt-auto pt-6">
                  <div className="h-px w-full overflow-hidden bg-white/[0.06]">
                    <div className="h-full w-0 bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-all duration-700 group-hover:w-full" />
                  </div>
                </div>
              </GlassCard>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
