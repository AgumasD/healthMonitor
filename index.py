from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib

# Load the model
model = joblib.load("DT_Algorithm.joblib")

# Create app
app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # Replace with your frontend's URL
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],  # Allow specific methods
    allow_headers=["Content-Type", "Authorization"],  # Allow specific headers
)

# Input data model
class InputData(BaseModel):
    feature1: float
    feature2: float
    feature3: float
    feature4: float
    feature5: float  # Add the missing feature

# Prediction endpoint
@app.post("/predict")
def predict(data: InputData):
    if not all(0 <= feature <= 100 for feature in [data.feature1, data.feature2, data.feature3, data.feature4, data.feature5]):
        return {"error": "Features must be between 0 and 100"}
    input_array = np.array([[data.feature1, data.feature2, data.feature3, data.feature4, data.feature5]])
    prediction = model.predict(input_array)
    return {"prediction": int(prediction[0])}
