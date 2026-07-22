from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user, get_current_admin
from app.models import User
from app.services.vehicle_service import (
    VehicleCreateSchema,
    VehicleUpdateSchema,
    VehicleResponseSchema,
    SmartSearchResponseSchema,
    RestockSchema,
    create_vehicle,
    list_vehicles,
    search_vehicles,
    get_vehicle_by_id,
    update_vehicle,
    delete_vehicle,
    purchase_vehicle,
    restock_vehicle,
    get_vehicle_recommendations,
    smart_search_vehicles
)

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponseSchema])
def get_all_vehicles(db: Session = Depends(get_db)):
    return list_vehicles(db)

@router.get("/search", response_model=List[VehicleResponseSchema])
def search(
    make: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    return search_vehicles(db, make=make, model=model, category=category, min_price=min_price, max_price=max_price)

@router.get("/smart-search", response_model=SmartSearchResponseSchema)
def ai_smart_search(
    query: str = Query(..., description="Natural language search query"),
    db: Session = Depends(get_db)
):
    return smart_search_vehicles(query, db)

@router.get("/{vehicle_id}/recommendations", response_model=List[VehicleResponseSchema])
def get_recommendations(
    vehicle_id: int,
    limit: int = Query(3, ge=1, le=10),
    db: Session = Depends(get_db)
):
    return get_vehicle_recommendations(vehicle_id, db, limit=limit)

@router.get("/{vehicle_id}", response_model=VehicleResponseSchema)
def get_single_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return get_vehicle_by_id(vehicle_id, db)

@router.post("", response_model=VehicleResponseSchema, status_code=status.HTTP_201_CREATED)
def add_vehicle(
    vehicle_data: VehicleCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return create_vehicle(vehicle_data, db)

@router.put("/{vehicle_id}", response_model=VehicleResponseSchema)
def edit_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return update_vehicle(vehicle_id, vehicle_data, db)

@router.delete("/{vehicle_id}", status_code=status.HTTP_200_OK)
def remove_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return delete_vehicle(vehicle_id, db)

@router.post("/{vehicle_id}/purchase", response_model=VehicleResponseSchema)
def buy_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return purchase_vehicle(vehicle_id, db)

@router.post("/{vehicle_id}/restock", response_model=VehicleResponseSchema)
def add_stock(
    vehicle_id: int,
    restock_data: Optional[RestockSchema] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    amount = restock_data.quantity if restock_data else 5
    return restock_vehicle(vehicle_id, amount, db)
