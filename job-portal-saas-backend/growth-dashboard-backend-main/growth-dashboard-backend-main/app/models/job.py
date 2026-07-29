from sqlalchemy import Column, Integer, String,DateTime
from datetime import datetime
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    location = Column(String)
    salary = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)