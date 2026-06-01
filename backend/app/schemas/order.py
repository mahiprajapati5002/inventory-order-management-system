from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.customer import CustomerRead
from app.schemas.product import ProductRead


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: ProductRead | None = None

    model_config = {"from_attributes": True}


class OrderRead(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    customer: CustomerRead | None = None
    items: list[OrderItemRead] = []

    model_config = {"from_attributes": True}

