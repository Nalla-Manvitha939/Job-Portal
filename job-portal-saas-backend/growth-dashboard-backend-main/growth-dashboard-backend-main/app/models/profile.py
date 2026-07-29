from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    first_name = Column(String, default="")
    last_name = Column(String, default="")

    phone = Column(String, default="")
    location = Column(String, default="")

    headline = Column(String, default="")

    bio = Column(Text, default="")

    skills = Column(Text, default="[]")

    experience = Column(Text, default="[]")

    education = Column(Text, default="[]")

    resume = Column(String, default="")

    profile_image = Column(Text, default="")