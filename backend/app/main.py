import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models import User, Vehicle
from app.auth import hash_password
from app.routes import auth_router, vehicle_router

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("car-dealership")

# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DrivePulse Car Dealership API",
    description="High-performance backend API for Car Dealership System with JWT Auth, Inventory Management & Role-based Access",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(vehicle_router)


@app.on_event("startup")
def seed_database():
    """Seed initial data if tables are empty"""
    db = SessionLocal()
    try:
        # Seed users if not exists
        if db.query(User).count() == 0:
            logger.info("Seeding initial users...")
            admin_user = User(
                name="System Admin",
                email="admin@dealership.com",
                password=hash_password("admin123"),
                role="admin"
            )
            demo_user = User(
                name="John Doe",
                email="user@dealership.com",
                password=hash_password("user123"),
                role="user"
            )
            db.add_all([admin_user, demo_user])
            db.commit()

        # Seed vehicles if not exists or ensure Mahindra vehicles are seeded
        mahindra_vehicles = [
            Vehicle(make="Mahindra", model="XUV 3XO", category="Compact SUV", price=754000.0, price_range="₹7.54 – ₹15.79 lakh", quantity=8, image_url="/images/mahindra/xuv_3xo.png", fuel_type="Petrol / Diesel", transmission="Manual / Automatic", seating_capacity="5"),
            Vehicle(make="Mahindra", model="Bolero", category="SUV", price=849000.0, price_range="₹8.49 – ₹9.99 lakh", quantity=6, image_url="/images/mahindra/bolero.jpg", fuel_type="Diesel", transmission="Manual", seating_capacity="7"),
            Vehicle(make="Mahindra", model="Thar", category="Off-road SUV", price=1032000.0, price_range="₹10.32 – ₹18.00 lakh", quantity=10, image_url="/images/mahindra/thar.jpg", fuel_type="Petrol / Diesel", transmission="Manual / Automatic", seating_capacity="4"),
            Vehicle(make="Mahindra", model="Scorpio Classic", category="SUV", price=1362000.0, price_range="₹13.62 – ₹17.72 lakh", quantity=5, image_url="/images/mahindra/scorpio_classic.png", fuel_type="Diesel", transmission="Manual", seating_capacity="7 / 9"),
            Vehicle(make="Mahindra", model="BE 6", category="Electric SUV", price=1890000.0, price_range="₹18.90 – ₹28.49 lakh", quantity=4, image_url="/images/mahindra/be_6.png", fuel_type="Electric", transmission="Automatic", seating_capacity="5"),
        ]

        existing_mahindra = db.query(Vehicle).filter(Vehicle.make == "Mahindra").count()
        if existing_mahindra == 0:
            logger.info("Seeding Mahindra vehicle inventory...")
            db.add_all(mahindra_vehicles)
            db.commit()

        if db.query(Vehicle).count() == 0:
            logger.info("Seeding initial vehicle inventory...")
            demo_vehicles = [
                # Kia
                Vehicle(make="Kia", model="Sonet", category="SUV", price=733000.0, price_range="₹7.33 – ₹14.50 lakh", quantity=6, image_url="/images/kia/sonet.jpg", fuel_type="Petrol", transmission="Manual / Automatic", seating_capacity="5"),
                Vehicle(make="Kia", model="Syros", category="SUV", price=842000.0, price_range="₹8.42 – ₹16.00 lakh", quantity=5, image_url="/images/kia/syros.png", fuel_type="Petrol", transmission="Manual / Automatic", seating_capacity="5"),
                Vehicle(make="Kia", model="Seltos", category="SUV", price=1100000.0, price_range="₹11.00 – ₹20.35 lakh", quantity=8, image_url="/images/kia/seltos.png", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="5"),
                Vehicle(make="Kia", model="Carens", category="Luxury", price=1102000.0, price_range="₹11.02 – ₹19.50 lakh", quantity=4, image_url="/images/kia/carens.png", fuel_type="Petrol / Diesel", transmission="Manual / Automatic", seating_capacity="7"),
                Vehicle(make="Kia", model="Carens Clavis", category="Luxury", price=1123000.0, price_range="₹11.23 – ₹20.00 lakh", quantity=3, image_url="/images/kia/clavis.png", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="7"),
                Vehicle(make="Kia", model="Carens Clavis EV", category="Electric", price=1800000.0, price_range="₹18.00 – ₹24.00 lakh", quantity=5, image_url="/images/kia/clavis_ev.png", fuel_type="Electric", transmission="Single-Speed EV", seating_capacity="7"),
                Vehicle(make="Kia", model="Carnival", category="Luxury", price=5965000.0, price_range="₹59.65 – ₹63.90 lakh", quantity=3, image_url="/images/kia/carnival.png", fuel_type="Diesel", transmission="Automatic", seating_capacity="7"),
                Vehicle(make="Kia", model="EV6", category="Electric", price=6597000.0, price_range="₹65.97 – ₹70.90 lakh", quantity=4, image_url="/images/kia/ev6.jpg", fuel_type="Electric", transmission="Single-Speed EV", seating_capacity="5"),
                Vehicle(make="Kia", model="EV9", category="Electric", price=13000000.0, price_range="₹1.30 Crore", quantity=2, image_url="/images/kia/ev9.png", fuel_type="Electric", transmission="Single-Speed EV", seating_capacity="6"),
                # Skoda
                Vehicle(make="Skoda", model="Kylaq", category="SUV", price=759000.0, price_range="₹7.59 – ₹14.40 lakh", quantity=5, image_url="/images/skoda/kylaq.jpg", fuel_type="Petrol", transmission="Manual / Automatic", seating_capacity="5"),
                Vehicle(make="Skoda", model="Slavia", category="Sedan", price=1000000.0, price_range="₹10.00 – ₹18.69 lakh", quantity=6, image_url="/images/skoda/slavia.png", fuel_type="Petrol", transmission="Manual / Automatic", seating_capacity="5"),
                Vehicle(make="Skoda", model="Kushaq", category="SUV", price=1069000.0, price_range="₹10.69 – ₹18.79 lakh", quantity=7, image_url="/images/skoda/kushaq.png", fuel_type="Petrol", transmission="Manual / Automatic", seating_capacity="5"),
                Vehicle(make="Skoda", model="Kodiaq", category="Luxury", price=3699000.0, price_range="₹36.99 – ₹39.99 lakh", quantity=4, image_url="/images/skoda/kodiaq.png", fuel_type="Petrol", transmission="Automatic (DSG)", seating_capacity="7"),
                Vehicle(make="Skoda", model="Octavia RS", category="Sports", price=4999000.0, price_range="₹49.99 lakh", quantity=3, image_url="/images/skoda/octavia_rs.jpg", fuel_type="Petrol", transmission="Automatic (DSG)", seating_capacity="5"),
            ]
            db.add_all(demo_vehicles)
            db.commit()
    finally:
        db.close()



@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Car Dealership API",
        "docs": "/docs",
        "endpoints": {
            "auth": ["/api/auth/register", "/api/auth/login"],
            "vehicles": ["/api/vehicles", "/api/vehicles/search", "/api/vehicles/{id}/purchase", "/api/vehicles/{id}/restock"]
        }
    }
