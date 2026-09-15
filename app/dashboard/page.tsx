"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Radio, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AppealModal } from "@/components/dashboard/AppealModal";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { KarmaHistoryChart } from "@/components/dashboard/KarmaHistoryChart";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { OverallKarmaCard } from "@/components/dashboard/OverallKarmaCard";
import { PlatformBarChart } from "@/components/dashboard/PlatformBarChart";
import { ScoreWriter } from "@/components/dashboard/ScoreWriter";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { staggerParent } from "@/components/ui/Reveal";
import { type KarmaProfile } from "@/lib/mock-data";
import { discoverWallets, connectWithProvider, getConnectedAccount } from "@/lib/wallet";
import {
  getTotalKarma,
  getCategoryBreakdown,
  getAllPlatformScores,
  getKarmaHistory,
  getKarmaMetadata,
} from "@/lib/genlayer";
import { buildKarmaProfile } from "@/lib/karma-mapper";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<KarmaProfile | null>(null);
  const [appealOpen, setAppealOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<{ name: string; provider: any }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function checkKarma(handle: string) {
    setQuery(handle);
    setLoading(true);
    setProfile(null);

    try {
      const [score, categories, platforms, history, metadata] = await Promise.all([
        getTotalKarma(handle),
        getCategoryBreakdown(handle),
        getAllPlatformScores(handle),
        getKarmaHistory(handle),
        getKarmaMetadata(handle),
      ]);

      const onChainProfile = buildKarmaProfile(
        handle,
        score,
        categories,
        platforms,
        history,
        metadata,
      );

      setProfile(onChainProfile);
    } catch (error) {
      console.error("Failed to fetch karma:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    async function detectConnected() {
      const account = await getConnectedAccount();
      if (account) {
        setWalletAddress(account.slice(0, 6) + "…" + account.slice(-4));
      }
    }
    detectConnected();

    if (typeof window !== "undefined") {
      const w = window as any;
      const provider = w.okxwallet || w.ethereum;
      if (provider?.on) {
        provider.on("accountsChanged", (accounts: string[]) => {
          if (accounts[0]) {
            setWalletAddress(accounts[0].slice(0, 6) + "…" + accounts[0].slice(-4));
          } else {
            setWalletAddress("");
            setWalletName("");
          }
        });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-slate-950/70 backdrop-blur-2xl">
          <div className="flex h-[72px] items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-[17px] font-semibold tracking-tight text-slate-50">
                  Reputation Overview
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Query any identity scored by the Karma registry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 sm:inline-flex">
                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="grid place-items-center"
                >
                  <Radio className="h-3.5 w-3.5" />
                </motion.span>
                Live on GenLayer
              </span>
              <button
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-colors hover:text-slate-100"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_2px_rgba(232,121,249,0.8)]" />
              </button>

              <div className="relative">
                <button
                  onClick={async () => {
                    if (walletAddress) {
                      setShowDropdown(!showDropdown);
                    } else {
                      const wallets = await discoverWallets();
                      if (wallets.length === 0) {
                        alert("No wallet detected. Please install MetaMask, OKX, or another wallet.");
                        return;
                      }
                      if (wallets.length === 1) {
                        const result = await connectWithProvider(
                          wallets[0].provider,
                          wallets[0].info.name,
                        );
                        if (result) {
                          setWalletAddress(
                            result.address.slice(0, 6) + "…" + result.address.slice(-4),
                          );
                          setWalletName(result.name);
                        }
                      } else {
                        setAvailableWallets(
                          wallets.map((w) => ({ name: w.info.name, provider: w.provider })),
                        );
                      }
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-300/40"
                >
                  <Wallet className="h-4 w-4 text-cyan-300" />
                  <span className="hidden font-mono text-xs sm:inline">
                    {walletAddress || "Connect Wallet"}
                  </span>
                </button>

                {showDropdown && walletAddress && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1.5 backdrop-blur-xl shadow-2xl">
                    <div className="px-3 py-2">
                      <p className="text-[11px] text-slate-500">Connected via {walletName}</p>
                      <p className="font-mono text-xs text-slate-300 mt-0.5">{walletAddress}</p>
                    </div>
                    <button
                      onClick={() => {
                        setWalletAddress("");
                        setWalletName("");
                        setShowDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-rose-400/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                )}

                {availableWallets.length > 0 && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-2 backdrop-blur-xl shadow-2xl">
                    <p className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-500">
                      Choose a wallet
                    </p>
                    {availableWallets.map((w) => (
                      <button
                        key={w.name}
                        onClick={async () => {
                          const result = await connectWithProvider(w.provider, w.name);
                          if (result) {
                            setWalletAddress(
                              result.address.slice(0, 6) + "…" + result.address.slice(-4),
                            );
                            setWalletName(result.name);
                          }
                          setAvailableWallets([]);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-cyan-400/10"
                      >
                        <span>{w.name}</span>
                        <span className="text-xs text-cyan-300">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 pb-20 pt-10 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl"
              >
                Check anyone&apos;s <span className="text-gradient-animated">karma score</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="mx-auto mt-2.5 max-w-md text-sm text-slate-500"
              >
                One read call to the Karma registry on GenLayer.{" "}
                <Link href="/" className="text-cyan-300 underline-offset-4 hover:underline">
                  What is this?
                </Link>
              </motion.p>
              <div className="mt-7">
                <SearchBar loading={loading} onSearch={checkKarma} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" exit={{ opacity: 0, y: -12 }}>
                  <LoadingState handle={query} />
                </motion.div>
              ) : profile ? (
                <motion.div
                  key="data"
                  initial="hidden"
                  animate="show"
                  variants={staggerParent}
                  className="mt-10 grid gap-6 [perspective:1600px] lg:grid-cols-2"
                >
                  <OverallKarmaCard profile={profile} onAppeal={() => setAppealOpen(true)} />
                  <CategoryPieChart data={profile.categories} />
                  <KarmaHistoryChart data={profile.history} />
                  <PlatformBarChart data={profile.platforms} />
                  <ActivityFeed />
                  <ScoreWriter onSuccess={(h: string) => checkKarma(h)} />
                </motion.div>
              ) : (
                <motion.div key="empty" exit={{ opacity: 0 }}>
                  <EmptyState />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AppealModal
        open={appealOpen}
        onClose={() => setAppealOpen(false)}
        handle={profile?.handle ?? query}
        score={profile?.score ?? 0}
      />
    </div>
  );
}