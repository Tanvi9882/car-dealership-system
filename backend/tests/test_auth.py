import pytest

def test_register_user_success(client):
    payload = {
        "name": "Alice Developer",
        "email": "alice@example.com",
        "password": "securepassword123",
        "role": "user"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert data["name"] == "Alice Developer"
    assert data["role"] == "user"
    assert "id" in data
    assert "password" not in data

def test_register_duplicate_email_fails(client):
    payload = {
        "name": "Bob Builder",
        "email": "bob@example.com",
        "password": "password123",
        "role": "user"
    }
    # First registration
    client.post("/api/auth/register", json=payload)
    # Duplicate registration
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success(client):
    # Register user
    reg_payload = {
        "name": "Charlie Chaplin",
        "email": "charlie@example.com",
        "password": "mypassword123",
        "role": "user"
    }
    client.post("/api/auth/register", json=reg_payload)

    # Login user
    login_payload = {
        "email": "charlie@example.com",
        "password": "mypassword123"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "charlie@example.com"

def test_login_invalid_credentials(client):
    login_payload = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 401
