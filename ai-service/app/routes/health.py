from fastapi import APIRouter
import json, os

router = APIRouter()

@router.get("/health")
def health():
    metrics = {}
    metrics_path = "app/model/metrics.json"
    if os.path.exists(metrics_path):
        with open(metrics_path) as f:
            metrics = json.load(f)
    return {
        "status": "healthy",
        "model": "Random Forest",
        "accuracy": metrics.get("accuracy", "N/A"),
        "trained_samples": metrics.get("n_samples", "N/A")
    }