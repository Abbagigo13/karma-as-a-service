"use client";

import { motion } from "framer-motion";
import { Github, Loader2, Search, Sparkles } from "lucide-react";
import { useState } from "react";

type Props = {
  loading: boolean;
  onSearch: (handle: string) => void;
  /** Initial value of the input. */
  initial?: string;
};

const suggestions = ["torvalds", "gaearon", "sindresorhus", "vitalikbuterin"];

/** Central query bar: type a GitHub handle, hit Check Karma. */
export function SearchBar({ loading, onSearch, initial = "torvalds" }: Props) {
  const [value, setValue] = useState(initial);
  const [focused, setFocused] = useState(false);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const handle = value.trim().replace(/^@/, "");
    if (!handle || loading) return;
    onSearch(handle);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-3xl"
    >
      {/* glow behind the bar */}
      <motion.div
        className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[28px] bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-fuchsia-600/20 blur-2xl"
        animate={{ opacity: focused ? 0.95 : 0.45 }}
        transition={{ duration: 0.4 }}
      />

      <form
        onSubmit={submit}
        className="relative rounded-2xl bg-gradient-to-r from-cyan-400/40 via-white/10 to-fuchsia-500/40 p-[1.5px]"
      >
        <div className="flex flex-col gap-3 rounded-[15px] bg-slate-950/85 p-3 backdrop-blur-2xl sm:flex-row sm:items-center sm:p-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
            <Github className="h-5 w-5 shrink-0 text-slate-500" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={loading}
              spellCheck={false}
              placeholder="Enter a GitHub username, e.g. torvalds"
              aria-label="GitHub username"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-slate-100 outline-none placeholder:text-slate-600 disabled:opacity-60"
            />
            {value ? (
              <span className="hidden font-mono text-[11px] text-slate-600 sm:block">github.com/{value}</span>
            ) : null}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.03 }}
            whileTap={loading ? undefined : { scale: 0.97 }}
            className="btn-glow group relative w-full shrink-0 overflow-hidden py-3 sm:w-auto sm:px-6 disabled:cursor-wait disabled:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Evaluating…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" strokeWidth={2.6} />
                Check Karma
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* suggestions */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-600">
          <Sparkles className="h-3 w-3" /> Try
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => {
              setValue(s);
              onSearch(s);
            }}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-cyan-300/40 hover:text-cyan-200 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
