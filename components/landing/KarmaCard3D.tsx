"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, BadgeCheck, Fingerprint, Github, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { CountUp } from "@/components/ui/CountUp";

const SCORE = 94;

const platforms = [
  { label: "GitHub", value: 96 },
  { label: "On-Chain", value: 92 },
  { label: "Community", value: 90 },
];

/**
 * The hero's centerpiece: a glassmorphic reputation passport that
 * oscillates on the Y axis forever and tilts in 3D toward the cursor.
 */
export function KarmaCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor-driven 3D tilt.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), { stiffness: 140, damping: 18 });
  const glareX = useTransform(px, [-0.5, 0.5], ["18%", "82%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["12%", "88%"]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 62%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  const ringAngle = (SCORE / 100) * 360;

  return (
    <div className="relative mx-auto w-full max-w-[26rem] [perspective:1600px]">
      {/* floor glow */}
      <motion.div
        className="absolute -bottom-14 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-[100%] bg-cyan-400/25 blur-3xl"
        animate={{ opacity: [0.25, 0.6, 0.25], scaleX: [0.9, 1.05, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Y-axis floating wrapper */}
      <motion.div
        animate={{ y: [-14, 14, -14] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 60, rotateX: -18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="relative rounded-[28px] bg-gradient-to-br from-cyan-400/50 via-fuchsia-500/40 to-white/5 p-[1.5px] shadow-[0_50px_120px_-40px_rgba(34,211,238,0.55),0_40px_120px_-30px_rgba(168,85,247,0.5)]"
        >
          <div className="noise relative overflow-hidden rounded-[27px] bg-slate-950/85 p-7 backdrop-blur-2xl">
            {/* cursor glare */}
            <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0" />
            {/* sheen sweep */}
            <motion.div
              className="pointer-events-none absolute -inset-x-full top-0 h-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
              animate={{ x: ["-20%", "320%"] }}
              transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
            />

            {/* header */}
            <div className="relative flex items-start justify-between" style={{ transform: "translateZ(45px)" }}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
                  <Fingerprint className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Karma Passport</p>
                  <p className="font-mono text-sm text-slate-200">0x7Af3…C21e</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            {/* score ring */}
            <div className="relative mt-8 flex items-center gap-6" style={{ transform: "translateZ(70px)" }}>
              <div className="relative h-40 w-40 shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from -90deg, #22d3ee 0deg, #38bdf8 ${ringAngle * 0.45}deg, #a855f7 ${ringAngle}deg, rgba(148,163,184,0.12) ${ringAngle}deg 360deg)`,
                  }}
                  initial={{ rotate: -12, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute -inset-2 rounded-full border border-cyan-300/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.8)]" />
                </motion.div>
                <div className="absolute inset-[13px] grid place-items-center rounded-full border border-white/[0.06] bg-slate-950 shadow-[inset_0_0_30px_rgba(34,211,238,0.18)]">
                  <div className="text-center">
                    <div className="flex items-end justify-center gap-1">
                      <CountUp
                        to={SCORE}
                        immediate
                        duration={2}
                        className="bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-5xl font-bold leading-none text-transparent"
                      />
                      <span className="pb-1 text-sm font-medium text-slate-500">/100</span>
                    </div>
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">Karma Score</p>
                  </div>
                </div>
              </div>

              {/* platform bars */}
              <div className="flex-1 space-y-3.5">
                {platforms.map((p, i) => (
                  <div key={p.label}>
                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{p.label}</span>
                      <span className="font-mono text-slate-300">{p.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.value}%` }}
                        transition={{ duration: 1.3, delay: 0.8 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* footer stats */}
            <div
              className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5"
              style={{ transform: "translateZ(35px)" }}
            >
              {[
                { icon: ShieldCheck, label: "Validators", value: "12" },
                { icon: Activity, label: "Consensus", value: "92%" },
                { icon: TrendingUp, label: "30d", value: "+10" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5 text-center">
                  <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-fuchsia-300" />
                  <p className="text-sm font-semibold text-slate-100">{value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* floating satellite chips (3D depth) */}
        <motion.div
          className="absolute -left-16 -top-7 hidden lg:block"
          animate={{ y: [0, -18, 0], rotate: [-6, -2, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 shadow-[0_20px_50px_-20px_rgba(34,211,238,0.6)] backdrop-blur-xl">
            <Github className="h-4 w-4 text-slate-200" />
            <span className="text-xs font-medium text-slate-300">1.2k commits</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-14 -top-9 hidden lg:block"
          animate={{ y: [0, 20, 0], rotate: [5, 1, 5] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 shadow-[0_20px_50px_-20px_rgba(168,85,247,0.6)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-fuchsia-300" />
            <span className="text-xs font-medium text-slate-300">AI evaluated</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-9 left-8 hidden lg:block"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 shadow-[0_20px_50px_-20px_rgba(34,211,238,0.5)] backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-medium text-slate-300">Sybil resistant</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
