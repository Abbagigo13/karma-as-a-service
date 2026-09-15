"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp } from "@/components/ui/Reveal";

type Props = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "cyan" | "purple";
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Glassmorphic shell every chart on the dashboard lives in. */
export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  accent = "cyan",
  action,
  children,
  className,
}: Props) {
  const accentClasses =
    accent === "cyan"
      ? { icon: "text-cyan-300", ring: "border-cyan-300/25 bg-cyan-400/10", glow: "bg-cyan-500/20" }
      : { icon: "text-fuchsia-300", ring: "border-fuchsia-300/25 bg-fuchsia-400/10", glow: "bg-fuchsia-500/20" };

  return (
    <motion.div variants={fadeUp} className={className}>
      <GlassCard hoverLift className="flex h-full flex-col p-5 sm:p-6">
        <div
          className={`pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full ${accentClasses.glow} blur-3xl opacity-40`}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${accentClasses.ring}`}>
              <Icon className={`h-4.5 w-4.5 ${accentClasses.icon}`} strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-100">{title}</h3>
              {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
            </div>
          </div>
          {action}
        </div>
        <div className="relative mt-5 flex-1">{children}</div>
      </GlassCard>
    </motion.div>
  );
}
