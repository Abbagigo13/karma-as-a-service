"use client";

import { motion } from "framer-motion";
import { CircleDot, Code2, Copy, Server } from "lucide-react";
import { useState } from "react";
import { validators } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

const snippet = `# GenLayer intelligent contract
class KarmaRegistry(gl.Contract):
    scores: TreeMap[str, u256]

    @gl.public.write
    def evaluate(self, handle: str) -> None:
        def rubric() -> str:
            evidence = gl.nondet.web.render(
                f"https://github.com/{handle}",
                mode="text",
            )
            return gl.nondet.exec_prompt(
                f"Score 0-100 this contributor: {evidence}"
            )

        result = gl.eq_principle.prompt_comparative(
            rubric, "scores agree within 5 points"
        )
        self.scores[handle] = u256(int(result))`;

/** Live-network panel: validator table + the contract snippet. */
export function NetworkPanel() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="network" className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
            The network
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-50 sm:text-[2.4rem]">
            Twelve validators, <span className="text-gradient">one verdict</span>
          </h2>
        </Reveal>

        <div id="docs" className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* validators */}
          <Reveal>
            <GlassCard className="h-full p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Server className="h-4 w-4 text-cyan-300" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Active validators
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  streaming
                </span>
              </div>

              <div className="mt-5 space-y-2.5">
                {validators.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09, duration: 0.5 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">{v.name}</p>
                      <p className="font-mono text-[11px] text-slate-500">{v.model}</p>
                    </div>
                    <div className="flex items-center gap-5 text-right">
                      <div>
                        <p className="font-mono text-xs text-slate-300">{v.stake}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">stake</p>
                      </div>
                      <div className="w-14">
                        <p className="font-mono text-xs text-cyan-300">{v.agreement}%</p>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${v.agreement}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.09 }}
                          />
                        </div>
                      </div>
                      <CircleDot
                        className={`h-3.5 w-3.5 ${v.status === "active" ? "text-emerald-400" : "text-amber-400"}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          {/* code */}
          <Reveal delay={0.1}>
            <GlassCard className="h-full overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-4 w-4 text-fuchsia-300" />
                  <span className="font-mono text-xs text-slate-400">karma_registry.py</span>
                </div>
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-cyan-200"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto px-5 py-5 text-[12.5px] leading-relaxed">
                <code className="font-mono text-slate-300">{snippet}</code>
              </pre>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
