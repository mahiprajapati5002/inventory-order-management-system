from app.schemas.order import OrderRead
from app.schemas.product import ProductRead
from pydantic import BaseModel


class DashboardRead(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    revenue: float
    low_stock_products: list[ProductRead]
    recent_orders: list[OrderRead]

