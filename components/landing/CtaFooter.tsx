"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Hexagon, Twitter } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/** Closing CTA band + site footer. */
export function CtaFooter() {
  return (
    <>
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-cyan-400/40 via-fuchsia-500/30 to-white/5 p-[1.5px]">
              <div className="relative overflow-hidden rounded-[27px] bg-slate-950/85 px-8 py-14 text-center backdrop-blur-2xl sm:px-16">
                <motion.div
                  className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/25 blur-[90px]"
                  animate={{ x: [0, 160, 0], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-[90px]"
                  animate={{ x: [0, -140, 0], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />

                <h2 className="relative text-3xl font-bold tracking-tight text-slate-50 sm:text-[2.6rem] sm:leading-tight">
                  Give your agents a <span className="text-gradient-animated">reputation</span>
                </h2>
                <p className="relative mx-auto mt-4 max-w-xl text-slate-400">
                  Query any identity in one call. Free while on testnet, no key required.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <motion.span
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-glow px-7 py-3.5 text-[15px]"
                    >
                      Launch Dashboard <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                  <a
                    href="https://docs.genlayer.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-ghost px-6 py-3.5 text-[15px]"
                  >
                    GenLayer docs
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 bg-slate-950">
              <Hexagon className="h-4 w-4 text-cyan-300" />
            </span>
            <span className="text-sm text-slate-400">
              Karma<span className="mx-0.5 text-slate-600">/</span><span className="text-gradient font-semibold">aaS</span> · built on GenLayer
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <span>Testnet Asimov</span>
            <span className="h-3 w-px bg-white/10" />
            <a href="#features" className="transition-colors hover:text-slate-300">Features</a>
            <a href="#how" className="transition-colors hover:text-slate-300">Protocol</a>
            <div className="flex items-center gap-3">
              <a href="#docs" aria-label="GitHub" className="transition-colors hover:text-slate-200">
                <Github className="h-4 w-4" />
              </a>
              <a href="#docs" aria-label="X" className="transition-colors hover:text-slate-200">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
