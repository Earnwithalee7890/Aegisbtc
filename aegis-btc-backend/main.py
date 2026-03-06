from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AegisBTC AI Risk Analyzer API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractAnalysisRequest(BaseModel):
    contract_code: str
    amount_at_risk_sbtc: float

class GenerateRequest(BaseModel):
    prompt: str
    api_key: str | None = None

class GenerateResponse(BaseModel):
    code: str

class AnalysisResponse(BaseModel):
    risk_score: int
    summary: str
    vulnerability_details: list[str]

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_contract(request: ContractAnalysisRequest):
    # In a production scenario, we would use an LLM or static analyzer tool to parse `request.contract_code`
    # Here we mock out the smart analysis based on a few keywords for demo purposes.
    
    code_lower = request.contract_code.lower()
    score = 95
    vulnerabilities = []
    
    if "tx-sender" not in code_lower and "contract-caller" not in code_lower:
        score -= 20
        vulnerabilities.append("Missing caller validation check. Anyone might be able to invoke sensitive functions.")
        
    if "unwrap-panic" in code_lower:
        score -= 10
        vulnerabilities.append("Use of `unwrap-panic` detected. This could cause the contract to abort unexpectedly. Consider `unwrap!` with a custom error code.")
        
    if "sbtc" not in code_lower:
        score -= 10
        vulnerabilities.append("Warning: the contract does not seem to explicitly reference sBTC logic, verify integration.")
        
    if score > 85:
        summary = "Contract appears generally safe, though a full manual audit is always recommended."
    elif score > 65:
        summary = "Moderate risks detected. Exercise caution and review the vulnerability details."
    else:
        summary = "High risk! Critical vulnerabilities detected. Do not deposit funds."
        
    return AnalysisResponse(
        risk_score=score,
        summary=summary,
        vulnerability_details=vulnerabilities
    )

from local_agent import LocalAegisAgent

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_contract(request: GenerateRequest):
    # Use user-provided key, or fallback to environment key
    api_key = request.api_key if request.api_key else os.getenv("GEMINI_API_KEY")
    
    # Define our robust Local "Offline" Agent
    local_agent = LocalAegisAgent()
    
    if not api_key or api_key == "your_gemini_api_key_here":
        print("Using Local Aegis Agent Fallback (No distinct Gemini API Key provided)")
        code = local_agent.generate_contract(request.prompt)
        # Prepend a warning so the user knows why it's a template
        warning_header = ";; WARNING: No Gemini API Key provided. \n;; Using offline template fallback. To generate ANY custom contract, provide an API key in the UI.\n\n"
        return GenerateResponse(code=warning_header + code)
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        system_prompt = "You are an expert Stacks blockchain developer. Write ONLY valid Clarity smart contract code based on the user's prompt. Do not include markdown formatting or explanations. Start the code directly. Ensure the contract fulfills their exact request."
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=system_prompt + "\n\nUser request: " + request.prompt,
        )
        
        # Clean up any markdown blocks if they get returned
        code = response.text.strip()
        if code.startswith("```clarity"):
            code = code[10:]
        elif code.startswith("```"):
            code = code[3:]
        if code.endswith("```"):
            code = code[:-3]
            
        return GenerateResponse(code=code.strip())
    except Exception as e:
        print(f"Gemini API Error, falling back to local agent: {e}")
        code = local_agent.generate_contract(request.prompt)
        warning_header = f";; WARN: AI Generator failed ({e}).\n;; Using offline template fallback.\n\n"
        return GenerateResponse(code=warning_header + code)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/developers/status")
async def developer_status():
    return {
        "documentation": {"status": "Online", "version": "v2.1.0"},
        "clarity_contracts": {"status": "Audited", "count": 14},
        "python_api": {"status": "Operational", "uptime": "99.99%"},
        "stacks_js": {"status": "Stable", "version": "v1.2"}
    }

@app.get("/api/sbtc/stats")
async def sbtc_stats():
    return {
        "tvl": "$14,520,000",
        "total_minters": 1245,
        "active_yield_strategies": 5,
        "apy_average": "8.5%",
        "innovations": [
            {"title": "Zero-Loss Payroll", "desc": "Paying contributors via daily drip yield.", "status": "Live"},
            {"title": "Self-Repaying Loans", "desc": "Borrowing against sBTC collateral.", "status": "Live"}
        ]
    }

@app.get("/api/usdcx/pools")
async def usdcx_pools():
    return [
        {"pair": "sBTC/USDCx", "liquidity": "$5.2M", "apr": "12.4%", "volume_24h": "$850K"},
        {"pair": "STX/USDCx", "liquidity": "$2.8M", "apr": "18.1%", "volume_24h": "$420K"},
        {"pair": "ALEX/USDCx", "liquidity": "$1.1M", "apr": "24.5%", "volume_24h": "$150K"}
    ]

@app.get("/api/x402/modules")
async def x402_modules():
    return {
        "standard_version": "v1.0-RC",
        "description": "Next-gen authentication and verifiable compute standard on Stacks.",
        "modules": [
            {"id": "mod_1", "name": "Basic Token Standards", "completed": False, "reward": 100},
            {"id": "mod_2", "name": "ZK State Verification", "completed": False, "reward": 250},
            {"id": "mod_3", "name": "x402 Full Integration", "completed": False, "reward": 500}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
