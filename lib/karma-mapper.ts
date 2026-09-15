import type { KarmaProfile, CategoryDatum, HistoryDatum, PlatformDatum } from './mock-data';

type RawCategories = { activity: number; contribution: number; community: number; on_chain: number };
type RawPlatforms = { github: number; reddit: number; discord: number; twitter: number; on_chain: number; linkedin: number };
type RawHistoryEntry = { index: number; score: number; timestamp: number };
type RawHistory = { count: number; entries: RawHistoryEntry[] };

export function buildKarmaProfile(
  handle: string,
  score: number,
  categories: RawCategories,
  platforms: RawPlatforms,
  history: RawHistory,
  metadata: any,
): KarmaProfile {
  const categoryArray: CategoryDatum[] = [
    { name: 'Activity', value: categories.activity ?? 0 },
    { name: 'Contribution', value: categories.contribution ?? 0 },
    { name: 'Community', value: categories.community ?? 0 },
    { name: 'On-Chain', value: categories.on_chain ?? 0 },
  ];

  const platformArray: PlatformDatum[] = [
    { platform: 'GitHub', score: platforms.github ?? 0 },
    { platform: 'Reddit', score: platforms.reddit ?? 0 },
    { platform: 'Discord', score: platforms.discord ?? 0 },
    { platform: 'Twitter', score: platforms.twitter ?? 0 },
    { platform: 'On-Chain', score: platforms.on_chain ?? 0 },
    { platform: 'LinkedIn', score: platforms.linkedin ?? 0 },
  ];

  const historyArray: HistoryDatum[] = (history.entries ?? []).map((e) => {
    const d = new Date(e.timestamp * 1000);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: e.score,
    };
  });

  return {
    handle,
    address: '0x5fFb…5597',
    score,
    tier: score >= 85 ? 'Trusted Contributor' : score >= 60 ? 'Rising Member' : 'New Identity',
    percentile: Math.min(99, Math.round(score * 1.05)),
    delta: metadata?.decay_amount ? -metadata.decay_amount : 0,
    lastEvaluated: 'just now',
    decayRate: metadata?.decay_applied ? `-${metadata.decay_amount} / week` : '-0 / week',
    validators: 12,
    consensus: 92,
    categories: categoryArray,
    history: historyArray.length > 0 ? historyArray : [{ date: 'Now', score }],
    platforms: platformArray,
  };
}