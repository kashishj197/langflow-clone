
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from executor import execute_flow

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run")
async def run_flow(request: Request):
    data = await request.json()
    result = execute_flow(data)
    return {"output": result}
