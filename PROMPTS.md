# 💬 PROMPTS.md - AI Tooling Chat History & Prompts Log

This document records the exact user prompt history, design instructions, and technical interactions with AI tooling during the development of the **DrivePulse Car Dealership System**.

---

## 📌 Prompt 1: Initial System Architecture & Mahindra SUV Fleet Integration

### 👤 User Prompt:
> **mahindra cars**
> 1. XUV 3XO | Compact SUV | Petrol / Diesel | Manual / Automatic | 5 Seats | ₹7.54 – ₹15.79 lakh
> 2. Bolero | SUV | Diesel | Manual | 7 Seats | ₹8.49 – ₹9.99 lakh
> 3. Thar | Off-road SUV | Petrol / Diesel | Manual / Automatic | 4 Seats | ₹10.32 – ₹18.00 lakh
> 4. Scorpio Classic | SUV | Diesel | Manual | 7 / 9 Seats | ₹13.62 – ₹17.72 lakh
> 5. BE 6 | Electric SUV | Electric | Automatic | 5 Seats | ₹18.90 – ₹28.49 lakh
> *(Attached 5 high-resolution car images)*

### 🤖 AI Actions & Response:
- Extracted and processed all 5 Mahindra car images into `frontend/public/images/mahindra/`.
- Updated database model `Vehicle` and Pydantic response schemas to include `price_range` (e.g. `₹7.54 – ₹15.79 lakh`) and string seating capacities (`7 / 9`).
- Seeded Mahindra vehicle inventory into the SQLite database (`car_dealership.db`).
- Built brand filter controls (`Mahindra`, `Kia`, `Skoda`) and specs bar (Fuel, Transmission, Seating) on the React dashboard.

---

## 📌 Prompt 2: Verification of System Requirements (Page 1)

### 👤 User Prompt:
> **is all are covered??**
> *(Attached Page 1/3 of specification document detailing API endpoints: JWT Auth, Vehicle CRUD, Purchase/Restock endpoints, SQLite model)*

### 🤖 AI Actions & Response:
- Verified FastAPI backend route implementations in `app/routes/auth_routes.py` and `app/routes/vehicle_routes.py`.
- Confirmed role-based JWT authorization for `user` vs `admin` roles.
- Ran pytest test suite to ensure all unit tests for auth and vehicle endpoints passed.

---

## 📌 Prompt 3: Verification of Frontend SPA & TDD Guidelines (Page 2)

### 👤 User Prompt:
> **is all are covered??**
> *(Attached Page 2/3 of specification document detailing Frontend SPA tech stack, React Tailwind UI, Search/Filters, Stock-disabled Purchase button, Admin CRUD forms, and TDD pattern)*

### 🤖 AI Actions & Response:
- Confirmed React 18, Tailwind CSS, and Vite SPA setup.
- Verified `Dashboard.jsx`, `VehicleCard.jsx`, `VehicleDetailsModal.jsx`, and `AdminPanel.jsx`.
- Verified out-of-stock disabling logic (`disabled={quantity <= 0}`).
- Executed `npm run build` (Vite) and `pytest` to confirm 100% test passing and zero compilation errors.

---

## 📌 Prompt 4: Verification of AI Co-authorship & README Guidelines (Page 3)

### 👤 User Prompt:
> **is all covered???**
> *(Attached Page 3/3 of specification document detailing AI Co-authorship Git trailer rules, `README.md` "My AI Usage" requirement, and Deliverables list)*

### 🤖 AI Actions & Response:
- Created comprehensive `README.md` featuring a dedicated `## My AI Usage` section.
- Added AI Co-authorship Git commit trailer (`Co-authored-by: Gemini AI <AI@users.noreply.github.com>`).
- Created `PROMPTS.md` in the root folder documenting full chat history.

---

## 📌 Prompt 5: Hatchbacks Fleet Integration (Maruti Suzuki & Renault)

### 👤 User Prompt:
> 1. Maruti Suzuki Alto K10 | ₹4.23 lakh | Petrol / CNG | Up to 33.85 km/kg (CNG) | 5 Seats
> 2. Renault Kwid | ₹4.70 lakh | Petrol | Up to 22 km/l | 5 Seats
> 3. Maruti Suzuki S-Presso | ₹4.73 lakh | Petrol / CNG | Up to 32.73 km/kg (CNG) | 5 Seats
> 4. Maruti Suzuki Celerio | ₹5.64 lakh | Petrol / CNG | Up to 34.43 km/kg (CNG) | 5 Seats
> *(Attached 4 car image assets)*

### 🤖 AI Actions & Response:
- Extracted and saved all 4 hatchback car photos into `frontend/public/images/maruti/` and `frontend/public/images/renault/`.
- Seeded Alto K10, Kwid, S-Presso, and Celerio into `car_dealership.db` SQLite database (Total 23 vehicles).
- Updated frontend brand pills (`Maruti Suzuki`, `Renault`) and category filters (`Hatchback`).

---

## 📌 Summary of AI Tooling Collaboration
- **AI Tool Used**: Gemini AI / Antigravity Agentic Assistant.
- **Impact**: Accelerated TDD test suite creation, automated SQLite seed migrations, styled dark-mode React UI, and enforced 100% specification compliance.
