import pytest

def get_admin_headers(client):
    # Register and login admin
    admin_reg = {
        "name": "Admin User",
        "email": "admin_test@dealership.com",
        "password": "adminpassword",
        "role": "admin"
    }
    client.post("/api/auth/register", json=admin_reg)
    res = client.post("/api/auth/login", json={"email": "admin_test@dealership.com", "password": "adminpassword"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def get_user_headers(client):
    # Register and login standard user
    user_reg = {
        "name": "Standard User",
        "email": "user_test@dealership.com",
        "password": "userpassword",
        "role": "user"
    }
    client.post("/api/auth/register", json=user_reg)
    res = client.post("/api/auth/login", json={"email": "user_test@dealership.com", "password": "userpassword"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_add_vehicle_admin_success(client):
    headers = get_admin_headers(client)
    payload = {
        "make": "Porsche",
        "model": "911 Carrera",
        "category": "Sports",
        "price": 120000.0,
        "quantity": 3,
        "image_url": "https://example.com/porsche.jpg"
    }
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Porsche"
    assert data["model"] == "911 Carrera"
    assert data["quantity"] == 3


def test_add_vehicle_user_forbidden(client):
    headers = get_user_headers(client)
    payload = {
        "make": "Ferrari",
        "model": "F8",
        "category": "Sports",
        "price": 280000.0,
        "quantity": 1
    }
    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 403


def test_list_and_search_vehicles(client):
    admin_headers = get_admin_headers(client)
    v1 = {"make": "Tesla", "model": "Model 3", "category": "Electric", "price": 40000.0, "quantity": 5}
    v2 = {"make": "Ford", "model": "Mustang GT", "category": "Sports", "price": 55000.0, "quantity": 2}
    client.post("/api/vehicles", json=v1, headers=admin_headers)
    client.post("/api/vehicles", json=v2, headers=admin_headers)

    # Test list all
    res_list = client.get("/api/vehicles")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 2

    # Test search by category
    res_search = client.get("/api/vehicles/search?category=Electric")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert len(search_data) == 1
    assert search_data[0]["make"] == "Tesla"

    # Test search by price range
    res_price = client.get("/api/vehicles/search?min_price=50000")
    assert res_price.status_code == 200
    price_data = res_price.json()
    assert all(v["price"] >= 50000 for v in price_data)


def test_update_vehicle_success(client):
    admin_headers = get_admin_headers(client)
    payload = {"make": "Audi", "model": "A4", "category": "Sedan", "price": 42000.0, "quantity": 4}
    res = client.post("/api/vehicles", json=payload, headers=admin_headers)
    vehicle_id = res.json()["id"]

    update_payload = {"price": 45000.0, "quantity": 10}
    res_update = client.put(f"/api/vehicles/{vehicle_id}", json=update_payload, headers=admin_headers)
    assert res_update.status_code == 200
    data = res_update.json()
    assert data["price"] == 45000.0
    assert data["quantity"] == 10
    assert data["make"] == "Audi"


def test_delete_vehicle_success(client):
    admin_headers = get_admin_headers(client)
    payload = {"make": "Chevrolet", "model": "Camaro", "category": "Sports", "price": 38000.0, "quantity": 1}
    res = client.post("/api/vehicles", json=payload, headers=admin_headers)
    vehicle_id = res.json()["id"]

    res_del = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert res_del.status_code == 200

    # Verify deleted
    res_get = client.get(f"/api/vehicles/{vehicle_id}")
    assert res_get.status_code == 404


def test_purchase_vehicle_logic(client):
    admin_headers = get_admin_headers(client)
    user_headers = get_user_headers(client)

    # Create vehicle with quantity 1
    payload = {"make": "Nissan", "model": "GT-R", "category": "Sports", "price": 115000.0, "quantity": 1}
    res = client.post("/api/vehicles", json=payload, headers=admin_headers)
    vehicle_id = res.json()["id"]

    # First purchase -> quantity becomes 0
    res_p1 = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
    assert res_p1.status_code == 200
    assert res_p1.json()["quantity"] == 0

    # Second purchase attempt -> should fail with 400 Out of Stock
    res_p2 = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
    assert res_p2.status_code == 400
    assert "out of stock" in res_p2.json()["detail"].lower()


def test_restock_vehicle_admin(client):
    admin_headers = get_admin_headers(client)

    # Create vehicle with 0 quantity
    payload = {"make": "Lexus", "model": "LFA", "category": "Luxury", "price": 375000.0, "quantity": 0}
    res = client.post("/api/vehicles", json=payload, headers=admin_headers)
    vehicle_id = res.json()["id"]

    # Restock by 5
    res_restock = client.post(f"/api/vehicles/{vehicle_id}/restock", json={"quantity": 5}, headers=admin_headers)
    assert res_restock.status_code == 200
    assert res_restock.json()["quantity"] == 5
