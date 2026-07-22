import re
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Vehicle

class VehicleCreateSchema(BaseModel):
    make: str
    model: str
    category: str
    price: float = Field(gt=0, description="Price must be positive")
    price_range: Optional[str] = None
    quantity: int = Field(ge=0, description="Quantity must be non-negative")
    image_url: Optional[str] = None
    fuel_type: Optional[str] = "Petrol"
    transmission: Optional[str] = "Automatic"
    seating_capacity: Optional[str] = "5"

class VehicleUpdateSchema(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    price_range: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    seating_capacity: Optional[str] = None

class RestockSchema(BaseModel):
    quantity: int = Field(1, ge=1, description="Amount to add to stock")

class VehicleResponseSchema(BaseModel):
    id: int
    make: str
    model: str
    category: str
    price: float
    price_range: Optional[str] = None
    quantity: int
    image_url: Optional[str] = None
    fuel_type: Optional[str] = "Petrol"
    transmission: Optional[str] = "Automatic"
    seating_capacity: Optional[str] = "5"
    price_insight: Optional[str] = "Average"
    category_average: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class SmartSearchResponseSchema(BaseModel):
    query: str
    parsed_filters: str
    total_results: int
    vehicles: List[VehicleResponseSchema]


def calculate_price_insight(price: float, category: str, db: Session) -> tuple[str, float]:
    all_cat_vehicles = db.query(Vehicle).filter(Vehicle.category.ilike(category)).all()
    if not all_cat_vehicles:
        all_cat_vehicles = db.query(Vehicle).all()
    
    if not all_cat_vehicles:
        return "Average", price

    avg_price = sum(v.price for v in all_cat_vehicles) / len(all_cat_vehicles)
    
    if price <= avg_price * 0.85:
        insight = "Good Value"
    elif price >= avg_price * 1.15:
        insight = "Premium"
    else:
        insight = "Average"
        
    return insight, round(avg_price, 2)


def build_vehicle_response(vehicle: Vehicle, db: Session) -> VehicleResponseSchema:
    insight, cat_avg = calculate_price_insight(vehicle.price, vehicle.category, db)
    resp = VehicleResponseSchema.model_validate(vehicle)
    resp.price_insight = insight
    resp.category_average = cat_avg
    return resp


def create_vehicle(vehicle_data: VehicleCreateSchema, db: Session) -> VehicleResponseSchema:
    vehicle = Vehicle(
        make=vehicle_data.make,
        model=vehicle_data.model,
        category=vehicle_data.category,
        price=vehicle_data.price,
        price_range=vehicle_data.price_range,
        quantity=vehicle_data.quantity,
        image_url=vehicle_data.image_url,
        fuel_type=vehicle_data.fuel_type or "Petrol",
        transmission=vehicle_data.transmission or "Automatic",
        seating_capacity=str(vehicle_data.seating_capacity or "5")
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return build_vehicle_response(vehicle, db)


def list_vehicles(db: Session) -> List[VehicleResponseSchema]:
    vehicles = db.query(Vehicle).all()
    return [build_vehicle_response(v, db) for v in vehicles]


def search_vehicles(
    db: Session,
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
) -> List[VehicleResponseSchema]:
    query = db.query(Vehicle)

    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)

    vehicles = query.all()
    return [build_vehicle_response(v, db) for v in vehicles]


def get_vehicle_by_id(vehicle_id: int, db: Session) -> VehicleResponseSchema:
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    return build_vehicle_response(vehicle, db)


def update_vehicle(vehicle_id: int, vehicle_data: VehicleUpdateSchema, db: Session) -> VehicleResponseSchema:
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    
    update_dict = vehicle_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(vehicle, field, value)
        
    db.commit()
    db.refresh(vehicle)
    return build_vehicle_response(vehicle, db)


def delete_vehicle(vehicle_id: int, db: Session):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    
    db.delete(vehicle)
    db.commit()
    return {"message": f"Vehicle with ID {vehicle_id} deleted successfully"}


def purchase_vehicle(vehicle_id: int, db: Session) -> VehicleResponseSchema:
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    
    if vehicle.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle is out of stock"
        )
    
    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return build_vehicle_response(vehicle, db)


def restock_vehicle(vehicle_id: int, amount: int, db: Session) -> VehicleResponseSchema:
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Restock amount must be greater than zero"
        )
    
    vehicle.quantity += amount
    db.commit()
    db.refresh(vehicle)
    return build_vehicle_response(vehicle, db)


def get_vehicle_recommendations(vehicle_id: int, db: Session, limit: int = 3) -> List[VehicleResponseSchema]:
    """
    AI Recommendation Engine: 'Customers who viewed this car may also like...'
    Finds vehicles matching the target vehicle's category or price range (+- 35%),
    excluding the vehicle itself.
    """
    target = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )

    # Primary matches: same category, different vehicle
    same_cat_query = db.query(Vehicle).filter(
        Vehicle.id != vehicle_id,
        Vehicle.category.ilike(target.category)
    ).all()

    # Sort same category vehicles by price closeness
    same_cat_query.sort(key=lambda v: abs(v.price - target.price))

    recommendations = list(same_cat_query)

    # If we need more recommendations, fill with same brand or similar price range (+- 35%)
    if len(recommendations) < limit:
        min_p = target.price * 0.65
        max_p = target.price * 1.35
        price_query = db.query(Vehicle).filter(
            Vehicle.id != vehicle_id,
            Vehicle.id.notin_([v.id for v in recommendations]),
            Vehicle.price >= min_p,
            Vehicle.price <= max_p
        ).all()
        price_query.sort(key=lambda v: abs(v.price - target.price))
        recommendations.extend(price_query)

    final_recs = recommendations[:limit]
    return [build_vehicle_response(v, db) for v in final_recs]


def smart_search_vehicles(query_str: str, db: Session) -> SmartSearchResponseSchema:
    """
    AI Smart Search: Parses natural language queries such as:
    'SUV under ₹15 lakh', 'Electric cars under 50 lakhs', 'Luxury sedan', 'BMW under 2 crore'
    """
    clean_q = query_str.strip().lower()
    
    parsed_filters_parts = []
    
    category = None
    make = None
    max_price = None
    min_price = None

    # Categories check
    categories_list = ["suv", "sports", "electric", "sedan", "luxury", "hatchback", "truck"]
    for cat in categories_list:
        if cat in clean_q:
            category = cat
            parsed_filters_parts.append(f"Category: '{cat.upper()}'")
            break

    # Makes check from database distinct makes
    all_makes = [m[0] for m in db.query(Vehicle.make).distinct().all()]
    for m in all_makes:
        if m.lower() in clean_q:
            make = m
            parsed_filters_parts.append(f"Make: '{m}'")
            break

    # Parse numeric price expressions
    # e.g., "15 lakh", "15 lakhs", "15 lac", "1.5 crore", "1.5 cr", "50k", "50000"
    lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l\b)', clean_q)
    crore_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:crores?|crs?|cr\b)', clean_q)
    k_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:k|thousand)\b', clean_q)
    raw_num_match = re.search(r'₹?\s*(\d{5,9})', clean_q)

    parsed_amount = None
    if crore_match:
        parsed_amount = float(crore_match.group(1)) * 10_00_00_00 # 1 crore = 10,000,000
    elif lakh_match:
        parsed_amount = float(lakh_match.group(1)) * 1_00_000 # 1 lakh = 100,000
    elif k_match:
        parsed_amount = float(k_match.group(1)) * 1_000
    elif raw_num_match:
        parsed_amount = float(raw_num_match.group(1))

    if parsed_amount:
        if any(term in clean_q for term in ["under", "below", "less than", "max", "up to", "<"]):
            max_price = parsed_amount
            parsed_filters_parts.append(f"Max Price: ₹{parsed_amount:,.0f}")
        elif any(term in clean_q for term in ["above", "over", "more than", "min", ">"]):
            min_price = parsed_amount
            parsed_filters_parts.append(f"Min Price: ₹{parsed_amount:,.0f}")
        else:
            # Default to max price if budget is mentioned (e.g. "SUV 20 lakh")
            max_price = parsed_amount
            parsed_filters_parts.append(f"Max Price: ₹{parsed_amount:,.0f}")

    # Build DB Query
    q = db.query(Vehicle)

    if category:
        q = q.filter(Vehicle.category.ilike(f"%{category}%"))
    if make:
        q = q.filter(Vehicle.make.ilike(f"%{make}%"))
    if max_price is not None:
        q = q.filter(Vehicle.price <= max_price)
    if min_price is not None:
        q = q.filter(Vehicle.price >= min_price)

    # Fallback keyword match if no structured fields matched
    if not category and not make and max_price is None and min_price is None:
        # Search make or model by raw query string
        q = q.filter(
            (Vehicle.make.ilike(f"%{clean_q}%")) |
            (Vehicle.model.ilike(f"%{clean_q}%")) |
            (Vehicle.category.ilike(f"%{clean_q}%"))
        )
        parsed_filters_parts.append(f"Keyword search: '{query_str}'")

    results = q.all()
    filter_summary = ", ".join(parsed_filters_parts) if parsed_filters_parts else "Full Inventory Match"

    return SmartSearchResponseSchema(
        query=query_str,
        parsed_filters=filter_summary,
        total_results=len(results),
        vehicles=[build_vehicle_response(v, db) for v in results]
    )

