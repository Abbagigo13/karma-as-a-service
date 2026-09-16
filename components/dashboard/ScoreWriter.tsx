"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { setScore as setGenLayerScore } from "@/lib/genlayer";
import { createWalletClient, discoverWallets, connectWithProvider } from "@/lib/wallet";
import { addKnownHandle } from "@/lib/known-handles";

const PLATFORMS = ["github", "reddit", "discord", "twitter", "on_chain", "linkedin"];

export function ScoreWriter({ onSuccess }: { onSuccess?: (handle: string) => void }) {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("github");
  const [score, setScore] = useState(80);
  const [phase, setPhase] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState("");
  const [wallets, setWallets] = useState<{ name: string; provider: any }[]>([]);

  async function handleSubmit() {
    if (!handle.trim()) {
      setErrorMsg("Please enter a username");
      setPhase("error");
      return;
    }

    setPhase("submitting");
    setErrorMsg("");

    const detected = await discoverWallets();
    if (detected.length === 0) {
      setErrorMsg("No wallet detected. Please install MetaMask or OKX Wallet.");
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
    setWallets([]);
    setPhase("submitting");
    setErrorMsg("");

    try {
      const connection = await connectWithProvider(provider, name);
      if (!connection) {
        setErrorMsg("Wallet connection rejected");
        setPhase("error");
        return;
      }

      const { client: walletClient } = await createWalletClient(connection.provider);

      const result = await setGenLayerScore(
        walletClient,
        handle.toLowerCase(),
        platform,
        score,
      );

      // SAFETY: if result is undefined, treat as error
      if (!result) {
        setErrorMsg("Transaction returned no result — contract may not be reachable");
        setPhase("error");
        return;
      }

      if (result.success) {
        setTxHash(result.hash ?? "");
        setPhase("done");
        addKnownHandle(handle, platform);
        onSuccess?.(handle.toLowerCase());
      } else {
        setErrorMsg(result.error ?? "Transaction failed");
        setPhase("error");
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? String(err));
      setPhase("error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-fuchsia-300/25 bg-fuchsia-400/10">
          <Sparkles className="h-5 w-5 text-fuchsia-300" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Submit Platform Score</h3>
          <p className="text-xs text-slate-500">
            Write a score on-chain — triggers automatic karma recalculation
          </p>
        </div>
      </div>

      {phase === "idle" || phase === "submitting" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. umar"
              disabled={phase === "submitting"}
              className="w-full rounded-xl border border-white/[0.08] bg-slate-950/50 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  disabled={phase === "submitting"}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                    platform === p
                      ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15"
                  }`}
                >
                  {p.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400">Score</label>
              <span className="text-sm font-bold text-cyan-300">{score}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              disabled={phase === "submitting"}
              className="w-full accent-cyan-400"
            />
          </div>

          {wallets.length > 1 && (
            <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-3">
              <p className="mb-2 text-xs font-semibold text-cyan-200">Choose a wallet:</p>
              <div className="space-y-2">
                {wallets.map((w) => (
                  <button
                    key={w.name}
                    onClick={() => submitWithProvider(w.provider, w.name)}
                    className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-slate-200 hover:border-cyan-300/40"
                  >
                    <span>{w.name}</span>
                    <span className="text-xs text-cyan-300">Connect →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={phase === "submitting"}
            className="btn-glow flex w-full items-center justify-center gap-2 py-3"
          >
            {phase === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Writing to chain…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Submit Score
              </>
            )}
          </button>
        </div>
      ) : phase === "done" ? (
        <div className="text-center py-6">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-3" />
          <h4 className="font-semibold text-slate-50">Score written on-chain</h4>
          <p className="text-xs text-slate-500 mt-1">
            {handle} · {platform} · {score}/100
          </p>
          <p className="mt-2 font-mono text-[10px] text-cyan-400/70 break-all">
            tx {txHash.slice(0, 10)}…{txHash.slice(-6)}
          </p>
          <button
            onClick={() => {
              setPhase("idle");
              setTxHash("");
            }}
            className="btn-ghost mt-4 px-5 py-2 text-sm"
          >
            Write another
          </button>
        </div>
      ) : (
        <div className="text-center py-6">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-400 mb-3" />
          <h4 className="font-semibold text-slate-50">Transaction failed</h4>
          <p className="text-xs text-rose-300 mt-2 break-all">{errorMsg}</p>
          <button
            onClick={() => setPhase("idle")}
            className="btn-ghost mt-4 px-5 py-2 text-sm"
          >
            Try again
          </button>
        </div>
      )}
    </motion.div>
  );
}