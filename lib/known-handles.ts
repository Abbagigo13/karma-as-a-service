"use client";

// The contract has no way to enumerate all appeals -- get_appeal_status is a
// per (handle, platform) lookup, not a list. So a real "Appeals" page can
// only show appeals for handles/platforms we actually know about. This
// module tracks those locally (per-browser) whenever this dashboard is used
// to submit a score or file an appeal, so the Appeals page can check real
// on-chain status for everything YOU'VE actually done, instead of showing
// fabricated entries.

export type KnownEntry = { handle: string; platform: string };

const STORAGE_KEY = "karma_known_handles_v1";

export function getKnownHandles(): KnownEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is KnownEntry =>
        e && typeof e.handle === "string" && typeof e.platform === "string",
    );
  } catch {
    return [];
  }
}

export function addKnownHandle(handle: string, platform: string) {
  if (typeof window === "undefined") return;
  const clean = handle.trim().toLowerCase();
  const plat = platform.trim().toLowerCase();
  if (!clean || !plat) return;

  const existing = getKnownHandles();
  const already = existing.some((e) => e.handle === clean && e.platform === plat);
  if (already) return;

  const next = [...existing, { handle: clean, platform: plat }];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable/full -- non-fatal, just don't persist
  }
}
