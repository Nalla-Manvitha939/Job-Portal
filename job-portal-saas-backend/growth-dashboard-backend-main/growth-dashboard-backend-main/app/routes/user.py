from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.database import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    mobile: Optional[str] = None
    password: str
    role: Optional[str] = "user"


@router.post("/register")
def register_user(data: RegisterSchema):
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )

        new_user = User(
            username=data.name,
            email=data.email,
            mobile=data.mobile,
            password=data.password,
            role=data.role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "role": new_user.role
            }
        }
    finally:
        db.close()


@router.get("/")
def get_all_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        user_list = [
            {
                "id": user.id,
                "name": getattr(user, "username", None),
                "email": user.email,
                "mobile": getattr(user, "mobile", None),
                "role": getattr(user, "role", "user"),
                "createdAt": getattr(user, "created_at", None) or getattr(user, "createdAt", None)
            }
            for user in users
        ]
        return {
            "success": True,
            "users": user_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
