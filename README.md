# Karma as a Service — GenLayer frontend

Next.js 14 (App Router, TypeScript) · Tailwind CSS · Framer Motion · Lucide React · Recharts.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.
Requires Node 18.17+ (built and verified on Node 22).

## Pages

| Route        | File                     | What it does                                                                                |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------- |
| `/`          | `app/page.tsx`           | Landing: 3D floating karma card (94/100), pulsing "Live on GenLayer" badge, features grid    |
| `/dashboard` | `app/dashboard/page.tsx` | Sidebar layout, search + 2s mock loading, score 85/100, Pie / Line / Bar charts, appeal flow |

## Files

```
app/
  layout.tsx                 metadata, fonts, dark theme shell
  globals.css                tailwind layers, glassmorphism + gradient utilities
  page.tsx                   landing page
  dashboard/page.tsx         dashboard (search state, 2s setTimeout mock, chart grid)
components/
  ui/GlassCard.tsx           glass surface + gradient hairline + 3D hover lift
  ui/AnimatedBackground.tsx  grid, neon blobs, aurora sweep, particles
  ui/Reveal.tsx              scroll-triggered stagger / fade-up variants
  ui/CountUp.tsx             spring number counter
  landing/Navbar.tsx         sticky top navbar (scroll-reactive blur)
  landing/Hero.tsx           headline, badge, glowing CTA -> /dashboard, stats
  landing/KarmaCard3D.tsx    floating 3D passport card, cursor tilt, conic score ring
  landing/Features.tsx       Multi-Platform / AI Evaluated / Decay & Appeals
  landing/HowItWorks.tsx     4-step pipeline with animated beam
  landing/NetworkPanel.tsx   validator table + contract snippet
  landing/CtaFooter.tsx      closing CTA + footer
  dashboard/Sidebar.tsx      Overview, Validators, Community, Activity, Appeals, Wallet, Settings
  dashboard/SearchBar.tsx    GitHub handle input + "Check Karma"
  dashboard/OverallKarmaCard.tsx  85/100, animated progress bar, glowing "Appeal Score"
  dashboard/CategoryPieChart.tsx  Recharts Pie (Activity/Contribution/Community/On-Chain)
  dashboard/KarmaHistoryChart.tsx Recharts Line (Day 1/5/10/15)
  dashboard/PlatformBarChart.tsx  Recharts Bar (6 platforms)
  dashboard/ChartCard.tsx    glass shell for charts
  dashboard/ChartTooltip.tsx shared glass tooltip
  dashboard/ActivityFeed.tsx recent on-chain events
  dashboard/AppealModal.tsx  appeal flow with mocked validator round
  dashboard/LoadingState.tsx 2s evaluation animation + skeletons
  dashboard/EmptyState.tsx   pre-search placeholder
lib/mock-data.ts             all mock data (exact structures requested)
```

All data is mocked in `lib/mock-data.ts`; swap it for real GenLayer RPC reads without touching the UI.
