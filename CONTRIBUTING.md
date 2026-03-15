# Contributing to Aegis BTC

First off, thank you for considering contributing to Aegis BTC! 🛡️

## Workflow

1. Fork the repo and create your branch from `main`.
2. Ensure you have the required dependencies:
   - Node 18+ for the frontend
   - Python 3.10+ for the backend
   - Clarinet for smart contracts
3. Make your changes and test them locally.
4. Open a Pull Request!

## Local Development Setup

### Frontend
```bash
cd aegis-btc-frontend
npm install
npm run dev
```

### Backend
```bash
cd aegis-btc-backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Code Style
- We use strict TypeScript for the frontend.
- Python backend relies on standard FastAPI standards.
- Clarity contracts must pass `clarinet check`.
