"""
Smart AgroConnect — ML Prediction Service
==========================================
Dummy predictor that returns heuristic-based results.
Replace with a real trained model loaded from disk.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import numpy as np

app = FastAPI(
    title="AgroConnect ML Service",
    version="1.0.0",
    description="Crop recommendation & price prediction API",
)


# ── Input schemas ──────────────────────────────────────────

class CropInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class PriceInput(BaseModel):
    crop: str
    market: Optional[str] = "default"
    month: Optional[int] = 1


# ── Heuristic lookup tables ────────────────────────────────

CROP_RULES = {
    "rice": {"temp": (20, 35), "humidity": (70, 95), "rainfall": (150, 300), "ph": (5.0, 7.0)},
    "wheat": {"temp": (15, 25), "humidity": (40, 70), "rainfall": (50, 150), "ph": (5.5, 7.5)},
    "maize": {"temp": (18, 30), "humidity": (50, 80), "rainfall": (60, 200), "ph": (5.5, 7.0)},
    "cotton": {"temp": (25, 38), "humidity": (40, 65), "rainfall": (50, 100), "ph": (6.0, 8.0)},
    "sugarcane": {"temp": (25, 38), "humidity": (70, 90), "rainfall": (150, 250), "ph": (5.0, 8.0)},
    "groundnut": {"temp": (22, 32), "humidity": (40, 65), "rainfall": (40, 120), "ph": (5.5, 7.5)},
    "millet": {"temp": (25, 38), "humidity": (30, 60), "rainfall": (30, 80), "ph": (5.5, 8.0)},
    "barley": {"temp": (12, 22), "humidity": (40, 65), "rainfall": (40, 100), "ph": (6.0, 8.0)},
    "pulses": {"temp": (20, 30), "humidity": (40, 70), "rainfall": (40, 100), "ph": (6.0, 7.5)},
    "potato": {"temp": (15, 25), "humidity": (60, 80), "rainfall": (50, 150), "ph": (4.5, 6.5)},
}

BASE_PRICES = {
    "rice": 2050,
    "wheat": 2275,
    "maize": 1880,
    "cotton": 6200,
    "sugarcane": 350,
    "groundnut": 5800,
    "millet": 2400,
    "barley": 1900,
    "pulses": 5500,
    "potato": 1200,
}


# ── Heuristic scorer ──────────────────────────────────────

def score_crop(crop: str, inp: CropInput) -> float:
    """Return 0-1 suitability score based on simple range matching."""
    rules = CROP_RULES.get(crop)
    if not rules:
        return 0.0

    scores = []
    for key, (lo, hi) in rules.items():
        val = getattr(inp, key, None)
        if val is None:
            scores.append(0.5)
            continue
        if lo <= val <= hi:
            center = (lo + hi) / 2
            spread = (hi - lo) / 2
            dist = abs(val - center) / spread if spread else 0
            scores.append(1.0 - 0.3 * dist)
        else:
            dist = min(abs(val - lo), abs(val - hi))
            scores.append(max(0, 1.0 - 0.1 * dist))

    npk_total = inp.nitrogen + inp.phosphorus + inp.potassium
    if 40 <= npk_total <= 200:
        scores.append(0.8)
    else:
        scores.append(0.3)

    return round(float(np.mean(scores)), 4)


# ── Endpoints ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict/crop")
def predict_crop(inp: CropInput):
    """Return ranked crop recommendations with suitability scores."""
    results = []
    for crop in CROP_RULES:
        sc = score_crop(crop, inp)
        results.append({"crop": crop, "score": sc})

    results.sort(key=lambda x: x["score"], reverse=True)
    top = results[:5]

    return {
        "input": inp.model_dump(),
        "recommendations": top,
        "best": top[0]["crop"] if top else None,
        "model": "heuristic-v1",
    }


@app.post("/predict/price")
def predict_price(inp: PriceInput):
    """Return dummy price prediction with seasonal variation."""
    base = BASE_PRICES.get(inp.crop.lower(), 2000)

    seasonal = 1.0 + 0.15 * np.sin(2 * np.pi * (inp.month - 3) / 12)
    market_factor = 0.95 if inp.market == "local" else 1.05

    predicted = round(base * seasonal * market_factor, 2)

    return {
        "crop": inp.crop,
        "market": inp.market,
        "month": inp.month,
        "predicted_price_per_quintal": predicted,
        "currency": "INR",
        "confidence_low": round(predicted * 0.85, 2),
        "confidence_high": round(predicted * 1.15, 2),
        "model": "heuristic-price-v1",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
