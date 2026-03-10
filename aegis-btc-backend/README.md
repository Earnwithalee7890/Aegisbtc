# AegisBTC Backend

FastAPI backend that uses Python and AI/Static Analysis to provide risk scoring for Stacks smart contracts.

## Setup
1. `python -m venv venv`
2. `source venv/bin/activate` or `.\venv\Scripts\activate` on Windows
3. `pip install -r requirements.txt`
4. `python main.py`

## Features
- **Contract Risk Analysis:** Give it a Clarity smart contract and amount at risk, returns a risk score 0-100 indicating safety.
