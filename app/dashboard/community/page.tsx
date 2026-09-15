"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

type Contributor = {
  handle: string;
  score: number;
  tier: string;
  platforms: number;
};

const LEADERBOARD: Contributor[] = [
  { handle: "torvalds", score: 94, tier: "Trusted Contributor", platforms: 5 },
  { handle: "vitalikbuterin", score: 92, tier: "Trusted Contributor", platforms: 5 },
  { handle: "gigoo", score: 80, tier: "Rising Member", platforms: 4 },
  { handle: "gaearon", score: 88, tier: "Trusted Contributor", platforms: 5 },
  { handle: "sindresorhus", score: 86, tier: "Trusted Contributor", platforms: 4 },
  { handle: "alice", score: 70, tier: "Rising Member", platforms: 3 },
  { handle: "abba", score: 72, tier: "Rising Member", platforms: 4 },
  { handle: "umar", score: 65, tier: "Rising Member", platforms: 3 },
  { handle: "kentcdodds", score: 84, tier: "Trusted Contributor", platforms: 5 },
  { handle: "tj", score: 82, tier: "Trusted Contributor", platforms: 4 },
];

const TIER_COLORS: Record<string, string> = {
  "Trusted Contributor": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Rising Member": "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  "New Identity": "border-slate-400/30 bg-slate-400/10 text-slate-400",
};

export default function CommunityPage() {
  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <main className="px-5 pb-20 pt-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300">
                <Users className="h-3 w-3" />
                Community
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                The <span className="text-gradient-animated">leaderboard</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                The highest-rated identities on the Karma registry, ranked by
                their on-chain aggregated score.
              </p>
            </div>
          </Reveal>

          {/* Top 3 podium */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {top3.map((c, i) => {
              const icons = [<Trophy key="1" />, <Medal key="2" />, <Crown key="3" />];
              const colors = [
                "from-amber-400/20 to-orange-500/10 border-amber-400/30",
                "from-slate-300/20 to-slate-400/10 border-slate-300/30",
                "from-amber-700/20 to-amber-900/10 border-amber-700/30",
              ];
              return (
                <motion.div
                  key={c.handle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colors[i]} p-6 backdrop-blur-xl`}
                >
                  <div className="absolute right-4 top-4 text-amber-300 [&>svg]:h-6 [&>svg]:w-6">
                    {icons[i]}
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Rank #{i + 1}
                  </p>
                  <p className="mt-2 truncate text-lg font-bold text-slate-50">
                    @{c.handle}
                  </p>
                  <p className="mt-4 font-mono text-4xl font-bold text-white">
                    {c.score}
                    <span className="text-sm text-slate-500">/100</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {c.platforms} platforms linked
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Rest of leaderboard */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
              <div className="grid grid-cols-[40px_1fr_80px_100px] gap-4 border-b border-white/[0.06] px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <span>#</span>
                <span>Identity</span>
                <span className="text-center">Score</span>
                <span className="text-right">Tier</span>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {rest.map((c, i) => (
                  <motion.div
                    key={c.handle}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="grid grid-cols-[40px_1fr_80px_100px] items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="font-mono text-sm text-slate-500">
                      {i + 4}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm text-slate-100">
                        @{c.handle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {c.platforms} platforms
                      </p>
                    </div>
                    <span className="text-center font-mono text-lg font-bold text-cyan-300">
                      {c.score}
                    </span>
                    <span
                      className={`justify-self-end rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                        TIER_COLORS[c.tier] ?? TIER_COLORS["New Identity"]
                      }`}
                    >
                      {c.tier.split(" ")[0]}
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