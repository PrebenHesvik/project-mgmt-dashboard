from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Employee, Customer
from ..schemas.constraints import ConstraintResponse
from ..oauth2 import get_current_user

from ..schemas.validators import POSITIONS, INSPECTION_STATUS

router = APIRouter(prefix="/constraints", tags=["Constraint"])


@router.get("/", response_model=ConstraintResponse)
def get_constraints(
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    user_region = (
        db.query(Employee.region_name)
        .filter(Employee.employee_id == current_user)
        .scalar()
    )

    employees = (
        db.query(Employee.employee_id, Employee.name)
        .filter(Employee.region_name == user_region)
        .all()
    )

    customers = (
        db.query(Customer.name, Customer.customer_id)
        .filter(Customer.region_name == user_region)
        .all()
    )

    return {
        "regions": [user_region],
        "positions": list(POSITIONS),
        "wo_status": list(INSPECTION_STATUS),
        "employees": employees,
        "customers": customers,
    }
