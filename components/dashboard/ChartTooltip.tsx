"use client";

import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type Props = TooltipProps<ValueType, NameType> & {
  /** Text appended after each value, e.g. " / 100". */
  suffix?: string;
};

/** Glassmorphic tooltip shared by every Recharts chart. */
export function ChartTooltip({ active, payload, label, suffix = " / 100" }: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/12 bg-slate-950/90 px-3.5 py-2.5 shadow-[0_20px_50px_-20px_rgba(2,6,23,0.95)] backdrop-blur-xl">
      {label !== undefined && label !== null && label !== "" ? (
        <p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      ) : null}
      {payload.map((entry, i) => (
        <div key={`${entry.name}-${i}`} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: (entry.color ?? entry.payload?.fill ?? "#22d3ee") as string,
              boxShadow: `0 0 10px 2px ${(entry.color ?? "#22d3ee") as string}66`,
            }}
          />
          <span className="text-xs text-slate-400">
            {entry.name ?? entry.payload?.name}
          </span>
          <span className="ml-auto font-mono text-sm font-semibold text-slate-100">
            {entry.value}
            <span className="text-[11px] font-normal text-slate-500">{suffix}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
