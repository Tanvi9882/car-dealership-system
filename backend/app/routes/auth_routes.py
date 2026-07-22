from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import (
    UserRegisterSchema,
    UserLoginSchema,
    UserResponseSchema,
    TokenResponseSchema,
    register_user,
    login_user
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponseSchema, status_code=201)
def register(user_data: UserRegisterSchema, db: Session = Depends(get_db)):
    return register_user(user_data, db)

@router.post("/login", response_model=TokenResponseSchema)
def login(credentials: UserLoginSchema, db: Session = Depends(get_db)):
    return login_user(credentials, db)
