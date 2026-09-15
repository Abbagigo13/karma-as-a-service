"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Hexagon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Network", href: "#network" },
  { label: "Docs", href: "#docs" },
];

/** Sticky top navigation with scroll-reactive blur + glass border. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 120], ["rgba(2,6,23,0)", "rgba(2,6,23,0.72)"]);
  const border = useTransform(scrollY, [0, 120], ["rgba(255,255,255,0)", "rgba(255,255,255,0.09)"]);
  const blur = useTransform(scrollY, [0, 120], ["blur(0px)", "blur(18px)"]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ backgroundColor: bg, borderColor: border, backdropFilter: blur }}
      className="fixed inset-x-0 top-0 z-50 border-b"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center">
            <motion.span
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 opacity-90 blur-[6px]"
              animate={{ opacity: [0.55, 0.95, 0.55] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-slate-950">
              <Hexagon className="h-4.5 w-4.5 text-cyan-300" strokeWidth={2.2} />
            </span>
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-100">
            Karma<span className="mx-0.5 text-slate-600">/</span><span className="text-gradient">aaS</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="relative rounded-lg px-3.5 py-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="font-mono text-xs text-slate-500">GenLayer Testnet Asimov</span>
          <Link href="/dashboard">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.span>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden border-t border-white/[0.06] bg-slate-950/90 backdrop-blur-xl md:hidden"
      >
        <div className="space-y-1 px-6 py-4">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-sm text-slate-300 hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" className="btn-glow mt-2 w-full">
            Launch Dashboard
          </Link>
        </div>
      </motion.div>
    </motion.header>
  );
}
