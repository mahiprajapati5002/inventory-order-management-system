from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import DashboardRead
from app.services.orders import dashboard

router = APIRouter()


@router.get("", response_model=DashboardRead)
def get_dashboard(db: Session = Depends(get_db)):
    return dashboard(db)

