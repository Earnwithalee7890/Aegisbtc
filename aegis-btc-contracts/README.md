# AegisBTC Smart Contracts

This directory contains the Clarity smart contracts powering the Aegis Protocol.

## Architecture

1. **Aegis Vault (`aegis-vault.clar`)**: 
   The core depository for sBTC. Users lock funds here, and the protocol routes it to the highest yielding Strategies.
   Features a streaming extension allowing yield to be redirected to a specified subscripton recipient.

## Usage
- Deploy with `clarinet deploy`
- Test with `clarinet test`
