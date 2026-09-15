import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

const STUDIONET_PARAMS = {
  chainId: '0xF22F',
  chainName: 'GenLayer Studionet',
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
  rpcUrls: ['https://studio.genlayer.com/api'],
  blockExplorerUrls: ['https://explorer-studio.genlayer.com'],
};

const STUDIONET_RPC_URL = 'https://studio.genlayer.com/api';

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

async function ensureStudionet(provider: any) {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: STUDIONET_PARAMS.chainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [STUDIONET_PARAMS],
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

export async function createWalletClient(provider?: any) {
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

  // Switch the wallet to Studionet (adds it if missing)
  await ensureStudionet(chosen);

  // Request accounts
  const accounts: string[] = await chosen.request({ method: 'eth_requestAccounts' });
  const account = accounts[0] as `0x${string}`;

  // Build the GenLayer client with an EXPLICIT RPC URL.
  // This ensures reads (nonce, gas, chain data) go directly to the RPC
  // instead of being routed through the wallet, which fails with "Failed to fetch".
  const client = createClient({
    chain: studionet,
    account: account,
    transport: {
      type: 'http',
      url: STUDIONET_RPC_URL,
    },
  } as any);

  return { client, account };
}