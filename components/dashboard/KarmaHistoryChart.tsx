"use client";

import { LineChartIcon, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import type { HistoryDatum } from "@/lib/mock-data";

/** Karma score over time, with a glowing gradient stroke. */
export function KarmaHistoryChart({ data }: { data: HistoryDatum[] }) {
  const first = data[0]?.score ?? 0;
  const last = data[data.length - 1]?.score ?? 0;
  const delta = last - first;

  return (
    <ChartCard
      title="Karma History"
      subtitle="Score evolution across evaluation rounds"
      icon={LineChartIcon}
      accent="cyan"
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          <TrendingUp className="h-3 w-3" />
          {delta >= 0 ? "+" : ""}
          {delta} pts
        </span>
      }
    >
      <div className="h-[248px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="55%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(148,163,184,0.10)" strokeDasharray="4 6" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={6}
            />
            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={48}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "rgba(34,211,238,0.35)", strokeWidth: 1, strokeDasharray: "4 4" }}
              wrapperStyle={{ outline: "none" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Karma"
              stroke="url(#lineStroke)"
              strokeWidth={3.5}
              strokeLinecap="round"
              dot={{ r: 4, fill: "#020617", stroke: "#22d3ee", strokeWidth: 2.5 }}
              activeDot={{
                r: 7,
                fill: "#22d3ee",
                stroke: "rgba(34,211,238,0.25)",
                strokeWidth: 8,
              }}
              animationDuration={1500}
              style={{ filter: "drop-shadow(0 6px 18px rgba(34,211,238,0.45))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-4">
        {[
          { label: "Start", value: first },
          { label: "Current", value: last },
          { label: "Peak", value: Math.max(...data.map((d) => d.score)) },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-mono text-sm font-semibold text-slate-100">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
