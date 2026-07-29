from fastapi import APIRouter
from sqlalchemy import func,extract
from app.database import SessionLocal
from app.models.job import Job
from app.models.user import User
from app.models.application import Application
from app.schemas.job import JobCreate

router = APIRouter()

@router.post("/jobs")
def add_job(job: JobCreate):
    db = SessionLocal()

    new_job = Job(
        title=job.title,
        company=job.company,
        location=job.location,
        salary=job.salary
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job added successfully",
        "job": new_job
    }


@router.get("/jobs")
def get_jobs():
    db = SessionLocal()
    jobs = db.query(Job).all()
    return jobs
@router.put("/jobs/{job_id}")
def update_job(job_id: int, job: JobCreate):
    db = SessionLocal()

    db_job = db.query(Job).filter(Job.id == job_id).first()

    if not db_job:
        return {"message": "Job not found"}

    db_job.title = job.title
    db_job.company = job.company
    db_job.location = job.location
    db_job.salary = job.salary

    db.commit()
    db.refresh(db_job)

    return {
        "message": "Job updated successfully",
        "job": db_job
    }

@router.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    db = SessionLocal()

    db_job = db.query(Job).filter(Job.id == job_id).first()

    if not db_job:
        return {"message": "Job not found"}

    db.delete(db_job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }

@router.get("/dashboard")
def dashboard():
    db = SessionLocal()

    total_jobs = db.query(Job).count()
    total_companies = db.query(func.count(func.distinct(Job.company))).scalar()

    return {
        "total_jobs": total_jobs,
        "total_companies": total_companies
    }

@router.get("/dashboard/company-trends")
def company_trends():
    db = SessionLocal()

    trends = (
        db.query(
            Job.company,
            func.count(Job.id).label("jobs")
        )
        .group_by(Job.company)
        .all()
    )

    result = []

    for company, jobs in trends:
        result.append({
            "company": company,
            "jobs": jobs
        })
    db.close()

    return result

@router.get("/dashboard/monthly-growth")
def monthly_growth():
    db = SessionLocal()

    growth = (
        db.query(
            extract("month", Job.created_at).label("month"),
            func.count(Job.id).label("jobs")
        )
        .group_by(extract("month", Job.created_at))
        .order_by(extract("month", Job.created_at))
        .all()
    )

    month_names = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    }

    result = []

    for month, jobs in growth:
        result.append({
            "month": month_names[int(month)],
            "jobs": jobs
        })
    db.close()
    return result
@router.get("/dashboard/top-companies")
def top_companies():
    db = SessionLocal()

    companies = (
        db.query(
            Job.company,
            func.count(Job.id).label("jobs")
        )
        .group_by(Job.company)
        .order_by(func.count(Job.id).desc())
        .limit(5)
        .all()
    )

    result = []

    for company, jobs in companies:
        result.append({
            "company": company,
            "jobs": jobs
        })
    db.close()
    return result
@router.get("/dashboard/recent-jobs")
def recent_jobs():
    db = SessionLocal()

    jobs = (
        db.query(Job)
        .order_by(Job.created_at.desc())
        .limit(5)
        .all()
    )

    db.close()
    return jobs
@router.get("/dashboard/total-users")
def total_users():
    db = SessionLocal()

    total_users = db.query(User).count()

    return {
        "total_users": total_users
    }

@router.get("/dashboard/total-managers")
def total_managers():
    db = SessionLocal()

    total_managers = db.query(User).filter(User.role == "manager").count()

    return {
        "total_managers": total_managers
    }
@router.get("/dashboard/total-applications")
def total_applications():
    db = SessionLocal()

    total_applications = db.query(Application).count()

    return {
        "total_applications": total_applications
    }

@router.post("/apply/{job_id}")
def apply_job(job_id: int, user_id: int):
    db = SessionLocal()

    application = Application(
        user_id=user_id,
        job_id=job_id
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Applied successfully",
        "application": application
    }

@router.get("/dashboard/application-status")
def application_status():
    db = SessionLocal()

    status_data = (
        db.query(
            Application.status,
            func.count(Application.id).label("count")
        )
        .group_by(Application.status)
        .all()
    )

    result = []

    for status, count in status_data:
        result.append({
            "status": status,
            "count": count
        })
    db.close()
    return result

@router.get("/manager/applications")
def manager_applications():
    db = SessionLocal()

    applications = (
        db.query(
            Application.id.label("application_id"),
            User.username,
            Job.title,
            Application.status
        )
        .join(User, User.id == Application.user_id)
        .join(Job, Job.id == Application.job_id)
        .all()
    )

    result = []

    for app in applications:
        result.append({
            "application_id": app.application_id,
            "username": app.username,
            "job_title": app.title,
            "status": app.status
        })

    db.close()
    return result
@router.put("/manager/application/{application_id}/accept")
def accept_application(application_id: int):
    db = SessionLocal()

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        db.close()
        return {"message": "Application not found"}

    application.status = "Accepted"

    db.commit()
    db.refresh(application)
    db.close()

    return {
        "message": "Application Accepted",
        "status": application.status
    }


@router.put("/manager/application/{application_id}/reject")
def reject_application(application_id: int):
    db = SessionLocal()

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        db.close()
        return {"message": "Application not found"}

    application.status = "Rejected"

    db.commit()
    db.refresh(application)
    db.close()

    return {
        "message": "Application Rejected",
        "status": application.status
    }
@router.get("/dashboard/recent-users")
def recent_users():
    db = SessionLocal()

    users = (
        db.query(User)
        .order_by(User.id.desc())
        .limit(5)
        .all()
    )

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

    db.close()
    return result