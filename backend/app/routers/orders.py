from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.order import OrderCreate, OrderRead
from app.services import orders

router = APIRouter()


@router.get("", response_model=list[OrderRead])
def list_orders(db: Session = Depends(get_db)):
    return orders.list_orders(db)


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    return orders.create_order(db, payload)


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return orders.get_order(db, order_id)

