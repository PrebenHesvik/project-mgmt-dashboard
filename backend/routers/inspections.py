from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from backend.schemas.validators import REGIONS
from ..database import get_db
from ..schemas.inspections import (
    InspectionCreate,
    InspectionBase,
    InspectionResponseBase,
)
from ..database_strategies import UpdataData, DeleteData, CommitData
from ..oauth2 import get_current_user
from ..models import Customer, Employee, Inspection

router = APIRouter(prefix="/inspections", tags=["Inspection"])


@router.get("/", response_model=list[InspectionResponseBase])
def get_inspections(
    db: Session = Depends(get_db), current_user: int = Depends(get_current_user)
):
    if (
        employee := db.query(Employee)
        .filter(Employee.employee_id == current_user)
        .first()
    ):

        if employee.position in ["Serviceleder", "Servicemontør"]:
            db_filter = Customer.region_name == employee.region_name
        else:
            db_filter = Customer.region_name.in_(REGIONS)

        return (
            db.query(Inspection)
            .join(
                Customer, Inspection.customer_id == Customer.customer_id, isouter=True
            )
            .filter(db_filter)
            .all()
        )


@router.post("/", response_model=InspectionBase)
def create_inspection(
    inspection: InspectionCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_inspection = Inspection(
        created_by_employee_id=current_user, **inspection.dict()
    )
    with CommitData(db, new_inspection):
        return new_inspection


@router.get("/{inspection_id}", response_model=InspectionResponseBase)
def get_one_inspection(
    inspection_id: int,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    inspection = (
        db.query(Inspection).filter(Inspection.inspection_id == inspection_id).first()
    )

    if inspection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id of <{inspection_id}> was not found",
        )
    return inspection


@router.delete("/{inspection_id}")
def delete_inspection(
    inspection_id: str,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Inspection).filter(Inspection.inspection_id == inspection_id).first()
    )
    delete = DeleteData(db, query, inspection_id, router.tags[0])
    delete.run()


@router.put("/{inspection_id}", response_model=InspectionResponseBase)
def update_inspection(
    inspection_id: int,
    updated_inspection: InspectionCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Inspection).filter(Inspection.inspection_id == inspection_id)
    update = UpdataData(db, query, updated_inspection, inspection_id, router.tags[0])
    return update.run()
