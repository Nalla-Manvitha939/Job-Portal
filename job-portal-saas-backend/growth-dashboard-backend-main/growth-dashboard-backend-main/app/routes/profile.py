from fastapi import APIRouter, HTTPException
from app.database import SessionLocal
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate

router = APIRouter(tags=["Profile"])



@router.post("/profile/{user_id}")
def create_profile(user_id: int, profile: ProfileCreate):

    db = SessionLocal()

    existing = db.query(Profile).filter(Profile.user_id == user_id).first()

    if existing:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Profile already exists"
        )

    new_profile = Profile(
        user_id=user_id,

        first_name=profile.first_name,
        last_name=profile.last_name,

        phone=profile.phone,
        location=profile.location,

        headline=profile.headline,
        bio=profile.bio,

        skills=profile.skills,
        experience=profile.experience,
        education=profile.education,

        resume=profile.resume,
        profile_image=profile.profile_image
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    db.close()

    return {
        "message": "Profile created successfully",
        "profile": new_profile
    }



@router.get("/profile/{user_id}")
def get_profile(user_id: int):

    db = SessionLocal()

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    db.close()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile



@router.put("/profile/{user_id}")
def update_profile(user_id: int, profile: ProfileCreate):

    db = SessionLocal()

    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if not db_profile:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    db_profile.first_name = profile.first_name
    db_profile.last_name = profile.last_name

    db_profile.phone = profile.phone
    db_profile.location = profile.location

    db_profile.headline = profile.headline
    db_profile.bio = profile.bio

    db_profile.skills = profile.skills
    db_profile.experience = profile.experience
    db_profile.education = profile.education

    db_profile.resume = profile.resume
    db_profile.profile_image = profile.profile_image

    db.commit()
    db.refresh(db_profile)
    db.close()

    return {
        "message": "Profile updated successfully",
        "profile": db_profile
    }