from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def list_products(db: Session) -> list[Product]:
    return list(db.scalars(select(Product).order_by(Product.id.desc())).all())


def get_product(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def _ensure_unique_sku(db: Session, sku: str, product_id: int | None = None) -> None:
    existing = db.scalar(select(Product).where(Product.sku == sku))
    if existing and existing.id != product_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product SKU already exists")


def create_product(db: Session, payload: ProductCreate) -> Product:
    _ensure_unique_sku(db, payload.sku)
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, payload: ProductUpdate) -> Product:
    product = get_product(db, product_id)
    data = payload.model_dump(exclude_unset=True)
    if "sku" in data:
        _ensure_unique_sku(db, data["sku"], product_id)
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)
    db.delete(product)
    db.commit()

