from fastapi.testclient import TestClient
from index import app

client = TestClient(app)

def test_predict_valid_input():
    # Valid input test
    response = client.post("/predict", json={
        "feature1": 50.0,
        "feature2": 60.0,
        "feature3": 70.0,
        "feature4": 80.0,
        "feature5": 90.0
    })
    assert response.status_code == 200
    assert "prediction" in response.json()
    assert response.json()["prediction"] in [0, 1, 2]  # Assuming the model outputs 0, 1, or 2

def test_predict_invalid_input():
    # Invalid input test (out of range)
    response = client.post("/predict", json={
        "feature1": -10.0,
        "feature2": 60.0,
        "feature3": 70.0,
        "feature4": 80.0,
        "feature5": 90.0
    })
    assert response.status_code == 200
    assert response.json() == {"error": "Features must be between 0 and 100"}

def test_predict_missing_feature():
    # Missing feature test
    response = client.post("/predict", json={
        "feature1": 50.0,
        "feature2": 60.0,
        "feature3": 70.0,
        "feature4": 80.0
        # feature5 is missing
    })
    assert response.status_code == 422  # Unprocessable Entity