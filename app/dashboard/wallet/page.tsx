"use client";

import { motion } from "framer-motion";
import {
  Copy,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Wallet as WalletIcon,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import {
  discoverWallets,
  connectWithProvider,
  getConnectedAccount,
} from "@/lib/wallet";

export default function WalletPage() {
  const [address, setAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [wallets, setWallets] = useState<{ name: string; provider: any }[]>([]);

  useEffect(() => {
    async function load() {
      const account = await getConnectedAccount();
      if (account) setAddress(account);
    }
    load();
  }, []);

  async function handleConnect() {
    const detected = await discoverWallets();
    if (detected.length === 0) {
      alert("No wallet detected. Install MetaMask or OKX.");
      return;
    }
    if (detected.length === 1) {
      const result = await connectWithProvider(
        detected[0].provider,
        detected[0].info.name,
      );
      if (result) {
        setAddress(result.address);
        setWalletName(result.name);
      }
    } else {
      setWallets(detected.map((w) => ({ name: w.info.name, provider: w.provider })));
    }
  }

  async function handlePick(w: { name: string; provider: any }) {
    const result = await connectWithProvider(w.provider, w.name);
    if (result) {
      setAddress(result.address);
      setWalletName(result.name);
    }
    setWallets([]);
  }

  function handleDisconnect() {
    setAddress("");
    setWalletName("");
  }

  function handleCopy() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const short = address
    ? address.slice(0, 6) + "…" + address.slice(-4)
    : "";

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <main className="px-5 pb-20 pt-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                <WalletIcon className="h-3 w-3" />
                Wallet
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                Your <span className="text-gradient-animated">identity</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                The wallet is your on-chain identity. Scores, appeals, and
                evaluations are all tied to this address.
              </p>
            </div>
          </Reveal>

          {!address ? (
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center backdrop-blur-xl">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10">
                  <WalletIcon className="h-6 w-6 text-cyan-300" />
                </div>
                <h2 className="text-lg font-semibold text-slate-50">
                  No wallet connected
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Connect a wallet to view your Karma score, appeal disputes,
                  and write scores on-chain.
                </p>
                <button onClick={handleConnect} className="btn-glow mt-6 px-6 py-3">
                  Connect Wallet
                </button>

                {wallets.length > 1 && (
                  <div className="mx-auto mt-5 max-w-sm rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-3 text-left">
                    <p className="mb-2 text-xs font-semibold text-cyan-200">
                      Choose a wallet:
                    </p>
                    {wallets.map((w) => (
                      <button
                        key={w.name}
                        onClick={() => handlePick(w)}
                        className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-slate-200 hover:border-cyan-300/40 mb-1"
                      >
                        <span>{w.name}</span>
                        <span className="text-xs text-cyan-300">Connect →</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Address card */}
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/5 via-fuchsia-500/5 to-transparent p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Connected via {walletName || "Wallet"}
                    </p>
                    <p className="mt-2 font-mono text-2xl text-slate-100">
                      {short}
                    </p>
                    <p className="mt-1 font-mono text-xs text-slate-600">
                      {address}
                    </p>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 rounded-lg border border-rose-400/25 bg-rose-400/5 px-3 py-2 text-xs text-rose-300 hover:bg-rose-400/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Disconnect
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 hover:border-cyan-300/40"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy address
                      </>
                    )}
                  </button>
                  <a
                    href={`https://explorer-studio.genlayer.com/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 hover:border-cyan-300/40"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on explorer
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard label="Balance" value="0 GEN" sub="Studionet" />
                <StatCard label="Karma Score" value="—" sub="Not yet evaluated" />
                <StatCard label="Appeals" value="0" sub="Active" />
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">
                  Quick actions
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://faucet.genlayer.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-cyan-300/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Get testnet GEN
                      </p>
                      <p className="text-xs text-slate-500">
                        Fund from the faucet
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-cyan-300" />
                  </a>
                  <a
                    href="/dashboard"
                    className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-cyan-300/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Submit a score
                      </p>
                      <p className="text-xs text-slate-500">
                        Write on-chain reputation
                      </p>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-50">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-600">{sub}</p>
    </div>
  );
}