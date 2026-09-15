import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

export const CONTRACT_ADDRESS = '0x5fFb2BaD2F0FD1B3E7bF92827AB1bBA32C4F5597';

export const client = createClient({
  chain: studionet,
});

// ---------- READ FUNCTIONS ----------

export async function getTotalKarma(handle: string): Promise<number> {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_total_karma',
      args: [handle],
    });
    return Number(result);
  } catch (error) {
    console.error('getTotalKarma failed:', error);
    return 0;
  }
}

export async function getCategoryBreakdown(handle: string) {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_category_breakdown',
      args: [handle],
    });
    return JSON.parse(result as string);
  } catch (error) {
    console.error('getCategoryBreakdown failed:', error);
    return { activity: 0, contribution: 0, community: 0, on_chain: 0 };
  }
}

export async function getAllPlatformScores(handle: string) {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_all_platform_scores',
      args: [handle],
    });
    return JSON.parse(result as string);
  } catch (error) {
    console.error('getAllPlatformScores failed:', error);
    return { github: 0, reddit: 0, discord: 0, twitter: 0, on_chain: 0, linkedin: 0 };
  }
}

export async function getKarmaHistory(handle: string) {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_history',
      args: [handle],
    });
    return JSON.parse(result as string);
  } catch (error) {
    console.error('getKarmaHistory failed:', error);
    return { count: 0, entries: [] };
  }
}

export async function getKarmaMetadata(handle: string) {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_karma_with_metadata',
      args: [handle],
    });
    return JSON.parse(result as string);
  } catch (error) {
    console.error('getKarmaMetadata failed:', error);
    return null;
  }
}

export async function getAppealStatus(user: string, platform: string) {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_appeal_status',
      args: [user, platform],
    });
    return JSON.parse(result as string);
  } catch (error) {
    console.error('getAppealStatus failed:', error);
    return { is_appealed: false, status: 'NONE' };
  }
}

// ---------- WRITE FUNCTIONS ----------

export type WriteResult = {
  success: boolean;
  hash?: string;
  error?: string;
};

export async function submitAppeal(
  walletClient: any,
  user: string,
  platform: string,
  reason: string,
): Promise<WriteResult> {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: 'appeal_score',
      args: [user, platform, reason],
      value: BigInt(0),
    });
    return { success: true, hash: String(hash) };
  } catch (error) {
    console.error('submitAppeal failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function setScore(
  walletClient: any,
  user: string,
  platform: string,
  score: number,
): Promise<WriteResult> {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: 'set_score',
      args: [user, platform, BigInt(score)],
      value: BigInt(0),
    });
    return { success: true, hash: String(hash) };
  } catch (error) {
    console.error('setScore failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function resolveAppeal(
  walletClient: any,
  user: string,
  platform: string,
  newScore: number,
): Promise<WriteResult> {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: 'resolve_appeal',
      args: [user, platform, BigInt(newScore)],
      value: BigInt(0),
    });
    return { success: true, hash: String(hash) };
  } catch (error) {
    console.error('resolveAppeal failed:', error);
    return { success: false, error: String(error) };
  }
}