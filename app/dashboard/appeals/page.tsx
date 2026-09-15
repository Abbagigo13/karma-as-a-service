"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Gavel,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { resolveAppeal } from "@/lib/genlayer";
import { createWalletClient, discoverWallets, connectWithProvider } from "@/lib/wallet";

type Appeal = {
  id: number;
  handle: string;
  platform: string;
  currentScore: number;
  reason: string;
  initiator: string;
  timestamp: string;
  status: "PENDING" | "RESOLVED";
};

const INITIAL_APPEALS: Appeal[] = [
  {
    id: 1,
    handle: "alice",
    platform: "github",
    currentScore: 60,
    reason: "Contribution evidence was incomplete",
    initiator: "0x2a9d…4454",
    timestamp: "3 hours ago",
    status: "PENDING",
  },
  {
    id: 2,
    handle: "abba",
    platform: "twitter",
    currentScore: 55,
    reason: "Community sentiment misread",
    initiator: "0x4f21…8a2c",
    timestamp: "1 day ago",
    status: "PENDING",
  },
  {
    id: 3,
    handle: "alice",
    platform: "github",
    currentScore: 55,
    reason: "Decay applied during active period",
    initiator: "0x2a9d…4454",
    timestamp: "5 days ago",
    status: "RESOLVED",
  },
];

export default function AppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>(INITIAL_APPEALS);
  const [tab, setTab] = useState<"PENDING" | "RESOLVED">("PENDING");
  const [selected, setSelected] = useState<Appeal | null>(null);

  const filtered = appeals.filter((a) => a.status === tab);

  function handleResolved(id: number) {
    setAppeals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "RESOLVED" as const } : a)),
    );
    setSelected(null);
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <main className="px-5 pb-20 pt-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                <Gavel className="h-3 w-3" />
                Internet Court
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                Appeals &amp; <span className="text-gradient-animated">disputes</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Anyone can appeal a score. The Internet Court of validators
                reviews the evidence and writes a corrected score on-chain.
              </p>
            </div>
          </Reveal>

          {/* Tabs */}
          <Reveal delay={0.1}>
            <div className="mb-6 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-xl">
              {(["PENDING", "RESOLVED"] as const).map((t) => {
                const count = appeals.filter((a) => a.status === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      tab === t ? "text-slate-50" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="appeals-tab"
                        className="absolute inset-0 rounded-lg border border-cyan-300/25 bg-gradient-to-r from-cyan-400/15 to-fuchsia-500/10"
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative">{t === "PENDING" ? "Pending" : "Resolved"}</span>
                    <span className="relative rounded-full bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Appeals list */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center backdrop-blur-xl"
                >
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
                  <p className="text-sm text-slate-400">
                    {tab === "PENDING"
                      ? "No pending appeals. The court is quiet."
                      : "No resolved appeals yet."}
                  </p>
                </motion.div>
              ) : (
                filtered.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-100">
                            @{a.handle}
                          </span>
                          <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                            {a.platform}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              a.status === "PENDING"
                                ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                                : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          “{a.reason}”
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span>Filed by {a.initiator}</span>
                          <span>·</span>
                          <span>{a.timestamp}</span>
                          <span>·</span>
                          <span>
                            Current score:{" "}
                            <span className="font-mono text-slate-300">
                              {a.currentScore}/100
                            </span>
                          </span>
                        </div>
                      </div>

                      {a.status === "PENDING" && (
                        <button
                          onClick={() => setSelected(a)}
                          className="btn-glow shrink-0 px-4 py-2.5 text-sm"
                        >
                          Resolve →
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ResolveModal
        appeal={selected}
        onClose={() => setSelected(null)}
        onResolved={handleResolved}
      />
    </div>
  );
}

// ---------- Resolve Modal ----------

function ResolveModal({
  appeal,
  onClose,
  onResolved,
}: {
  appeal: Appeal | null;
  onClose: () => void;
  onResolved: (id: number) => void;
}) {
  const [newScore, setNewScore] = useState(appeal?.currentScore ?? 80);
  const [phase, setPhase] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState("");
  const [wallets, setWallets] = useState<{ name: string; provider: any }[]>([]);

  async function handleSubmit() {
    if (!appeal) return;
    setPhase("submitting");
    setErrorMsg("");

    const detected = await discoverWallets();
    if (detected.length === 0) {
      setErrorMsg("No wallet detected");
      setPhase("error");
      return;
    }
    if (detected.length === 1) {
      await submitWithProvider(detected[0].provider, detected[0].info.name);
    } else {
      setWallets(detected.map((w) => ({ name: w.info.name, provider: w.provider })));
      setPhase("idle");
    }
  }

  async function submitWithProvider(provider: any, name: string) {
    if (!appeal) return;
    setWallets([]);
    setPhase("submitting");
    try {
      const connection = await connectWithProvider(provider, name);
      if (!connection) {
        setErrorMsg("Wallet connection rejected");
        setPhase("error");
        return;
      }
      const { client: walletClient } = await createWalletClient(connection.provider);
      const result = await resolveAppeal(
        walletClient,
        appeal.handle,
        appeal.platform,
        newScore,
      );
      if (!result) {
        setErrorMsg("No result returned");
        setPhase("error");
        return;
      }
      if (result.success) {
        setTxHash(result.hash ?? "");
        setPhase("done");
        onResolved(appeal.id);
      } else {
        setErrorMsg(result.error ?? "Transaction failed");
        setPhase("error");
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? String(err));
      setPhase("error");
    }
  }

  if (!appeal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-cyan-400/40 via-fuchsia-500/30 to-white/5 p-[1.5px] shadow-[0_40px_120px_-30px_rgba(34,211,238,0.5)]"
        >
          <div className="relative overflow-hidden rounded-[15px] bg-slate-950 p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-slate-500 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            {phase === "done" ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-3" />
                <h3 className="text-lg font-semibold text-slate-50">
                  Appeal resolved
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  @{appeal.handle} · {appeal.platform} · new score {newScore}/100
                </p>
                <p className="mt-3 font-mono text-[11px] text-cyan-400/70 break-all">
                  tx {txHash.slice(0, 10)}…{txHash.slice(-6)}
                </p>
                <button onClick={onClose} className="btn-ghost mt-6 px-6 py-2.5">
                  Close
                </button>
              </div>
            ) : phase === "error" ? (
              <div className="py-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-rose-400 mb-3" />
                <h3 className="text-lg font-semibold text-slate-50">Resolve failed</h3>
                <p className="mt-2 text-sm text-rose-300 break-all">{errorMsg}</p>
                <button
                  onClick={() => setPhase("idle")}
                  className="btn-ghost mt-6 px-6 py-2.5"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300/25 bg-amber-400/10">
                    <Gavel className="h-4.5 w-4.5 text-amber-300" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">
                      Resolve appeal
                    </h3>
                    <p className="text-xs text-slate-500">
                      @{appeal.handle} · {appeal.platform}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 mb-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                    Original reason
                  </p>
                  <p className="text-sm text-slate-300">“{appeal.reason}”</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-400">
                      New score
                    </label>
                    <span className="text-sm font-bold text-cyan-300">
                      {newScore}/100
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    disabled={phase === "submitting"}
                    className="w-full accent-cyan-400"
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Old: {appeal.currentScore}</span>
                    <span
                      className={
                        newScore > appeal.currentScore
                          ? "text-emerald-400"
                          : newScore < appeal.currentScore
                          ? "text-rose-400"
                          : "text-slate-500"
                      }
                    >
                      Δ {newScore - appeal.currentScore > 0 ? "+" : ""}
                      {newScore - appeal.currentScore}
                    </span>
                  </div>
                </div>

                {wallets.length > 1 && (
                  <div className="mb-4 rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-3">
                    <p className="mb-2 text-xs font-semibold text-cyan-200">
                      Choose a wallet:
                    </p>
                    {wallets.map((w) => (
                      <button
                        key={w.name}
                        onClick={() => submitWithProvider(w.provider, w.name)}
                        className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-slate-200 hover:border-cyan-300/40 mb-1"
                      >
                        <span>{w.name}</span>
                        <span className="text-xs text-cyan-300">Connect →</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={onClose} className="btn-ghost flex-1 py-3">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={phase === "submitting"}
                    className="btn-glow flex-1 py-3"
                  >
                    {phase === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Writing…
                      </>
                    ) : (
                      "Write new score"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}