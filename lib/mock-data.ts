/**
 * Mock data for the Karma as a Service frontend.
 * In production these shapes are returned by the GenLayer intelligent contract
 * (`KarmaRegistry.get_karma(address|handle)`) through the read-only RPC gateway.
 */

export type CategoryDatum = { name: string; value: number };
export type HistoryDatum = { date: string; score: number };
export type PlatformDatum = { platform: string; score: number };

/** Category breakdown — where the karma comes from. */
export const categoryData: CategoryDatum[] = [
  { name: "Activity", value: 80 },
  { name: "Contribution", value: 90 },
  { name: "Community", value: 70 },
  { name: "On-Chain", value: 85 },
];

/** Karma score over time. */
export const historyData: HistoryDatum[] = [
  { date: "Day 1", score: 75 },
  { date: "Day 5", score: 78 },
  { date: "Day 10", score: 82 },
  { date: "Day 15", score: 85 },
];

/** Per-platform scores. */
export const platformData: PlatformDatum[] = [
  { platform: "GitHub", score: 90 },
  { platform: "Reddit", score: 70 },
  { platform: "Discord", score: 60 },
  { platform: "Twitter", score: 80 },
  { platform: "On-Chain", score: 85 },
  { platform: "LinkedIn", score: 50 },
];

/** Overall score shown on the dashboard. */
export const OVERALL_SCORE = 85;

/** Chart palette — neon cyan → purple. */
export const CHART_COLORS = ["#22d3ee", "#38bdf8", "#a855f7", "#e879f9"] as const;

export type KarmaProfile = {
  handle: string;
  address: string;
  score: number;
  tier: string;
  percentile: number;
  delta: number;
  lastEvaluated: string;
  decayRate: string;
  validators: number;
  consensus: number;
  categories: CategoryDatum[];
  history: HistoryDatum[];
  platforms: PlatformDatum[];
};

/** The full mock profile returned by the mocked `checkKarma()` call. */
export const mockProfile: KarmaProfile = {
  handle: "torvalds",
  address: "0x7Af3...C21e",
  score: OVERALL_SCORE,
  tier: "Trusted Contributor",
  percentile: 97,
  delta: 10,
  lastEvaluated: "2 min ago",
  decayRate: "-0.4 / week",
  validators: 12,
  consensus: 92,
  categories: categoryData,
  history: historyData,
  platforms: platformData,
};

export type ValidatorRow = {
  id: string;
  name: string;
  model: string;
  stake: string;
  agreement: number;
  status: "active" | "syncing";
};

export const validators: ValidatorRow[] = [
  { id: "v-01", name: "validator.eth", model: "gpt-4o", stake: "142.8k GEN", agreement: 98, status: "active" },
  { id: "v-02", name: "atlas.node", model: "claude-3.5", stake: "121.4k GEN", agreement: 96, status: "active" },
  { id: "v-03", name: "oracle.dao", model: "llama-3.1-70b", stake: "98.2k GEN", agreement: 94, status: "active" },
  { id: "v-04", name: "nimbus.gen", model: "gpt-4o-mini", stake: "76.5k GEN", agreement: 91, status: "syncing" },
];

export const recentEvents = [
  { id: 1, label: "Contribution proof verified", meta: "linux/kernel · +3.2 karma", tone: "cyan" as const },
  { id: 2, label: "Community sentiment evaluated", meta: "12 validators · consensus 92%", tone: "purple" as const },
  { id: 3, label: "Decay applied", meta: "inactivity window · -0.4 karma", tone: "amber" as const },
  { id: 4, label: "Appeal resolved", meta: "score restored · +1.0 karma", tone: "emerald" as const },
];
