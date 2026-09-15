"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Globe,
  Lock,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appealAlerts, setAppealAlerts] = useState(true);
  const [decayAlerts, setDecayAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoAppeal, setAutoAppeal] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground particles={false} />

      <main className="px-5 pb-20 pt-10 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-400/25 bg-slate-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                <SettingsIcon className="h-3 w-3" />
                Settings
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                Preferences
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Control notifications, appearance, and security for your Karma
                account.
              </p>
            </div>
          </Reveal>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl"
          >
            <SectionHeader icon={<Bell />} title="Notifications" desc="Choose what you want to be alerted about" />
            <div className="mt-4 space-y-3">
              <Toggle
                label="Email alerts"
                description="Get notified when your score changes"
                value={emailAlerts}
                onChange={setEmailAlerts}
              />
              <Toggle
                label="Appeal alerts"
                description="Notify me when an appeal is filed or resolved"
                value={appealAlerts}
                onChange={setAppealAlerts}
              />
              <Toggle
                label="Decay warnings"
                description="Warn me 7 days before inactivity decay applies"
                value={decayAlerts}
                onChange={setDecayAlerts}
              />
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl"
          >
            <SectionHeader icon={<Moon />} title="Appearance" desc="How the dashboard looks" />
            <div className="mt-4 space-y-3">
              <Toggle
                label="Dark mode"
                description="Only dark mode is available right now"
                value={darkMode}
                onChange={setDarkMode}
                disabled
              />
              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-200">Language</p>
                    <p className="text-xs text-slate-500">Display language</p>
                  </div>
                </div>
                <select className="rounded-lg border border-white/[0.08] bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400/50">
                  <option>English</option>
                  <option>Español</option>
                  <option>Français</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl"
          >
            <SectionHeader icon={<ShieldCheck />} title="Security" desc="Protect your reputation" />
            <div className="mt-4 space-y-3">
              <Toggle
                label="Auto-appeal"
                description="Automatically file appeals when decay is applied during active periods"
                value={autoAppeal}
                onChange={setAutoAppeal}
              />
              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-200">Connected wallets</p>
                    <p className="text-xs text-slate-500">
                      Manage wallets allowed to write on your behalf
                    </p>
                  </div>
                </div>
                <button className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-300/40">
                  Manage
                </button>
              </div>
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/[0.03] p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-rose-400/25 bg-rose-400/10">
                <Zap className="h-4 w-4 text-rose-300" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-rose-200">Danger zone</h3>
                <p className="text-xs text-rose-300/70">
                  These actions affect your on-chain reputation
                </p>
              </div>
            </div>
            <button className="rounded-lg border border-rose-400/30 bg-rose-400/5 px-4 py-2 text-xs font-medium text-rose-200 hover:bg-rose-400/10">
              Unlink all platforms
            </button>
          </motion.div>

          {/* Save */}
          <div className="flex items-center justify-end gap-3">
            <button className="btn-ghost px-5 py-2.5 text-sm">Reset</button>
            <button
              onClick={handleSave}
              className="btn-glow flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" /> Saved
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-400/5 text-cyan-300 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div>
        <p className="text-sm text-slate-200">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? "bg-cyan-500" : "bg-slate-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}