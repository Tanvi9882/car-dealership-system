import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models import User, Vehicle
from app.auth import hash_password
from app.routes import auth_router, vehicle_router

from contextlib import asynccontextmanager

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("car-dealership")

# Create Database tables
Base.metadata.create_all(bind=engine)


def seed_database():
    """Seed initial data if tables are empty or missing vehicles"""
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

        # Full Expanded Fleet Inventory
        all_seed_vehicles = [
            # Mahindra
            Vehicle(make="Mahindra", model="XUV 3XO", category="SUV", price=754000.0, price_range="₹7.54 – ₹15.79 lakh", quantity=8, image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", fuel_type="Petrol / Diesel", transmission="Manual / Automatic", seating_capacity="5"),
            Vehicle(make="Mahindra", model="Bolero", category="SUV", price=849000.0, price_range="₹8.49 – ₹9.99 lakh", quantity=6, image_url="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80", fuel_type="Diesel", transmission="Manual", seating_capacity="7"),
            Vehicle(make="Mahindra", model="Thar 4x4", category="SUV", price=1032000.0, price_range="₹10.32 – ₹18.00 lakh", quantity=10, image_url="/images/mahindra/thar.png", fuel_type="Petrol / Diesel", transmission="Manual / Automatic", seating_capacity="4"),
            Vehicle(make="Mahindra", model="Scorpio Classic", category="SUV", price=1362000.0, price_range="₹13.62 – ₹17.72 lakh", quantity=5, image_url="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80", fuel_type="Diesel", transmission="Manual", seating_capacity="7"),
            
            # Luxury Fleet
            Vehicle(make="Mercedes-Benz", model="S-Class Maybach", category="Luxury", price=18600000.0, price_range="₹1.86 – ₹3.40 Crore", quantity=4, image_url="/images/mercedes/maybach.jpg", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="Land Rover", model="Defender 110", category="SUV", price=10500000.0, price_range="₹1.05 – ₹2.30 Crore", quantity=5, image_url="/images/landrover/defender.jpg", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="7"),
            Vehicle(make="BMW", model="X7 M-Sport", category="SUV", price=13200000.0, price_range="₹1.32 Crore", quantity=3, image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="7"),
            Vehicle(make="Rolls-Royce", model="Phantom Series II", category="Luxury", price=105000000.0, price_range="₹10.50 Crore", quantity=2, image_url="https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80", fuel_type="Petrol", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="Bentley", model="Flying Spur V8", category="Luxury", price=52500000.0, price_range="₹5.25 Crore", quantity=3, image_url="/images/bentley/flyingspur.png", fuel_type="Petrol", transmission="Automatic", seating_capacity="4"),
            
            # Supercars & Sports Fleet
            Vehicle(make="Porsche", model="911 GT3 RS", category="Sports", price=35100000.0, price_range="₹3.51 Crore", quantity=3, image_url="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80", fuel_type="Petrol", transmission="PDK Automatic", seating_capacity="2"),
            Vehicle(make="Lamborghini", model="Urus Performante", category="Sports", price=42200000.0, price_range="₹4.22 Crore", quantity=2, image_url="/images/lamborghini/urus.jpg", fuel_type="Petrol V8 Turbo", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="Ferrari", model="296 GTB Hybrid", category="Sports", price=54000000.0, price_range="₹5.40 Crore", quantity=2, image_url="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80", fuel_type="Hybrid V6 Turbo", transmission="Dual-Clutch", seating_capacity="2"),
            Vehicle(make="Aston Martin", model="DB12 Super Tourer", category="Sports", price=45900000.0, price_range="₹4.59 Crore", quantity=3, image_url="/images/astonmartin/db12.png", fuel_type="Twin-Turbo V8", transmission="Automatic", seating_capacity="4"),
            
            # Electric Fleet
            Vehicle(make="Porsche", model="Taycan Turbo S EV", category="Electric", price=16100000.0, price_range="₹1.61 Crore", quantity=4, image_url="/images/porsche/taycan.jpg", fuel_type="Electric 761hp", transmission="2-Speed EV", seating_capacity="4"),
            Vehicle(make="Tesla", model="Model S Plaid", category="Electric", price=15000000.0, price_range="₹1.50 Crore", quantity=5, image_url="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80", fuel_type="Tri-Motor EV", transmission="Direct Drive", seating_capacity="5"),
            Vehicle(make="Kia", model="EV6 GT-Line", category="Electric", price=6597000.0, price_range="₹65.97 – ₹70.90 lakh", quantity=4, image_url="/images/kia/ev6.jpg", fuel_type="Electric AWD", transmission="Single-Speed EV", seating_capacity="5"),
            Vehicle(make="Kia", model="EV9 GT-Line", category="Electric", price=13000000.0, price_range="₹1.30 Crore", quantity=3, image_url="/images/kia/ev9.png", fuel_type="Dual-Motor EV", transmission="Single-Speed EV", seating_capacity="6"),
            
            # Kia & Skoda Fleet
            Vehicle(make="Kia", model="Sonet Turbo", category="SUV", price=733000.0, price_range="₹7.33 – ₹14.50 lakh", quantity=6, image_url="/images/kia/sonet.png", fuel_type="Petrol Turbo", transmission="Manual / DCT", seating_capacity="5"),
            Vehicle(make="Kia", model="Seltos X-Line", category="SUV", price=1100000.0, price_range="₹11.00 – ₹20.35 lakh", quantity=8, image_url="/images/kia/seltos.jpg", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="Kia", model="Carens Luxury Plus", category="Luxury", price=1102000.0, price_range="₹11.02 – ₹19.50 lakh", quantity=4, image_url="/images/kia/carens.png", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="7"),
            Vehicle(make="Kia", model="Carnival Limousine", category="Luxury", price=5965000.0, price_range="₹59.65 – ₹63.90 lakh", quantity=3, image_url="/images/kia/carnival.png", fuel_type="Diesel", transmission="Automatic", seating_capacity="7"),
            Vehicle(make="Skoda", model="Slavia Elegance", category="Sedan", price=1000000.0, price_range="₹10.00 – ₹18.69 lakh", quantity=6, image_url="/images/skoda/slavia.jpg", fuel_type="TSI Petrol", transmission="DSG Automatic", seating_capacity="5"),
            Vehicle(make="Skoda", model="Kushaq Monte Carlo", category="SUV", price=1069000.0, price_range="₹10.69 – ₹18.79 lakh", quantity=7, image_url="/images/skoda/kushaq.jpg", fuel_type="TSI Petrol", transmission="DSG Automatic", seating_capacity="5"),
            Vehicle(make="Skoda", model="Kodiaq L&K 4x4", category="SUV", price=4689000.0, price_range="₹46.89 – ₹48.69 Lakh", quantity=4, image_url="/images/skoda/kodiaq.png", fuel_type="Petrol", transmission="DSG Automatic", seating_capacity="7"),
            Vehicle(make="Skoda", model="Octavia RS 245", category="Sports", price=4999000.0, price_range="₹49.99 lakh", quantity=3, image_url="/images/skoda/octavia_rs.png", fuel_type="Turbo Petrol", transmission="Automatic (DSG)", seating_capacity="5"),
            Vehicle(make="Audi", model="RS Q8 Performance", category="Luxury", price=24900000.0, price_range="₹2.49 – ₹2.65 Crore", quantity=3, image_url="/images/audi/rs_q8.png", fuel_type="Petrol", transmission="Automatic", seating_capacity="5"),
            
            # Sedans Fleet
            Vehicle(make="BMW", model="7 Series", category="Luxury", price=18400000.0, price_range="₹1.84 – ₹1.87 Crore", quantity=6, image_url="/images/bmw/7series.png", fuel_type="Petrol / Diesel", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="Audi", model="A8 L", category="Luxury", price=13400000.0, price_range="₹1.34 – ₹1.63 Crore", quantity=5, image_url="/images/audi/a8l.png", fuel_type="Petrol", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="Honda", model="City", category="Sedan", price=1238000.0, price_range="₹12.38 – ₹16.65 Lakh", quantity=6, image_url="/images/honda/city.png", fuel_type="Petrol", transmission="Manual / CVT", seating_capacity="5"),
            Vehicle(make="Hyundai", model="Verna", category="Sedan", price=1107000.0, price_range="₹11.07 – ₹17.58 Lakh", quantity=6, image_url="/images/hyundai/verna.png", fuel_type="Petrol", transmission="Manual / DCT / IVT", seating_capacity="5"),
            Vehicle(make="Volkswagen", model="Virtus GT", category="Sedan", price=1784000.0, price_range="₹17.84 – ₹19.40 Lakh", quantity=5, image_url="/images/volkswagen/virtus.png", fuel_type="Petrol", transmission="DSG Automatic", seating_capacity="5"),
            Vehicle(make="Toyota", model="Camry Hybrid", category="Sedan", price=4800000.0, price_range="₹48 – ₹50 Lakh", quantity=5, image_url="/images/toyota/camry.png", fuel_type="Hybrid (Petrol + Electric)", transmission="e-CVT", seating_capacity="5"),
            Vehicle(make="Audi", model="A6", category="Sedan", price=6600000.0, price_range="₹66 – ₹72 Lakh", quantity=5, image_url="/images/audi/a6.png", fuel_type="Petrol", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="BMW", model="5 Series", category="Sedan", price=7200000.0, price_range="₹72 – ₹78 Lakh", quantity=5, image_url="/images/bmw/5series.png", fuel_type="Petrol", transmission="Automatic", seating_capacity="5"),
            
            # High-Performance Sports Fleet
            Vehicle(make="Lamborghini", model="Huracán Tecnica", category="Sports", price=40000000.0, price_range="₹4.00 – ₹4.50 Crore", quantity=6, image_url="/images/lamborghini/huracan.png", fuel_type="Petrol (640 hp)", transmission="7-Speed DCT", seating_capacity="2"),
            Vehicle(make="Chevrolet", model="Corvette C8 Stingray", category="Sports", price=15000000.0, price_range="₹1.50 – ₹1.80 Crore", quantity=6, image_url="/images/chevrolet/corvette.jpg", fuel_type="Petrol (495 hp)", transmission="8-Speed DCT", seating_capacity="2"),
            Vehicle(make="Nissan", model="GT-R", category="Sports", price=21200000.0, price_range="₹2.12 – ₹2.50 Crore", quantity=8, image_url="/images/nissan/gtr.png", fuel_type="Petrol (565 hp)", transmission="6-Speed Dual-Clutch", seating_capacity="4"),
            Vehicle(make="McLaren", model="720S", category="Sports", price=46500000.0, price_range="₹4.65 – ₹5.04 Crore", quantity=7, image_url="/images/mclaren/720s.png", fuel_type="Petrol (720 hp)", transmission="7-Speed DCT", seating_capacity="2"),
            Vehicle(make="Audi", model="R8 V10 Performance", category="Sports", price=27200000.0, price_range="₹2.72 – ₹3.00 Crore", quantity=6, image_url="/images/audi/r8.jpg", fuel_type="Petrol (620 hp)", transmission="7-Speed S Tronic", seating_capacity="2"),
            Vehicle(make="BMW", model="M4 Competition", category="Sports", price=15300000.0, price_range="₹1.53 – ₹1.56 Crore", quantity=8, image_url="/images/bmw/m4.jpg", fuel_type="Petrol (530 hp)", transmission="8-Speed Automatic", seating_capacity="4"),
            Vehicle(make="Toyota", model="GR Supra", category="Sports", price=8500000.0, price_range="₹85 – ₹90 Lakh", quantity=7, image_url="/images/toyota/supra.png", fuel_type="Petrol (382 hp)", transmission="8-Speed Automatic", seating_capacity="2"),
            
            # Flagship Ultra Luxury Fleet
            Vehicle(make="Bentley", model="Bentayga", category="Luxury", price=50000000.0, price_range="₹5.00 – ₹6.00 Crore", quantity=8, image_url="/images/bentley/bentayga.png", fuel_type="Petrol (542 hp)", transmission="8-Speed Automatic", seating_capacity="5"),
            Vehicle(make="Porsche", model="Cayenne Turbo GT", category="Luxury", price=26000000.0, price_range="₹2.60 – ₹3.00 Crore", quantity=6, image_url="/images/porsche/cayenne.png", fuel_type="Petrol (650 hp)", transmission="8-Speed Automatic", seating_capacity="5"),
            Vehicle(make="Lexus", model="LM 350h", category="Luxury", price=21000000.0, price_range="₹2.10 – ₹2.60 Crore", quantity=6, image_url="/images/lexus/lm350h.png", fuel_type="Hybrid (250 hp)", transmission="e-CVT", seating_capacity="4 / 7"),
            Vehicle(make="Land Rover", model="Range Rover SV", category="Luxury", price=40000000.0, price_range="₹4.00 – ₹5.00 Crore", quantity=7, image_url="/images/landrover/rangerover_sv.jpg", fuel_type="Petrol (615 hp)", transmission="8-Speed Automatic", seating_capacity="5"),
            
            # Next-Gen EV Fleet
            Vehicle(make="Mahindra", model="BE 6", category="Electric", price=1890000.0, price_range="₹18.90 – ₹28.49 Lakh", quantity=6, image_url="/images/mahindra/be_6.png", fuel_type="Electric (59/79 kWh, 683 km)", transmission="Automatic", seating_capacity="5"),
            Vehicle(make="BMW", model="i7", category="Electric", price=20500000.0, price_range="₹2.05 – ₹2.50 Crore", quantity=6, image_url="/images/bmw/i7.png", fuel_type="Electric (101.7 kWh, 625 km)", transmission="Single-Speed Automatic", seating_capacity="5"),
            Vehicle(make="Mercedes-Benz", model="EQS 580", category="Electric", price=16000000.0, price_range="₹1.60 – ₹1.70 Crore", quantity=6, image_url="/images/mercedes/eqs.png", fuel_type="Electric (107.8 kWh, 857 km)", transmission="Single-Speed Automatic", seating_capacity="5"),
            Vehicle(make="Audi", model="Q8 e-tron", category="Electric", price=11500000.0, price_range="₹1.15 – ₹1.30 Crore", quantity=6, image_url="/images/audi/q8_etron.jpg", fuel_type="Electric (114 kWh, 600 km)", transmission="Single-Speed Automatic", seating_capacity="5"),
            Vehicle(make="Hyundai", model="Ioniq 5", category="Electric", price=4600000.0, price_range="₹46 – ₹50 Lakh", quantity=7, image_url="/images/hyundai/ioniq5.png", fuel_type="Electric (72.6 kWh, 631 km)", transmission="Single-Speed Automatic", seating_capacity="5"),
            Vehicle(make="Volvo", model="EX30", category="Electric", price=5000000.0, price_range="₹50 – ₹60 Lakh", quantity=6, image_url="/images/volvo/ex30.png", fuel_type="Electric (69 kWh, 476 km)", transmission="Single-Speed Automatic", seating_capacity="5"),
        ]

        added_count = 0
        for vehicle in all_seed_vehicles:
            existing = db.query(Vehicle).filter(Vehicle.make == vehicle.make, Vehicle.model == vehicle.model).first()
            if not existing:
                db.add(vehicle)
                added_count += 1

        if added_count > 0:
            db.commit()
            logger.info(f"Seeded {added_count} new vehicles into showroom fleet.")

    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_database()
    yield

app = FastAPI(
    title="DrivePulse Car Dealership API",
    description="High-performance backend API for Car Dealership System with JWT Auth, Inventory Management & Role-based Access",
    version="1.0.0",
    lifespan=lifespan
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
