from pydantic import BaseModel, EmailStr, Field
from typing import Optional



class UserCreate(BaseModel):
    name: Optional[str] = None         
    username: Optional[str] = None    
    email: EmailStr                    
    password: str
    mobile: Optional[str] = None
    role: Optional[str] = "user"

    
    def get_username(self) -> str:
        return self.username or self.name or "User"



class UserLogin(BaseModel):
    email: EmailStr
    password: str



class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    mobile: Optional[str] = None

    class Config:
        from_attributes = True  