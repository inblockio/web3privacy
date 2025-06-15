# Encrypt IT!
Collab git, to have a shared resource. Including proposal for EIP and and the Hack.MD. Idea to contemplate: PGP for/with Web3.

## Submission
- **Track:** Applied Encryption
- **Team/Contributors:**

@David hacker

@Six hacker and business developer

@Mörk cryptography, development

@Flo - Developer and DevOp

@Timotheus architecture and vision

@positonic (James) - hacker

- **Repository:** [Link to your code repository]
- **Demo:** [Link to live demo, video, or screenshots]

##### Monorepo instructions
```
git clone
cd wallet-encrypt
yarn install
```

This should install the four packages:

* `express` privdes backend functionality to mimic decentralised file storag (our demo is a proof of conecpt and we didn't have time to implement d storage)
* `site` is a React frontend - running `yarn start` from the `wallet-encrypt` folder will run this package's start script and serve the react on [localhost:8000](localhost:8000).

You also have the opportuniy to `cd site` and `yarn build`. The express erver will then serve the React on  [localhost:3000](localhost:3000) instead.
Hopefully we will deploy this version by sumbission time.
* `snap` runs a port for a Metamaks snap which holds the secret keys. The React frontend interatcs with the snap through the snap's JSON-RPC on port 8080.
* `contracts` contains the publick key registration contract deployment code. See that packages [README](./wallet-encrypt/contracts/README).

The three servers will run when you run `yarn install` from the `wallet-encrypt` repo.

##### HTML frontend instructions:
`cd 1_working_demo`, follow the install instructions in that folder's [README](./1_working_demo/README), including running the express server.
This will run the basic `index.html` monolith of our frontend.

## Description (TL;DR)
Where is the secure encryption/decryption functionality with Ethereum wallets?
We explored why the function was deprecated from MetaMask, what are current limitations in Ethereum wallets and why applications build their own solutions and handle encryption/decryption functions within the application instead of the secure domain of the wallet.

The need for secure, wallet based encryption key handling became painfully obvios and how its currently not possible with existing ethereum wallets.
We explored an approach for encryption and decryption with wallets and documented it.

We build a prototype which uses a local first approach with a separate encryption key and an on-chain secure public key registry mapping encryption keys to wallets.

## Problem
**Lack of Standardized Encryption and Decryption in Ethereum Wallets**
Ethereum wallets (e.g., MetaMask) lack a standardized API for encrypting/decrypting data using a user’s private key, leading to significant challenges:
- **Custom Implementations Required**: Applications must build their own encryption/decryption solutions, often involving:
  - Direct use of Ethereum private keys outside the wallet’s secure environment.
  - Generating and managing separate keys within the application.
  - Increased risk of security vulnerabilities due to non-standardized approaches.
  - Limited ability to keep user data private within application contexts, reducing security.
- **Security Risks**: Inconsistent or weak encryption methods implemented by developers increase the risk of exploits.
- **Interoperability Issues**: Data encrypted by one application may not be decryptable by another due to differing encryption techniques, hindering seamless data sharing in the Ethereum ecosystem.

## Solution
Upgrade Ethereum wallet standards to support
secure key handling within the enclave of the wallets.

Introduce a default API for ethers.encryption & ethers.decryption
again which has a new logic which handles symmetric key encryption and decryption
against ethereum wallets.

Ethereum wallets register their asymmetric keys within the ethereum network (e.g. polygon for costs reasons)
as secure and verifiable public-key registries making a diffy hellman key-exchange obsolete.

## Technology Stack
- Node.js
- Snaps (Metamask, optional)
- RSA encrytion
- SoliditySmart contract for key registry.

## Privacy Impact
TBA

## Real-World Use Cases
[Who would use this and how?]

## Business Logic
[Sustainability/monetization considerations]

## What's Next
[Future development plans]
