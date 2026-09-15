"use client";

import { BarChart3 } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import type { PlatformDatum } from "@/lib/mock-data";

/** Per-platform score comparison. */
export function PlatformBarChart({ data }: { data: PlatformDatum[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const best = data.reduce((a, b) => (b.score > a.score ? b : a), data[0]);

  return (
    <ChartCard
      title="Platform Scores"
      subtitle="Reputation per connected source"
      icon={BarChart3}
      accent="cyan"
      className="lg:col-span-2"
      action={
        <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 sm:inline-flex">
          Top: <span className="ml-1 text-cyan-300">{best?.platform}</span>
        </span>
      }
    >
      <div className="h-[268px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
            onMouseLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity={1} />
                <stop offset="55%" stopColor="#22d3ee" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0abfc" stopOpacity={1} />
                <stop offset="60%" stopColor="#c084fc" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(148,163,184,0.10)" strokeDasharray="4 6" vertical={false} />
            <XAxis
              dataKey="platform"
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
              tick={{ fill: "#94a3b8", fontSize: 11.5 }}
              interval={0}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={48}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(148,163,184,0.06)" }}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar
              dataKey="score"
              name="Score"
              radius={[8, 8, 3, 3]}
              maxBarSize={46}
              animationDuration={1300}
              onMouseEnter={(_, index) => setHover(index)}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.platform}
                  fill={hover === i ? "url(#barGradHover)" : "url(#barGrad)"}
                  style={{
                    filter:
                      hover === i
                        ? "drop-shadow(0 0 16px rgba(192,132,252,0.65))"
                        : "drop-shadow(0 8px 16px rgba(34,211,238,0.25))",
                    transition: "filter 200ms ease",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
