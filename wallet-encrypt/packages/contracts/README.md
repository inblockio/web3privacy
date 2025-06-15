# 📦 Contracts Package

Smart contract package using **Hardhat**, **TypeScript**, and **Hardhat Ignition** for managing on-chain interactions, deployment, and verification.

---

## 🚀 Stack Overview

- [Hardhat](https://hardhat.org) with TypeScript
- [Hardhat Ignition](https://hardhat.org/ignition) for structured deployments
- Solidity for Smart Contracts

---

## 🔧 Installation

Please follow the setup steps in the [monorepo root README](../../README.md).

---

## 🧪 Running Tests

```bash
yarn test
```

Runs the Hardhat test suite under `test/`.

---

## ⚙️ Compile Contracts

```bash
yarn compile
```

Compiles the Solidity contracts using Hardhat and generates TypeChain bindings.

---

## 🧪 Local Setup

Before working with deployments or the testnet, create a `.env` file (use `.env.example` as a reference) and configure RPC URLs and secrets.  
If you need Firebase credentials or private keys, ask a team member.

---

## 🔐 Deployer Setup

You can deploy using either:
- a `mnemonic.txt` file (`packages/contracts/mnemonic.txt`)
- or a `.env` file with `PRIVATE_KEY` or `MNEMONIC`

Generate a new mnemonic (optional):

```bash
yarn generate
```

Check the current deployer address and balance:

```bash
yarn account
```

---

## 🚀 Deploy to Sepolia via Hardhat Ignition

Deploy the `RSAPublicKeyStorage` contract using the `testDeployment` module:

```bash
npx hardhat ignition deploy ./ignition/modules/testDeployment.ts --network sepolia
```

---

## ✅ Verify on Etherscan

After deployment, verify the contract on Sepolia (or other supported networks):

```bash
npx hardhat verify --network sepolia <contract-address>
```

---

## 🔗 Faucet Links

- [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)


---

## 🧠 Tip

This project supports both `PRIVATE_KEY` and `MNEMONIC`-based deployments via `.env` or `mnemonic.txt`, with flexible gas settings per network.
