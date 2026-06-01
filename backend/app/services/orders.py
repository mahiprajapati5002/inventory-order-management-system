from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def list_orders(db: Session) -> list[Order]:
    return list(
        db.scalars(
            select(Order)
            .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
            .order_by(Order.id.desc())
        )
        .unique()
        .all()
    )


def get_order(db: Session, order_id: int) -> Order:
    order = db.scalar(
        select(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .where(Order.id == order_id)
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def create_order(db: Session, payload: OrderCreate) -> Order:
    customer = db.get(Customer, payload.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    quantities_by_product: dict[int, int] = {}
    for item in payload.items:
        quantities_by_product[item.product_id] = quantities_by_product.get(item.product_id, 0) + item.quantity

    products = {
        product.id: product
        for product in db.scalars(select(Product).where(Product.id.in_(quantities_by_product.keys()))).all()
    }

    missing_ids = set(quantities_by_product) - set(products)
    if missing_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Products not found: {sorted(missing_ids)}")

    total = Decimal("0.00")
    for product_id, quantity in quantities_by_product.items():
        product = products[product_id]
        if product.stock_quantity < quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.sku}",
            )
        total += Decimal(str(product.price)) * quantity

    order = Order(customer_id=payload.customer_id, total_amount=total, status="placed")
    db.add(order)
    db.flush()

    for product_id, quantity in quantities_by_product.items():
        product = products[product_id]
        product.stock_quantity -= quantity
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product_id,
                quantity=quantity,
                unit_price=product.price,
            )
        )

    db.commit()
    return get_order(db, order.id)


def dashboard(db: Session) -> dict:
    revenue = db.scalar(select(func.coalesce(func.sum(Order.total_amount), 0))) or 0
    return {
        "total_products": db.scalar(select(func.count(Product.id))) or 0,
        "total_customers": db.scalar(select(func.count(Customer.id))) or 0,
        "total_orders": db.scalar(select(func.count(Order.id))) or 0,
        "revenue": float(revenue),
        "low_stock_products": list(
            db.scalars(select(Product).where(Product.stock_quantity <= 5).order_by(Product.stock_quantity.asc()).limit(5)).all()
        ),
        "recent_orders": list(
            db.scalars(
                select(Order)
                .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
                .order_by(Order.created_at.desc())
                .limit(5)
            )
            .unique()
            .all()
        ),
    }

