# Concept: Wallet Encryption/Decryption
- DRAFT -

![image](images/concept.png)

## The Ethereum encryption API facilitates secure data encryption/decryption using a symmetric key managed within an Ethereum wallet. It includes three APIs:
1.  Request Symmetric Key API:
 •  Generates a symmetric key inside the wallet.
 •  Returns the key for external data encryption/decryption.
 •  Stores the key securely in the wallet.
2.  Encrypt Symmetric Key API:
 •  Input: List of Ethereum wallet addresses.
 •  Recovers public keys from on-chain signed transactions.
 •  Encrypts the requested symmetric key with each public key.
 •  Output:
  •  Success: “o.k.” with ciphers for each address.
  •  Failure: “Operation failed” if public key recovery fails.
 •  Constraint: Only encrypts keys requested via the Request Symmetric Key API.
3.  Decrypt Symmetric Key API:
 •  Input: Cipher (encrypted symmetric key).
 •  Decrypts using the wallet’s private key.
 •  Returns the plaintext symmetric key.
Constrains for decryption API:
Cipher validation before decryption
Type and length validation for output symmetric key

**Key Usage:**
•  The same Ethereum key pair handles transaction signing and encryption/decryption.
•  Self-encryption uses the user’s public key; encryption for others uses their on-chain recovered public key.

#### Why Generate and Encrypt Within the Wallet Context?
Wallet Requirements: A random number generator (for multiple purposes), preferably exposed via a function (e.g., ethers.getRandom).

Generate Symmetric Key Within the Wallet Context
Requires a new method:

Request a symmetric key for file encryption.
Benefit: Ensures high-quality randomness and allows control of the random key generator within a trusted context.

Eliminates the need to load a crypto library in the application context.

This reduces dependencies and enhances security by keeping cryptographic operations within the wallet.

**Diffie-Hellman:** Purpose is to ensure both parties can securely exchange keys and establish trust.
Question: We do kinda Diffie-Hellman when using an Ethereum transaction to associate a public key via a smart contract?
Reason: The public key for encryption is signed by an Ethereum transaction.
Strength: Authenticity is implicit.
The data is verifiable (the public key can be signed by an Ethereum wallet before being published). This is implicit because the transaction, including the public key, is written to the smart contract.
Key Exchange: On-chain.
Alternative: Sign the key with an Ethereum wallet via a secure, private channel.
Shortcoming: Liveness check: When was the last proof that the key holder still controls the key?

Additional considerations:
- key generation should happen within the snap with additional user provided entropy
- alternative is to load the key into the snap

Perspectivly:
It should lead to a standardisation.
