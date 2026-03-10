# Aegis BTC 🛡️

**Aegis BTC** is a unified yield protocol, reputation hub, and AI-powered smart contract builder explicitly designed for the Stacks ecosystem. Built for the **BUIDL BATTLE #2 : The Bitcoin Builders Tournament**, Aegis brings premium sBTC yield strategies, AI-driven development tools, and on-chain verification into a single, cohesive, premium experience.

![Aegis BTC Overview](https://img.shields.io/badge/Status-Hackathon_Ready-orange)
![Stacks](https://img.shields.io/badge/Blockchain-Stacks-5546FF)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)

## 🌟 Key Features

### 1. **Premium sBTC Vaults & Yield Protocol**
- Deposit sBTC natively using the Stacks blockchain.
- Secure transactions utilizing fully-integrated Stacks Mainnet / Testnet smart contracts (`SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT`).
- On-chain borrow mechanics integrating synthetic assets like `USDCx`.

### 2. **AI-Powered Clarity Contract Builder**
- A seamless "No-Code" interface allowing builders to prompt complex Smart Contracts in plain English.
- Backed by **Google Gemini API** through a lightning-fast Python **FastAPI** backend to strictly generate valid Clarity `.clar` code.
- Includes a robust offline local fallback agent pre-loaded with secure Clarity templates.

### 3. **Stacks Builder Hub & On-Chain Quests**
- Participate in the web3 ecosystem right from the dashboard.
- Verify user quest completions strictly through on-chain historic transactions using the Hiro API.
- Gamified user experience powered by **Framer Motion** animations.

## 🛠️ Navigation & Main Features (Judges' Guide)

To help you navigate Aegis BTC smoothly, here is a breakdown of the core functions accessible via the top navigation header:

- **1. Builder (AI Contract Builder):** A "No-Code" zone. Input a natural language prompt, and our AI (powered by Gemini) writes deploy-ready Clarity code for you dynamically. If an API key isn't provided, the platform smartly falls back to our robust offline local agent to fetch audited Clarity templates.
- **2. Risks (AI Risk Analyzer):** Paste experimental Clarity contract code and let our analyzer simulate and detect potential vulnerabilities, unhandled panics, and signature risks instantly.
- **3. Quests (Stacks Builder Hub):** A gamified learn-and-earn portal. Complete tasks within the Stacks ecosystem. Your progress is completely on-chain! Task verifications rely on historic Hiro API Stacks blockchain data (e.g., verifying if the user has deployed a testnet smart contract).
- **4. Vaults (sBTC Staking):** This is the core protocol! Deposit sBTC to earn yield streams over time. 
- **5. Borrow (Self-Repaying Loans):** Integrated functionality allowing users to overcollateralize their sBTC to borrow synthetic stablecoins (`USDCx`), fully executing testnet and mainnet contract calls via Leather integration.
- **6. Swap (DEX Interface):** A quick swap module specifically meant to trade `sBTC` for `USDCx` on the unified protocol.
- **7. Reputation (X402):** A web3 social gateway where users mint credentials, claim completion bounties via on-chain validation, and aggregate a universal hackathon identity.

## 🏗️ Technical Architecture & Monorepo Structure

Aegis BTC is structured as a monolithic repository grouping all related domains together for maximum development efficiency:

```text
📦 Aegis BTC Monorepo
 ┣ 📂 aegis-btc-frontend  # Next.js 14, TailwindCSS, @stacks/connect, UI/UX
 ┣ 📂 aegis-btc-backend   # Python FastAPI, GenAI integrations (Gemini), Endpoints
 ┗ 📂 aegis-btc-contracts # Clarity Smart Contracts, Clarinet configs
```

## 🚀 Quick Start Guide

### 1. Frontend (Next.js Application)
Ensure you have Node.js 18+ installed.
```bash
cd aegis-btc-frontend
npm install
npm run dev
```
The application will start on `http://localhost:3000`.

### 2. Backend (FastAPI AI Engine)
Ensure you have Python 3.10+ installed.
```bash
cd aegis-btc-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
The FastAPI backend will run on `http://localhost:8000` with interactive docs at `/docs`.

### 3. Smart Contracts (Clarity)
Ensure you have [Clarinet](https://github.com/hirosystems/clarinet) installed.
```bash
cd aegis-btc-contracts
clarinet check
clarinet console
```

## 🔑 Environment Variables
- Ensure you duplicate `.env.example` configurations in both your frontend and backend.
- The backend requires a valid `GEMINI_API_KEY` to hook into the AI generation layer. If one is not provided, the backend falls back to a smart local agent cache of contract templates.

## 🌐 Deployed Smart Contract details

- **Mainnet Deployer / Protocol ID:** `SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT.aegis-unified-protocol`
- Assets Integrated: `aegis-sbtc` (8 decimals), `aegis-usdcx` (6 decimals).

## 🛡️ Hackathon Notice
This protocol was built specifically for **BUIDL BATTLE #2**. Enjoy assessing the AI Contract functionality combined with native Stacks Testnet/Mainnet workflows!
