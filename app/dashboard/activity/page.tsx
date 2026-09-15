"use client";

import { motion } from "framer-motion";
import {
  Activity as ActivityIcon,
  AlertCircle,
  CheckCircle2,
  Gavel,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

type EventType = "score" | "appeal" | "decay" | "consensus" | "evaluation";

type Event = {
  id: number;
  type: EventType;
  label: string;
  detail: string;
  handle: string;
  timestamp: string;
  tone: "cyan" | "purple" | "emerald" | "amber" | "rose";
};

const EVENTS: Event[] = [
  { id: 1, type: "evaluation", label: "Contribution proof verified", detail: "linux/kernel · +3.2 karma", handle: "torvalds", timestamp: "2 min ago", tone: "cyan" },
  { id: 2, type: "consensus", label: "Community sentiment evaluated", detail: "12 validators · consensus 92%", handle: "gigoo", timestamp: "14 min ago", tone: "purple" },
  { id: 3, type: "score", label: "Score updated on-chain", detail: "github · 80 → 85", handle: "gigoo", timestamp: "1 hr ago", tone: "emerald" },
  { id: 4, type: "appeal", label: "Appeal filed by user", detail: "Reason: contribution evidence incomplete", handle: "alice", timestamp: "3 hr ago", tone: "amber" },
  { id: 5, type: "decay", label: "Inactivity decay applied", detail: "github · -0.4 karma", handle: "abba", timestamp: "8 hr ago", tone: "amber" },
  { id: 6, type: "evaluation", label: "AI validator round complete", detail: "consensus 96% · 12 validators", handle: "vitalikbuterin", timestamp: "12 hr ago", tone: "purple" },
  { id: 7, type: "appeal", label: "Appeal resolved in favor of user", detail: "score restored · +1.0 karma", handle: "alice", timestamp: "1 day ago", tone: "emerald" },
  { id: 8, type: "score", label: "New platform linked", detail: "on-chain · verified via signature", handle: "gaearon", timestamp: "1 day ago", tone: "cyan" },
  { id: 9, type: "decay", label: "Inactivity decay applied", detail: "community · -0.2 karma", handle: "kentcdodds", timestamp: "2 days ago", tone: "amber" },
  { id: 10, type: "evaluation", label: "Multi-platform aggregation", detail: "5 sources · weighted avg 88/100", handle: "sindresorhus", timestamp: "2 days ago", tone: "purple" },
];

const TONE_STYLES: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  cyan:    { bg: "bg-cyan-400/10",    border: "border-cyan-400/25",    icon: "text-cyan-300",    text: "text-cyan-200" },
  purple:  { bg: "bg-fuchsia-400/10", border: "border-fuchsia-400/25", icon: "text-fuchsia-300", text: "text-fuchsia-200" },
  emerald: { bg: "bg-emerald-400/10", border: "border-emerald-400/25", icon: "text-emerald-300", text: "text-emerald-200" },
  amber:   { bg: "bg-amber-400/10",   border: "border-amber-400/25",   icon: "text-amber-300",   text: "text-amber-200" },
  rose:    { bg: "bg-rose-400/10",    border: "border-rose-400/25",    icon: "text-rose-300",    text: "text-rose-200" },
};

const ICONS: Record<EventType, React.ReactNode> = {
  score: <TrendingUp />,
  appeal: <Gavel />,
  decay: <TrendingDown />,
  consensus: <Sparkles />,
  evaluation: <Zap />,
};

export default function ActivityPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <main className="px-5 pb-20 pt-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                <ActivityIcon className="h-3 w-3" />
                On-chain activity
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                Every event, <span className="text-gradient-animated">on-chain</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                A live feed of every score update, appeal, and validator
                consensus round written to the Karma registry.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent" />

              <div className="space-y-4">
                {EVENTS.map((event, i) => {
                  const tone = TONE_STYLES[event.tone] ?? TONE_STYLES.cyan;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="relative flex gap-4"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border ${tone.border} ${tone.bg} backdrop-blur-md [&>svg]:h-4 [&>svg]:w-4 ${tone.icon}`}
                      >
                        {ICONS[event.type]}
                      </div>

                      {/* Event card */}
                      <div className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl transition-colors hover:border-white/[0.15]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-semibold ${tone.text}`}>
                              {event.label}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {event.detail}
                            </p>
                          </div>
                          <span className="shrink-0 text-[11px] text-slate-500">
                            {event.timestamp}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-slate-400">
                            @{event.handle}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}