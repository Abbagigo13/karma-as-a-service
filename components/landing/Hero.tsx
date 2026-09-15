"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronDown, Zap } from "lucide-react";
import Link from "next/link";
import { KarmaCard3D } from "@/components/landing/KarmaCard3D";
import { CountUp } from "@/components/ui/CountUp";

const headline = ["Trustless", "Reputation", "for the", "Autonomous", "Web"];

const stats = [
  { value: 128, suffix: "k", label: "Identities scored" },
  { value: 12, suffix: "", label: "AI validators" },
  { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
  { value: 4, suffix: "s", label: "Avg finality" },
];

/** Hero: pulsing live badge, gradient headline, glowing CTA and the 3D karma card. */
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 lg:pb-32 lg:pt-44">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* left column */}
        <div className="relative z-10">
          {/* Live on GenLayer badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 backdrop-blur-xl"
          >
            <span className="relative grid h-6 w-6 place-items-center">
              <span className="absolute h-2.5 w-2.5 animate-pulse-ring rounded-full bg-emerald-400" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.9)]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Live on GenLayer
            </span>
            <span className="h-3 w-px bg-white/15" />
            <span className="font-mono text-[11px] text-slate-400">v1.0 · Asimov</span>
          </motion.div>

          {/* headline with word-by-word stagger */}
          <h1
            aria-label={headline.join(" ")}
            className="mt-7 text-[2.65rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.1rem]"
          >
            {headline.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.85, delay: 0.12 + i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                className="mr-[0.28em] inline-block"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className={i >= 3 ? "text-gradient-animated" : "text-slate-50"}>{word}</span>
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            Karma as a Service turns scattered social and on-chain signals into a single portable
            reputation score. GenLayer&apos;s AI validators reach consensus on subjective evidence —
            no oracles, no committees, no trust required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/dashboard">
              <motion.span
                whileHover={{ scale: 1.045, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow group relative overflow-hidden px-7 py-3.5 text-[15px]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Zap className="h-4 w-4" strokeWidth={2.5} />
                Launch Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.span>
            </Link>

            <Link href="#how">
              <motion.span whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="btn-ghost px-6 py-3.5 text-[15px]">
                <BookOpen className="h-4 w-4" />
                Read the protocol
              </motion.span>
            </Link>
          </motion.div>

          {/* stat strip */}
          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1 } } }}
            className="mt-14 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/[0.07] pt-8 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              >
                <dd className="text-2xl font-bold text-slate-50">
                  <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} immediate duration={2} />
                </dd>
                <dt className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">{s.label}</dt>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* right column: the floating 3D card */}
        <div className="relative z-10 lg:pl-6">
          <KarmaCard3D />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-20 hidden justify-center lg:flex"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-slate-600"
        >
          <span className="text-[10px] uppercase tracking-[0.28em]">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
