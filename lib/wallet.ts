import { createClient } from 'genlayer-js';
// NOTE: `studioDevnet` is the v2.0 RC export for the Studio Next / studio-dev
// network. It ships with the genlayer-js v2.0 RC package -- make sure you've
// upgraded (npm install genlayer-js@<v2.0-RC tag>) before this resolves.
import { studionet, studioDevnet } from 'genlayer-js/chains';

// ---------- NETWORK SELECTION ----------
// Agent Tank requires deployment on Studio Next. Studionet is kept wired up
// as a fallback in case you need to flip back during testing.
export type NetworkName = 'studio-next' | 'studionet';
export const ACTIVE_NETWORK: NetworkName = 'studio-next';

const STUDIONET_PARAMS = {
  chainId: '0xF22F', // 61999
  chainName: 'GenLayer Studionet',
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
  rpcUrls: ['https://studio.genlayer.com/api'],
  blockExplorerUrls: ['https://explorer-studio.genlayer.com'],
};

const STUDIO_NEXT_PARAMS = {
  chainId: '0xF22D', // 61997
  chainName: 'GenLayer Studio Next',
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
  rpcUrls: ['https://studio-next.genlayer.com/api'],
  blockExplorerUrls: ['https://explorer-studio-dev.genlayer.com'],
};

const STUDIONET_RPC_URL = 'https://studio.genlayer.com/api';
const STUDIO_NEXT_RPC_URL = 'https://studio-next.genlayer.com/api';

function paramsFor(network: NetworkName) {
  return network === 'studio-next' ? STUDIO_NEXT_PARAMS : STUDIONET_PARAMS;
}

function rpcUrlFor(network: NetworkName) {
  return network === 'studio-next' ? STUDIO_NEXT_RPC_URL : STUDIONET_RPC_URL;
}

function chainFor(network: NetworkName) {
  return network === 'studio-next' ? studioDevnet : studionet;
}

// ---------- EIP-6963 DISCOVERY ----------

type WalletInfo = {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
};

type WalletDetail = {
  info: WalletInfo;
  provider: any;
};

export async function discoverWallets(): Promise<WalletDetail[]> {
  if (typeof window === 'undefined') return [];

  const providers: WalletDetail[] = [];

  function onAnnounce(event: any) {
    const detail = event.detail as WalletDetail;
    if (!providers.find((p) => p.info.rdns === detail.info.rdns)) {
      providers.push(detail);
    }
  }

  window.addEventListener('eip6963:announceProvider', onAnnounce as any);
  window.dispatchEvent(new Event('eip6963:requestProvider'));

  await new Promise((resolve) => setTimeout(resolve, 300));

  window.removeEventListener('eip6963:announceProvider', onAnnounce as any);

  return providers;
}

export function detectAllWallets(): { name: string; provider: any }[] {
  if (typeof window === 'undefined') return [];
  const w = window as any;
  const found: { name: string; provider: any }[] = [];

  if (w.ethereum?.isMetaMask) found.push({ name: 'MetaMask', provider: w.ethereum });
  if (w.okxwallet) found.push({ name: 'OKX Wallet', provider: w.okxwallet });
  if (w.coinbaseWalletExtension) found.push({ name: 'Coinbase', provider: w.coinbaseWalletExtension });
  if (w.rabby) found.push({ name: 'Rabby', provider: w.rabby });
  if (w.binance) found.push({ name: 'Binance Wallet', provider: w.binance });
  if (w.BinanceChain) found.push({ name: 'Binance Wallet', provider: w.BinanceChain });

  return found;
}

export function detectWallet(): { name: string; provider: any } | null {
  const all = detectAllWallets();
  return all.length > 0 ? all[0] : null;
}

// ---------- CHAIN SWITCH ----------

async function ensureChain(provider: any, network: NetworkName) {
  const params = paramsFor(network);
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: params.chainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    } else {
      throw switchError;
    }
  }
}

// ---------- CONNECT ----------

export type ConnectResult = {
  address: string;
  provider: any;
  name: string;
};

export async function connectWithProvider(provider: any, name: string): Promise<ConnectResult | null> {
  try {
    const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
    return { address: accounts[0], provider, name };
  } catch (error) {
    console.error('Wallet connect rejected:', error);
    return null;
  }
}

export async function connectWallet(): Promise<ConnectResult | null> {
  const all = detectAllWallets();
  if (all.length === 0) return null;
  return connectWithProvider(all[0].provider, all[0].name);
}

export async function getConnectedAccount(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const all = detectAllWallets();
  if (all.length === 0) return null;

  try {
    const accounts: string[] = await all[0].provider.request({ method: 'eth_accounts' });
    return accounts[0] ?? null;
  } catch {
    return null;
  }
}

// ---------- WRITE CLIENT ----------

export async function createWalletClient(provider?: any, network: NetworkName = ACTIVE_NETWORK) {
  let chosen = provider;

  if (!chosen) {
    const detected = detectWallet();
    if (!detected) {
      throw new Error(
        'No wallet detected. Please install MetaMask, OKX Wallet, or another EIP-1193 wallet.',
      );
    }
    chosen = detected.provider;
  }

  // Switch the wallet to the active network (adds it if missing)
  await ensureChain(chosen, network);

  // Request accounts
  const accounts: string[] = await chosen.request({ method: 'eth_requestAccounts' });
  const account = accounts[0] as `0x${string}`;

  // Build the GenLayer client with an EXPLICIT RPC URL.
  // This ensures reads (nonce, gas, chain data) go directly to the RPC
  // instead of being routed through the wallet, which fails with "Failed to fetch".
  const client = createClient({
    chain: chainFor(network),
    account: account,
    transport: {
      type: 'http',
      url: rpcUrlFor(network),
    },
  } as any);

  return { client, account };
}