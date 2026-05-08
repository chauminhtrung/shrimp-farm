from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np
import os

router = APIRouter()

# Load model + scaler khi khởi động
MODEL_PATH  = "app/model/model.pkl"
SCALER_PATH = "app/model/scaler.pkl"

model  = None
scaler = None

def load_model():
    global model, scaler
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler not found: {SCALER_PATH}")
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    print("Model loaded successfully")

# Load ngay khi import
try:
    load_model()
except Exception as e:
    print(f"Warning: {e}")

# Schema request — phải khớp với Java PredictRequest
class PredictRequest(BaseModel):
    pond_id:     int
    ph:          float
    temperature: float
    oxygen:      float
    turbidity:   float = 2.0  # default nếu không có

# Schema response — phải khớp với Java PredictionResult
class PredictResponse(BaseModel):
    risk_level:      str   # "LOW" / "MEDIUM" / "HIGH"
    risk_percent:    int   # 0–100
    recommendation:  str

RISK_LABELS = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}

RECOMMENDATIONS = {
    "LOW":    "Moi truong ao on dinh. Khong can can thiep them.",
    "MEDIUM": "Canh bao: Theo doi chat chi so nuoc. Chuan bi xu ly neu tiep tuc xau di.",
    "HIGH":   "Nguy hiem cao: Kiem tra ngay oxy va pH. Bat quat oxy, xu ly voi CaCO3 neu pH cao."
}

@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if model is None or scaler is None:
        raise HTTPException(
            status_code=503,
            detail="Model chua san sang. Vui long train model truoc."
        )

    # Chuẩn bị features
    features = np.array([[
        req.temperature,
        req.ph,
        req.oxygen,
        req.turbidity
    ]])

    # Scale + predict
    features_scaled = scaler.transform(features)
    prediction      = model.predict(features_scaled)[0]
    probabilities   = model.predict_proba(features_scaled)[0]

    risk_label   = RISK_LABELS[prediction]
    risk_percent = int(max(probabilities) * 100)

    return PredictResponse(
        risk_level     = risk_label,
        risk_percent   = risk_percent,
        recommendation = RECOMMENDATIONS[risk_label]
    )

@router.get("/predict/info")
def model_info():
    """Thông tin model — dùng để debug"""
    if model is None:
        return {"status": "model not loaded"}
    return {
        "model_type":   type(model).__name__,
        "n_estimators": model.n_estimators,
        "classes":      list(RISK_LABELS.values()),
        "features":     ["temperature", "ph", "oxygen", "turbidity"]
    }