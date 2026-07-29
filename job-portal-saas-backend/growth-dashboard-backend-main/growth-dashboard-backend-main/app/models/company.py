from sqlalchemy import Column, Integer, String
from app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    email = Column(String, unique=True)
    website = Column(String)
    location = Column(String)
    description = Column(String)