from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import init_db
from contextlib import asynccontextmanager

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Initialize Database
#     await init_db()
#     yield

from backend.routers import exam

app = FastAPI(title="AI Proctoring System API", version="1.0.0") # , lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exam.router)

@app.get("/")
async def root():
    return {"status": "online", "message": "AI Proctoring System Backend is running"}
