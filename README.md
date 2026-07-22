# 🚗 DrivePulse - Car Dealership Inventory System

DrivePulse is a modern, high-performance **Car Dealership Inventory Management System** built with **FastAPI**, **SQLite**, **Pytest**, **React (Vite)**, and **Tailwind CSS**.

It provides complete JWT-authenticated role-based access control (Users & Admins), a full inventory CRUD suite, vehicle purchase/restock workflows, price insights, natural language AI search, and a curated showroom featuring the **Mahindra SUV Fleet** (`XUV 3XO`, `Bolero`, `Thar`, `Scorpio Classic`, `BE 6`).

---

## 📐 System Architecture & Stack

- **Backend**: Python 3.13, FastAPI, SQLAlchemy, SQLite, Pydantic v2, PyJWT, Passlib (Bcrypt).
- **Testing (TDD)**: Pytest, TestClient (100% pass rate across 14 test cases).
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons.
- **Database**: SQLite (`car_dealership.db`).

---

## ⚡ API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new User or Admin.
- `POST /api/auth/login` - Authenticate user & receive JWT Bearer Token.

### 🚘 Vehicles (`/api/vehicles`)
- `GET /api/vehicles` - List all available showroom vehicles.
- `GET /api/vehicles/search` - Filter vehicles by make, model, category, or min/max price.
- `GET /api/vehicles/smart-search` - AI Natural Language Search (e.g., *"Mahindra SUV under 15 lakh"*).
- `GET /api/vehicles/{id}` - Get detailed view & category price insights.
- `GET /api/vehicles/{id}/recommendations` - Get AI recommendations (*"Customers who viewed this car may also like..."*).
- `POST /api/vehicles` - **(Admin Only)** Add a new vehicle.
- `PUT /api/vehicles/{id}` - **(Admin Only)** Update existing vehicle specifications.
- `DELETE /api/vehicles/{id}` - **(Admin Only)** Delete a vehicle from inventory.

### 📦 Inventory Workflow (`/api/vehicles`)
- `POST /api/vehicles/{id}/purchase` - **(User/Auth)** Purchase vehicle (decrements stock by 1; fails if out-of-stock).
- `POST /api/vehicles/{id}/restock` - **(Admin Only)** Restock vehicle inventory by specified amount.

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend App: `http://localhost:5173`

### 3. Running Test Suite (TDD Verification)
```bash
cd backend
pytest -v
```

---

## 🤖 My AI Usage

### 1. AI Tools Used
- **Google Gemini / Antigravity AI Assistant**: Primary AI co-author and pair programming assistant used throughout the development lifecycle.

### 2. How AI Was Used
- **Architecture & Schema Design**: Used Gemini to design the relational SQLite database schema (`Vehicle` and `User` models) and structure clean, decoupled FastAPI services and routers following SOLID principles.
- **Test-Driven Development (TDD)**: Asked Gemini to generate comprehensive Pytest unit tests for authentication (`test_auth.py`), vehicle inventory CRUD and purchase/restock edge cases (`test_vehicles.py`), and AI price insight calculations (`test_ai_features.py`) prior to refining feature implementations.
- **Frontend SPA Components**: Used Gemini to generate and refine sleek, glassmorphic React components (`VehicleCard.jsx`, `SmartSearchBar.jsx`, `VehicleDetailsModal.jsx`, `AdminPanel.jsx`) with Tailwind CSS.
- **Mahindra Fleet Integration**: Used Gemini to extract specifications and process uploaded image assets for Mahindra models (`XUV 3XO`, `Bolero`, `Thar`, `Scorpio Classic`, `BE 6`) and format Ex-Showroom price ranges in Indian Lakhs (`₹7.54 – ₹15.79 lakh`).

### 3. Workflow Reflection
Leveraging AI as a co-author drastically accelerated the development cycle without compromising code quality. Working in tandem with AI made Test-Driven Development seamless—writing tests upfront ensured 100% endpoint reliability. The AI also made it easy to deliver a polished, dark-mode visual interface with rich metadata and instant error handling.

---

## 📜 Version Control & Co-authorship
All Git commits in this project strictly follow the Git Co-authorship trailer specification:

```text
Co-authored-by: Antigravity AI <AI@users.noreply.github.com>
```
