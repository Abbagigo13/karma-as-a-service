"use client";

import { motion } from "framer-motion";
import { Cpu, FileSearch, Link2, ScrollText } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

const steps = [
  {
    icon: Link2,
    title: "Connect",
    copy: "Prove ownership of a handle or wallet. Signatures only — Karma never stores credentials.",
  },
  {
    icon: FileSearch,
    title: "Collect",
    copy: "The intelligent contract fetches public evidence at runtime through GenLayer's web access.",
  },
  {
    icon: Cpu,
    title: "Evaluate",
    copy: "Validator LLMs score the evidence against a shared rubric and converge on one value.",
  },
  {
    icon: ScrollText,
    title: "Settle",
    copy: "The score is written on-chain, decays with inactivity, and stays open to appeal.",
  },
];

/** Horizontal 4-step pipeline with an animated connecting beam. */
export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
            How it works
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-50 sm:text-[2.4rem]">
            Evidence in, <span className="text-gradient">consensus out</span>
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* animated beam */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-white/[0.08] lg:block">
            <motion.div
              className="h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
              animate={{ x: ["-33%", "300%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <Reveal stagger amount={0.2} className="grid gap-6 lg:grid-cols-4">
            {steps.map((s, i) => (
              <RevealItem key={s.title}>
                <GlassCard hoverLift className="h-full p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-slate-950/70">
                      <s.icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <span className="font-mono text-xs text-slate-600">STEP {i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-50">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{s.copy}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
