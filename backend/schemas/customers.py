from datetime import date
from pydantic import BaseModel, root_validator
from .validators import validate_region


class Employee(BaseModel):
    employee_id: int
    name: str

    class Config:
        orm_mode = True


class CustomerCreate(BaseModel):
    name: str
    street: str
    postal_code: int
    postal_name: str
    municipality: str
    region_name: str
    is_active: bool = True

    _region_validator = root_validator(allow_reuse=True)(validate_region)


class CustomerBase(BaseModel):
    name: str
    street: str
    postal_code: int
    postal_name: str
    municipality: str
    region_name: str
    customer_id: int
    created_by_employee_id: int
    created_by_employee: Employee
    date_created: date
    updated_by_employee_id: int | None = None
    updated_by_employee: Employee | None = None
    date_updated: date | None = None
    is_active: bool

    class Config:
        orm_mode = True


class CustomerResponse(BaseModel):
    Customer: CustomerBase
    open_projects: int
    total_projects: int

    class Config:
        orm_mode = True


class CustomerResponseSingle(BaseModel):
    name: str
    street: str
    postal_code: int
    postal_name: str
    municipality: str
    region_name: str
    customer_id: int
    created_by_employee_id: int
    created_by_employee: Employee
    date_created: date
    updated_by_employee_id: int | None = None
    updated_by_employee: Employee | None = None
    date_updated: date | None = None
    is_active: bool
    inspections: list | None = None

    class Config:
        orm_mode = True
