from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False) # 'admin' or 'user'


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True) # SUV, Compact SUV, Off-road SUV, Electric SUV, Sedan, Luxury, Electric, Sports, Truck
    price = Column(Float, nullable=False)
    price_range = Column(String(100), nullable=True) # e.g. "₹7.54 – ₹15.79 lakh"
    quantity = Column(Integer, default=0, nullable=False)
    image_url = Column(Text, nullable=True)
    fuel_type = Column(String(100), default="Petrol", nullable=True) # Petrol, Diesel, Petrol / Diesel, Electric
    transmission = Column(String(100), default="Automatic", nullable=True) # Manual, Automatic, Manual / Automatic
    seating_capacity = Column(String(50), default="5", nullable=True) # 5, 7, 4, 7 / 9

