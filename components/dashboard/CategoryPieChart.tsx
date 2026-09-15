"use client";

import { PieChartIcon } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import { CHART_COLORS, type CategoryDatum } from "@/lib/mock-data";

/** Expands the hovered slice and draws its glow ring. */
function ActiveSlice(props: PieSectorDataItem) {
  const { cx, cy, innerRadius, outerRadius = 0, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 14px ${fill}aa)` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.5}
      />
    </g>
  );
}

/** Category breakdown donut: where the karma comes from. */
export function CategoryPieChart({ data }: { data: CategoryDatum[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const active = activeIndex !== undefined ? data[activeIndex] : undefined;

  return (
    <ChartCard
      title="Category Breakdown"
      subtitle="Signal contribution by category"
      icon={PieChartIcon}
      accent="purple"
    >
      <div className="relative h-[248px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {CHART_COLORS.map((c, i) => (
                <linearGradient key={c} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.55} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={96}
              paddingAngle={3}
              cornerRadius={6}
              stroke="rgba(2,6,23,0.9)"
              strokeWidth={2}
              activeIndex={activeIndex}
              activeShape={ActiveSlice}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              animationBegin={120}
              animationDuration={1100}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={`url(#pieGrad${i % CHART_COLORS.length})`} />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip />}
              cursor={false}
              wrapperStyle={{ outline: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* donut center readout */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {active ? active.name : "Weighted"}
            </p>
            <p className="mt-0.5 text-3xl font-bold text-slate-50">
              {active ? active.value : Math.round(total / data.length)}
            </p>
            <p className="text-[10px] text-slate-600">
              {active ? `${Math.round((active.value / total) * 100)}% of signal` : "avg score"}
            </p>
          </div>
        </div>
      </div>

      {/* legend */}
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {data.map((d, i) => (
          <li
            key={d.name}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(undefined)}
            className={`flex cursor-default items-center justify-between rounded-lg border px-2.5 py-2 transition-colors ${
              activeIndex === i ? "border-white/15 bg-white/[0.06]" : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  boxShadow: `0 0 8px 2px ${CHART_COLORS[i % CHART_COLORS.length]}55`,
                }}
              />
              {d.name}
            </span>
            <span className="font-mono text-xs text-slate-200">{d.value}</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
