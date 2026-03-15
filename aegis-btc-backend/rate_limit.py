from fastapi import FastAPI, Request, HTTPException
from time import time

request_counts = {}
RATE_LIMIT_WINDOW = 60 # seconds
RATE_LIMIT_MAX_REQUESTS = 10 

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    now = time()
    
    if client_ip not in request_counts:
        request_counts[client_ip] = {"count": 1, "start_time": now}
    else:
        record = request_counts[client_ip]
        if now - record["start_time"] > RATE_LIMIT_WINDOW:
            record["count"] = 1
            record["start_time"] = now
        else:
            if record["count"] >= RATE_LIMIT_MAX_REQUESTS:
                return HTTPException(status_code=429, detail="Rate limit exceeded")
            record["count"] += 1
            
    response = await call_next(request)
    return response
