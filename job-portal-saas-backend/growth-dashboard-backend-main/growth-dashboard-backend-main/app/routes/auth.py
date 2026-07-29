from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Generator
from pydantic import BaseModel
import os

from google.oauth2 import id_token
from google.auth.transport import requests

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.auth import create_access_token, verify_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

security = HTTPBearer()


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")



def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



class GoogleLoginRequest(BaseModel):
    token: str



@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    existing_username = db.query(User).filter(User.username == user.username).first()

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    new_user = User(
        name=user.username,
        username=user.username,
        email=user.email,
        password=user.password,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration successful",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }



@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if db_user.password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }
    }



@router.post("/google")
def google_login(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db)
):

    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_ID is not configured"
        )

    try:
        google_user = id_token.verify_oauth2_token(
            request.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = google_user["email"]
        name = google_user.get("name", "")
        picture = google_user.get("picture", "")

    except Exception as e:
        print("===================================")
        print("GOOGLE ERROR:", e)
        print("===================================")

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:

        username = email.split("@")[0]

        user = User(
            name=name,
            username=username,
            email=email,
            password="GOOGLE_LOGIN",
            role="user"
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "message": "Google Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "picture": picture
        }
    }



@router.get("/profile")
def profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or Expired Token"
        )

    db = SessionLocal()

    db_user = db.query(User).filter(User.email == payload["sub"]).first()

    db.close()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "message": "Protected Route",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }
    }