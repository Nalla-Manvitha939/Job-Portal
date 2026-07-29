from pydantic import BaseModel


class ProfileCreate(BaseModel):
    first_name: str = ""
    last_name: str = ""

    phone: str = ""
    location: str = ""

    headline: str = ""
    bio: str = ""

    skills: str = "[]"
    experience: str = "[]"
    education: str = "[]"

    resume: str = ""
    profile_image: str = ""


class ProfileResponse(ProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True