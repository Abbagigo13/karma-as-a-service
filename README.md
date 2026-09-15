```markdown
# Karma as a Service

> Trustless reputation for the autonomous web — built on GenLayer.

Karma turns scattered social and on-chain signals into a single portable reputation score. GenLayer's AI validators reach consensus on subjective evidence — no oracles, no committees, no trust required.

---

## The Problem

AI agents are trading, negotiating, and hiring each other. But they have no reputation. There's no way to know if an agent you're transacting with is trustworthy, or if it will deliver on a promise.

Existing solutions fail:
- On-chain scores get gamed by whales with capital
- Off-chain scores rely on a single server that can censor or manipulate
- Manual review doesn't scale to millions of agent-to-agent transactions

## The Solution

Karma uses GenLayer's Intelligent Contracts to make reputation subjective but verifiable:

1. **Fetch** — Validators pull public data from the web (GitHub activity, Twitter sentiment, on-chain history)
2. **Evaluate** — Each validator independently runs an LLM prompt to score the evidence
3. **Consensus** — Validators must agree within a semantic tolerance using GenLayer's `prompt_comparative` principle
4. **Settle** — The final score is written on-chain, where any other dApp can read it
5. **Appeal** — Users who disagree can trigger a decentralized appeal process (Internet Court)

---

## How It Works

```

Employer Agent                    Worker Agent
(creates escrow)                  (submits work)

Fetch Deliverable         AI Evaluation
(gl.nondet.web.get)       (gl.nondet.exec_prompt)

Release Funds             Internet Court
(escrow pays)             (human appeal)

```

---

## Features

### On-Chain
- Aggregated Karma Score — weighted average of GitHub, Reddit, Discord, Twitter, on-chain, and LinkedIn activity
- Category breakdown — Activity, Contribution, Community, On-Chain
- Decay — scores decay with inactivity
- Appeals — anyone can file an appeal; admins can resolve with a new score
- History — rolling history per identity
- Appeal status tracking — PENDING / RESOLVED

### Frontend
- Animated landing page with 3D cards and scroll reveals
- Live dashboard reading real on-chain data
- Write scores, file appeals, and resolve disputes from the UI
- Multi-wallet support (MetaMask, OKX, Binance, Coinbase, Rabby) via EIP-6963
- 7 dashboard pages: Overview, Validators, Community, Activity, Appeals, Wallet, Settings

---

## Tech Stack

| Layer | Stack |
|---|---|
| Smart Contract | Python (`py-genlayer` v0.2.16) |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Web3 | `genlayer-js`, EIP-6963, EIP-1193 |
| Deployment | Vercel |

---

## Contract Address

Deployed on **GenLayer Studionet**:

```

0x5fFb2BaD2F0FD1B3E7bF92827AB1bBA32C4F5597

```

Public functions:

Write:
- `set_score(user, platform, score)`
- `appeal_score(user, platform, reason)`
- `resolve_appeal(user, platform, new_score)`

Read:
- `get_total_karma(user)`
- `get_category_breakdown(user)`
- `get_all_platform_scores(user)`
- `get_history(user)`
- `get_appeal_status(user, platform)`
- `get_karma_with_metadata(user)`

---

## Getting Started

Prerequisites:
- Node.js 18+
- A wallet (MetaMask, OKX, etc.)
- Testnet GEN from the GenLayer Faucet

Local development:

```bash
git clone https://github.com/Abbagigo13/karma-as-a-service
cd karma-as-a-service
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Deploy the contract:

```bash
genlayer deploy ./deploy/KarmaRegistry.py
```

---

Hackathon Track

Built for the GenLayer Agent Tank Hackathon. Matches these tracks:

· Future of Work — outcome-based scoring for workers and agents
· Onchain Justice — decentralized appeals for reputation disputes
· AI Governance — Sybil-resistant identity layer
· Agentic Commerce — trust framework for agent-to-agent transactions

---

License

MIT

```