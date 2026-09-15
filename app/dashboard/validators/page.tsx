"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Server } from "lucide-react";
import { staggerParent, Reveal } from "@/components/ui/Reveal";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

type Validator = {
  name: string;
  model: string;
  stake: string;
  agreement: number;
  status: "active" | "syncing" | "offline";
  region: string;
};

const VALIDATORS: Validator[] = [
  { name: "validator.eth", model: "gpt-4o", stake: "142.8k GEN", agreement: 98, status: "active", region: "US-East" },
  { name: "atlas.node", model: "claude-3.5-sonnet", stake: "121.4k GEN", agreement: 96, status: "active", region: "EU-West" },
  { name: "oracle.dao", model: "llama-3.1-70b", stake: "98.2k GEN", agreement: 94, status: "active", region: "APAC" },
  { name: "nimbus.gen", model: "gpt-4o-mini", stake: "76.5k GEN", agreement: 91, status: "syncing", region: "US-West" },
  { name: "hermes.validator", model: "claude-3-opus", stake: "65.1k GEN", agreement: 89, status: "active", region: "EU-Central" },
  { name: "aeon.node", model: "gemini-1.5-pro", stake: "58.7k GEN", agreement: 87, status: "active", region: "APAC" },
  { name: "sentinel.eth", model: "gpt-4-turbo", stake: "52.3k GEN", agreement: 85, status: "active", region: "US-East" },
  { name: "kepler.dao", model: "llama-3.1-405b", stake: "48.9k GEN", agreement: 83, status: "syncing", region: "EU-West" },
  { name: "pulsar.node", model: "mistral-large", stake: "44.2k GEN", agreement: 81, status: "active", region: "US-West" },
  { name: "vertex.eth", model: "gpt-4o", stake: "41.7k GEN", agreement: 79, status: "active", region: "APAC" },
  { name: "quantum.dao", model: "claude-3-haiku", stake: "38.4k GEN", agreement: 76, status: "active", region: "EU-Central" },
  { name: "echo.node", model: "gemini-1.5-flash", stake: "35.1k GEN", agreement: 74, status: "active", region: "US-East" },
];

export default function ValidatorsPage() {
  const activeCount = VALIDATORS.filter((v) => v.status === "active").length;
  const avgAgreement = Math.round(
    VALIDATORS.reduce((acc, v) => acc + v.agreement, 0) / VALIDATORS.length,
  );
  const totalStake = "824.3k";

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <main className="px-5 pb-20 pt-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                <ShieldCheck className="h-3 w-3" />
                Validator Network
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                Twelve validators,{" "}
                <span className="text-gradient-animated">one verdict</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Every reputation score is evaluated independently by the validator
                set below. Consensus is reached through GenLayer&apos;s Optimistic
                Democracy principle — validators must agree within 5 points.
              </p>
            </div>
          </Reveal>

          {/* Stats */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <StatCard icon={<Server />} label="Total Validators" value="12" />
            <StatCard icon={<Zap />} label="Active Now" value={`${activeCount}`} />
            <StatCard icon={<Activity />} label="Avg Consensus" value={`${avgAgreement}%`} />
            <StatCard icon={<ShieldCheck />} label="Total Stake" value={`${totalStake} GEN`} />
          </motion.div>

          {/* Validator list */}
          <Reveal delay={0.2}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
              <div className="border-b border-white/[0.06] px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-200">
                  Active validator set
                </h2>
                <p className="text-xs text-slate-500">
                  Live consensus scores from the current epoch
                </p>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {VALIDATORS.map((v, i) => (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-fuchsia-500/10">
                      <ShieldCheck className="h-4.5 w-4.5 text-cyan-300" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm text-slate-100">{v.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {v.model} · {v.region}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="font-mono text-sm text-slate-300">{v.stake}</p>
                      <p className="text-[11px] uppercase tracking-wider text-slate-600">
                        Stake
                      </p>
                    </div>

                    <div className="w-24">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Consensus</span>
                        <span className="font-mono text-xs text-cyan-300">
                          {v.agreement}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${v.agreement}%` }}
                          transition={{ duration: 1, delay: i * 0.04 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                        />
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        v.status === "active"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {v.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-400/5 text-cyan-300 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <p className="mt-4 text-2xl font-bold text-slate-50">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
    </motion.div>
  );
}