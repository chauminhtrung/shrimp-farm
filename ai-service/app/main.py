from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.health import router as health_router

app = FastAPI(
    title="AquaMonitor AI Service",
    description="AI prediction for shrimp pond water quality",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(health_router)

@app.get("/")
def root():
    return {
        "service": "AquaMonitor AI",
        "status": "running",
        "version": "1.0.0"
    }