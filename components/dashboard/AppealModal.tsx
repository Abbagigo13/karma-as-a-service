"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Gavel, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { submitAppeal } from "@/lib/genlayer";
import { createWalletClient, detectAllWallets } from "@/lib/wallet";

type Props = {
  open: boolean;
  onClose: () => void;
  handle: string;
  score: number;
};

const reasons = [
  "Contribution evidence was incomplete",
  "Community sentiment misread",
  "Decay applied during active period",
  "Wrong identity linked",
];

export function AppealModal({ open, onClose, handle, score }: Props) {
  const [reason, setReason] = useState(reasons[0]);
  const [phase, setPhase] = useState<"form" | "submitting" | "done" | "error">("form");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [availableWallets, setAvailableWallets] = useState<{ name: string; provider: any }[]>([]);

  useEffect(() => {
    if (!open) return;
    setPhase("form");
    setReason(reasons[0]);
    setTxHash("");
    setErrorMsg("");
    setAvailableWallets([]);
  }, [open]);

  async function handleSubmit() {
    setErrorMsg("");

    // Step 1: Discover wallets
    const wallets = detectAllWallets();

    if (wallets.length === 0) {
      setErrorMsg("No wallet detected. Please install MetaMask or OKX Wallet.");
      setPhase("error");
      return;
    }

    if (wallets.length === 1) {
      await submitWithWallet(wallets[0]);
      return;
    }

    // Multiple wallets → show picker
    setAvailableWallets(wallets);
  }

  async function submitWithWallet(wallet: { name: string; provider: any }) {
    setPhase("submitting");
    setErrorMsg("");
    setAvailableWallets([]);

    try {
      // createWalletClient now ensures the wallet is on Studionet
      // (switches chain, or adds it if missing) before requesting accounts.
      const { client: walletClient } = await createWalletClient(wallet.provider);

      const result = await submitAppeal(walletClient, handle, "github", reason);

      if (result.success) {
        setTxHash(result.hash ?? "");
        setPhase("done");
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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-cyan-400/40 via-fuchsia-500/30 to-white/5 p-[1.5px] shadow-[0_40px_120px_-30px_rgba(34,211,238,0.5)]"
          >
            <div className="relative overflow-hidden rounded-[15px] bg-slate-950 p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-slate-500 transition-colors hover:text-slate-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {(phase === "form" || phase === "submitting") && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10">
                      <Gavel className="h-4.5 w-4.5 text-cyan-300" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50">Appeal karma score</h3>
                      <p className="text-xs text-slate-500">
                        @{handle} · current score {score}/100
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-[13px] leading-relaxed text-slate-400">
                    Appealing opens a fresh round with a new validator set on GenLayer. The
                    transaction requires a wallet signature.
                  </p>

                  <div className="mt-5 space-y-2">
                    {reasons.map((r) => (
                      <button
                        key={r}
                        onClick={() => setReason(r)}
                        disabled={phase === "submitting"}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[13px] transition-colors ${
                          reason === r
                            ? "border-cyan-300/35 bg-cyan-400/10 text-slate-100"
                            : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15"
                        }`}
                      >
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            reason === r ? "border-cyan-300" : "border-slate-600"
                          }`}
                        >
                          {reason === r && <span className="h-2 w-2 rounded-full bg-cyan-300" />}
                        </span>
                        {r}
                      </button>
                    ))}
                  </div>

                  {/* Wallet picker (only shown when multiple wallets are detected) */}
                  {availableWallets.length > 1 && (
                    <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-3">
                      <p className="mb-2 text-xs font-semibold text-cyan-200">Choose a wallet:</p>
                      <div className="space-y-2">
                        {availableWallets.map((w) => (
                          <button
                            key={w.name}
                            onClick={() => submitWithWallet(w)}
                            className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-400/10"
                          >
                            <span>{w.name}</span>
                            <span className="text-xs text-cyan-300">Connect →</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <motion.button
                      onClick={handleSubmit}
                      disabled={phase === "submitting"}
                      whileHover={phase === "submitting" ? undefined : { scale: 1.03 }}
                      whileTap={phase === "submitting" ? undefined : { scale: 0.97 }}
                      className="btn-glow flex-1 py-3"
                    >
                      {phase === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Validators voting…
                        </>
                      ) : (
                        <>
                          <Gavel className="h-4 w-4" /> Submit appeal
                        </>
                      )}
                    </motion.button>
                    <button onClick={onClose} className="btn-ghost px-5 py-3">
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {phase === "done" && (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16 }}
                    className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                  </motion.div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-50">Appeal submitted</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-slate-400">
                    The validators will re-evaluate <span className="text-slate-200">@{handle}</span>{" "}
                    for “{reason.toLowerCase()}”. The result is written on-chain.
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-cyan-400/70 break-all">
                    tx {txHash ? txHash.slice(0, 10) + "…" + txHash.slice(-6) : "pending"}
                  </p>
                  <button onClick={onClose} className="btn-ghost mt-6 px-6 py-2.5">
                    Done
                  </button>
                </div>
              )}

              {phase === "error" && (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16 }}
                    className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-rose-400/30 bg-rose-400/10"
                  >
                    <AlertTriangle className="h-8 w-8 text-rose-300" />
                  </motion.div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-50">Appeal failed</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-rose-300 break-all">
                    {errorMsg}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setPhase("form");
                        setErrorMsg("");
                      }}
                      className="btn-glow px-5 py-2.5"
                    >
                      Try again
                    </button>
                    <button onClick={onClose} className="btn-ghost px-5 py-2.5">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}