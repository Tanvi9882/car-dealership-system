from pydantic import BaseModel, EmailStr, ConfigDict
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import User
from app.auth import hash_password, verify_password, create_access_token

class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponseSchema(BaseModel):
    id: int
    name: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)

class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseSchema

def register_user(user_data: UserRegisterSchema, db: Session) -> UserResponseSchema:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pwd,
        role=user_data.role if user_data.role in ["admin", "user"] else "user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponseSchema.model_validate(new_user)

def login_user(credentials: UserLoginSchema, db: Session) -> TokenResponseSchema:
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return TokenResponseSchema(
        access_token=access_token,
        token_type="bearer",
        user=UserResponseSchema.model_validate(user)
    )
