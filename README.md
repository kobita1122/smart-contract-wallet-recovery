# Smart Contract Wallet (Social Recovery)

![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)
![Security](https://img.shields.io/badge/feature-recovery-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

**Smart Contract Wallet** treats your account as code, not just a key pair. This allows for advanced logic:
1.  **Social Recovery**: If you lose your key, 3 out of 5 "Guardians" can vote to replace the owner key.
2.  **Daily Limits**: Even if your key is stolen, the attacker can only withdraw a limited amount per 24 hours.

## Architecture

* **Owner**: The hot wallet that signs day-to-day transactions.
* **Guardians**: A list of addresses that can only perform recovery operations.
* **Vault**: The contract holding the funds.

## Usage

```bash
# 1. Install
npm install

# 2. Deploy Wallet Factory & Create Wallet
npx hardhat run deploy.js --network localhost

# 3. Setup Guardians (Friends/Family)
node add_guardians.js

# 4. Make a Transfer (Under daily limit)
node transfer.js

# 5. Simulate Hack/Loss & Recover Account
node execute_recovery.js
