from fastapi import APIRouter
from app.database import SessionLocal
from app.models.company import Company
from app.schemas.company import CompanyCreate

router = APIRouter()


@router.post("/company")
def create_company(company: CompanyCreate):
    db = SessionLocal()

    new_company = Company(
        name=company.name,
        email=company.email,
        website=company.website,
        location=company.location,
        description=company.description
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    db.close()

    return {
        "message": "Company created successfully",
        "company": new_company
    }



@router.get("/company")
def get_companies():
    db = SessionLocal()
    companies = db.query(Company).all()
    db.close()
    return companies



@router.put("/company/{company_id}")
def update_company(company_id: int, company: CompanyCreate):
    db = SessionLocal()

    db_company = db.query(Company).filter(Company.id == company_id).first()

    if not db_company:
        db.close()
        return {"message": "Company not found"}

    db_company.name = company.name
    db_company.email = company.email
    db_company.website = company.website
    db_company.location = company.location
    db_company.description = company.description

    db.commit()
    db.refresh(db_company)
    db.close()

    return {
        "message": "Company updated successfully",
        "company": db_company
    }


@router.delete("/company/{company_id}")
def delete_company(company_id: int):
    db = SessionLocal()

    db_company = db.query(Company).filter(Company.id == company_id).first()

    if not db_company:
        db.close()
        return {"message": "Company not found"}

    db.delete(db_company)
    db.commit()
    db.close()

    return {
        "message": "Company deleted successfully"
    }