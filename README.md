# Shamir's Secret Sharing (SSS) Library

[![GitHub license](https://img.shields.io/github/license/shovon/sss)](https://github.com/shovon/sss/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/shovon/sss)](https://github.com/shovon/sss/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/shovon/sss)](https://github.com/shovon/sss/pulls)

A TypeScript implementation of Shamir's Secret Sharing scheme that allows secure splitting and reconstruction of secrets using finite field arithmetic.

## Overview

Shamir's Secret Sharing is a cryptographic algorithm that enables splitting a secret into multiple shares, where:

- A configurable threshold number of shares is required to reconstruct the secret
- Having fewer shares than the threshold reveals no information about the secret
- The shares can be distributed among different parties

This implementation works in finite fields to provide information-theoretic security.

# Usage

```typescript
import { createShares, reconstruct } from "shamsecsha";

// The modulus defines the finite field - using a Mersenne prime
const modulus = 2n ** 127n - 1n;

// Split a secret into 5 shares, requiring 3 to reconstruct
const secret = 42n; // The secret must be a BigInt
const shares = createShares(secret, { threshold: 3, totalShares: 5 }, modulus);

// Shares can be distributed to different parties
// Each share is a tuple of [x, y] coordinates as BigInts

// Later, reconstruct with any 3 or more shares
const reconstructedSecret = reconstruct(shares.slice(0, 3), modulus);
console.log(reconstructedSecret === secret); // true

// Using fewer than 3 shares will not work
const tooFewShares = shares.slice(0, 2);
// This will not reveal the secret
console.log(reconstruct(tooFewShares, modulus));
```
