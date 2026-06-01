from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def list_customers(db: Session) -> list[Customer]:
    return list(db.scalars(select(Customer).order_by(Customer.id.desc())).all())


def get_customer(db: Session, customer_id: int) -> Customer:
    customer = db.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


def _ensure_unique_email(db: Session, email: str, customer_id: int | None = None) -> None:
    existing = db.scalar(select(Customer).where(Customer.email == email))
    if existing and existing.id != customer_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Customer email already exists")


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    _ensure_unique_email(db, str(payload.email))
    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update_customer(db: Session, customer_id: int, payload: CustomerUpdate) -> Customer:
    customer = get_customer(db, customer_id)
    data = payload.model_dump(exclude_unset=True)
    if "email" in data:
        _ensure_unique_email(db, str(data["email"]), customer_id)
    for key, value in data.items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_customer(db, customer_id)
    db.delete(customer)
    db.commit()

