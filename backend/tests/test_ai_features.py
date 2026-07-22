import pytest
from test_vehicles import get_admin_headers

def test_price_insights_calculation(client):
    admin_headers = get_admin_headers(client)

    # Seed vehicles in 'Electric' category with known prices
    v1 = {"make": "BrandA", "model": "Model 1", "category": "Electric", "price": 1000000.0, "quantity": 2}
    v2 = {"make": "BrandB", "model": "Model 2", "category": "Electric", "price": 2000000.0, "quantity": 2}
    v3 = {"make": "BrandC", "model": "Model 3", "category": "Electric", "price": 3000000.0, "quantity": 2}

    id1 = client.post("/api/vehicles", json=v1, headers=admin_headers).json()["id"]
    id2 = client.post("/api/vehicles", json=v2, headers=admin_headers).json()["id"]
    id3 = client.post("/api/vehicles", json=v3, headers=admin_headers).json()["id"]

    # Fetch after all 3 exist in DB
    # Category Average = (1M + 2M + 3M) / 3 = 2,000,000
    # Good Value <= 1.7M, Premium >= 2.3M, Average in-between
    r1 = client.get(f"/api/vehicles/{id1}").json()
    r2 = client.get(f"/api/vehicles/{id2}").json()
    r3 = client.get(f"/api/vehicles/{id3}").json()

    assert r1["price_insight"] == "Good Value"
    assert r2["price_insight"] == "Average"
    assert r3["price_insight"] == "Premium"


def test_ai_smart_search_natural_language(client):
    admin_headers = get_admin_headers(client)

    s1 = {"make": "Tata", "model": "Nexon EV", "category": "SUV", "price": 1500000.0, "quantity": 5}
    s2 = {"make": "BMW", "model": "X5", "category": "SUV", "price": 9500000.0, "quantity": 2}
    client.post("/api/vehicles", json=s1, headers=admin_headers)
    client.post("/api/vehicles", json=s2, headers=admin_headers)

    # Query: "SUV under 20 lakh"
    res = client.get("/api/vehicles/smart-search?query=SUV under 20 lakh")
    assert res.status_code == 200
    data = res.json()
    assert "SUV" in data["parsed_filters"]
    assert data["total_results"] >= 1
    # Should contain Tata Nexon EV (15 lakh) but not BMW X5 (95 lakh)
    makes = [v["make"] for v in data["vehicles"]]
    assert "Tata" in makes
    assert "BMW" not in makes


def test_vehicle_recommendations(client):
    admin_headers = get_admin_headers(client)

    # Create target vehicle and recommendations in 'Sports'
    v_target = {"make": "Porsche", "model": "718 Cayman", "category": "Sports", "price": 8000000.0, "quantity": 3}
    v_rec1 = {"make": "Porsche", "model": "911 GT3", "category": "Sports", "price": 8500000.0, "quantity": 2}
    v_rec2 = {"make": "Ferrari", "model": "Roma", "category": "Sports", "price": 9000000.0, "quantity": 1}

    res_t = client.post("/api/vehicles", json=v_target, headers=admin_headers)
    target_id = res_t.json()["id"]

    client.post("/api/vehicles", json=v_rec1, headers=admin_headers)
    client.post("/api/vehicles", json=v_rec2, headers=admin_headers)

    rec_res = client.get(f"/api/vehicles/{target_id}/recommendations?limit=2")
    assert rec_res.status_code == 200
    recs = rec_res.json()
    assert len(recs) <= 2
    # Ensure target vehicle itself is excluded from recommendations
    assert all(r["id"] != target_id for r in recs)
