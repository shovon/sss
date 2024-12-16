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

## Installation
