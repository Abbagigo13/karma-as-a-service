"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ChevronLeft,
  Gavel,
  Hexagon,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = { label: string; icon: LucideIcon; badge?: string };

const primary: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Validators", icon: ShieldCheck, badge: "12" },
  { label: "Community", icon: Users },
  { label: "Activity", icon: Activity },
  { label: "Appeals", icon: Gavel, badge: "2" },
];

const secondary: NavItem[] = [
  { label: "Wallet", icon: Wallet },
  { label: "Settings", icon: Settings },
];

/** Persistent dashboard sidebar. Collapses to icons on desktop, drawer on mobile. */
export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState("Overview");
  const [collapsed, setCollapsed] = useState(false);
  // On desktop the sidebar is always visible; below lg it slides in as a drawer.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const width = collapsed ? "lg:w-[76px]" : "lg:w-64";

  return (
    <>
      {/* mobile backdrop */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
      />

      <motion.aside
        initial={false}
        animate={{ x: isDesktop || open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-slate-950/80 backdrop-blur-2xl ${width} transition-[width] duration-300`}
      >
        {/* logo */}
        <div className="flex h-[72px] items-center gap-2.5 border-b border-white/[0.06] px-5">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="relative grid h-9 w-9 shrink-0 place-items-center">
              <motion.span
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 blur-[6px]"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
              <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-slate-950">
                <Hexagon className="h-4 w-4 text-cyan-300" strokeWidth={2.2} />
              </span>
            </span>
            {!collapsed && (
              <span className="truncate text-[15px] font-semibold tracking-tight text-slate-100">
                Karma<span className="mx-0.5 text-slate-600">/</span><span className="text-gradient">aaS</span>
              </span>
            )}
          </Link>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Protocol
            </p>
          )}
          <ul className="space-y-1">
            {primary.map((item) => (
              <NavRow
                key={item.label}
                item={item}
                active={active === item.label}
                collapsed={collapsed}
                onClick={() => setActive(item.label)}
              />
            ))}
          </ul>

          {!collapsed && (
            <p className="px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Account
            </p>
          )}
          <ul className={`space-y-1 ${collapsed ? "mt-6" : ""}`}>
            {secondary.map((item) => (
              <NavRow
                key={item.label}
                item={item}
                active={active === item.label}
                collapsed={collapsed}
                onClick={() => setActive(item.label)}
              />
            ))}
          </ul>
        </nav>

        {/* network status */}
        <div className="border-t border-white/[0.06] p-3">
          {!collapsed ? (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
              <div className="flex items-center gap-2">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  Network healthy
                </p>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-500">Asimov · block 4,182,904</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          ) : (
            <div className="grid place-items-center py-2">
              <motion.span
                className="h-2 w-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </div>
          )}

          <div className="mt-2 flex items-center gap-1">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2 py-2 text-[11px] text-slate-500 transition-colors hover:text-slate-200 lg:flex"
            >
              <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
              {!collapsed && "Collapse"}
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 text-[11px] text-slate-500 transition-colors hover:text-slate-200"
              title="Back to site"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function NavRow({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
          active ? "text-slate-50" : "text-slate-400 hover:text-slate-100"
        }`}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl border border-cyan-300/25 bg-gradient-to-r from-cyan-400/15 to-fuchsia-500/10"
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          />
        )}
        {active && (
          <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-400 to-fuchsia-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]" />
        )}
        <item.icon
          className={`relative h-4.5 w-4.5 shrink-0 ${active ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`}
          strokeWidth={2}
        />
        {!collapsed && <span className="relative truncate font-medium">{item.label}</span>}
        {!collapsed && item.badge ? (
          <span className="relative ml-auto rounded-full border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            {item.badge}
          </span>
        ) : null}
      </button>
    </li>
  );
}
