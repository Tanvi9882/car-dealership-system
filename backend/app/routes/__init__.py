from app.routes.auth_routes import router as auth_router
from app.routes.vehicle_routes import router as vehicle_router

__all__ = ["auth_router", "vehicle_router"]
