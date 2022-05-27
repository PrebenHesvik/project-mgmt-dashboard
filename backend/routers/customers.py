from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func, case, literal_column

from backend.schemas.validators import REGIONS
from ..database import get_db
from ..models import Customer, Employee, Inspection
from ..schemas.customers import (
    CustomerCreate,
    CustomerBase,
    CustomerResponse,
    CustomerResponseSingle,
)
from ..database_strategies import UpdataData, DeleteData, CommitData
from ..oauth2 import get_current_user

router = APIRouter(prefix="/customers", tags=["Customer"])


@router.get("/", response_model=list[CustomerResponse])
def get_customers(
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
            db.query(
                Customer,
                func.count(
                    case(
                        [((Inspection.status == "Pågår"), Inspection.inspection_id)],
                        else_=literal_column("NULL"),
                    )
                ).label("open_projects"),
                func.count(Inspection.status.notin_(["Avlyst"])).label(
                    "total_projects"
                ),
            )
            .join(
                Inspection, Customer.customer_id == Inspection.customer_id, isouter=True
            )
            .filter(db_filter)
            .group_by(Customer.customer_id)
            .all()
        )


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CustomerBase)
def create_customer(
    customer: CustomerCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_customer = Customer(created_by_employee_id=current_user, **customer.dict())
    with CommitData(db, new_customer):
        return new_customer


@router.get("/{customer_id}", response_model=CustomerResponseSingle)
def get_customer(
    customer_id: int,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with customer customer_id <{customer_id}> was not found",
        )
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Customer).filter(Customer.customer_id == customer_id)
    delete = DeleteData(db, query, customer_id, router.tags[0])
    return delete.run()


@router.put("/{customer_id}", response_model=CustomerBase)
def update_customer(
    customer_id: int,
    updated_customer: CustomerCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer_dict = updated_customer.dict()
    customer_dict["updated_by_employee_id"] = current_user

    query = db.query(Customer).filter(Customer.customer_id == customer_id)
    update = UpdataData(db, query, customer_dict, customer_id, router.tags[0])
    return update.run()
