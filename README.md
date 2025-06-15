# [Encrypt it!]

- **Track:** Applied Encryption, Public Goods
- **Team/Contributors:** Timotheus, six, MarcelJay, James, Mörk, David, Florian
- **Repository:** [[Link to your code repos]](https://github.com/inblockio/web3privacy/)
- **Demo:** [[Link to live demo, video, or screenshots]](https://pgp.gen6.app/)

## Description (TL;DR)
Where is the secure encryption/decryption functionality in the Ethereum ecosystem? We explored why the function was deprecated from MetaMask, what are current limitations in Ethereum wallets and why applications build their own solutions and handle encryption/decryption functions within the application instead of the secure domain of the wallet.
The need for secure, wallet based encryption key handling became painfully obvios and how its currently not possible with existing ethereum wallets. We explored an approach for encryption and decryption with wallets and documented it.

We built a prototype which uses a web3 first approach with a separate encryption key and an on-chain secure public key registry mapping encryption keys to wallets.

## Problem
Lack of Standardized Encryption and Decryption in Ethereum Wallets Ethereum wallets (e.g., MetaMask) lack a standardized API for encrypting/decrypting data using a user’s private key, leading to significant challenges:

Custom Implementations Required: Applications must build their own encryption/decryption solutions, often involving:
Direct use of Ethereum private keys outside the wallet’s secure environment.
Generating and managing separate keys within the application.
Increased risk of security vulnerabilities due to non-standardized approaches.
Limited ability to keep user data private within application contexts, reducing security.
Security Risks: Inconsistent or weak encryption methods implemented by developers increase the risk of exploits.
Interoperability Issues: Data encrypted by one application may not be decryptable by another due to differing encryption techniques, hindering seamless data sharing in the Ethereum ecosystem.

## Solution
Implement Ethereum standards to support secure key handling within the enclave of the wallets.
Introduce a default API for ethers.encryption & ethers.decryption again which has a new logic which handles symmetric key encryption and decryption against ethereum wallets.
Ethereum wallets register their asymmetric keys within the ethereum network (e.g. polygon for costs reasons) as secure and verifiable public-key registries making a diffy hellman key-exchange obsolete.

## Technology Stack
- Solidity smart contract for key registry
- OpenPGPJS for encrytion
- Node.js for serving the FE and demo upload/download (could be IPFS, etc)

## Privacy Impact
We enable encryption in the Ethereum ecosystem for all its users.

## Real-World Use Cases
- Secure file sharing in the Ethereum ecosystem
- PGP for Web3
- Self-sovereign password manager
- Hiding data from AI
- Many more where encryption is needed

## Business Logic
- Semi-Low cost implementation with huge impact
- Masses can start using encryption
- Increases gas usage and provides service fees for storage providers
- MetaMask, Infura and others are already monetizing these! But would be better to not feed them too much :)
- Can we monetize the implementation if we want to? Yes, we can commercially offer it for many things such as encrypted document signing.

## What's Next
- Build prod implementation
- Find support - join us!
- Propose standardization: EIP / WIP’
- Build trust
- Adoption through the ref impls
