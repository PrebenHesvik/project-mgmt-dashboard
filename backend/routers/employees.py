from collections import Counter
from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from ..models import Employee
from ..database import get_db
from ..oauth2 import get_current_user
from ..schemas.employees import EmployeeCreate, EmployeeResponse
from ..database_strategies import UpdataData, CommitData, DeleteData

router = APIRouter(prefix="/employees", tags=["Employee"])


@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    if (
        employee := db.query(Employee)
        .filter(Employee.employee_id == current_user)
        .first()
    ):
        if employee.position in ["Serviceleder", "Servicemontør"]:
            db_filter = Employee.region_name == employee.region_name
            return db.query(Employee).filter(db_filter).all()
        if employee.position in ["Admin", "Leder"]:
            return db.query(Employee).order_by(Employee.name).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not determine current user",
        )


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=EmployeeCreate)
def create_employees(
    employee: EmployeeCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_employee = Employee(**employee.dict())
    with CommitData(db, new_employee):
        return new_employee


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with email <{employee_id}> was not found",
        )

    assignments = [a.inspection.inspection_year for a in employee.assignments]
    employee.assignments_count = Counter(assignments)

    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Employee).filter(Employee.employee_id == employee_id)
    delete = DeleteData(db, query, employee_id, router.tags[0])
    return delete.run()


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    updated_employee: EmployeeCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Employee).filter(Employee.employee_id == employee_id)
    update = UpdataData(db, query, updated_employee, employee_id, router.tags[0])
    return update.run()
