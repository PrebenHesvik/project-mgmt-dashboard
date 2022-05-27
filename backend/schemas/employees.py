from datetime import date
from pydantic import BaseModel, EmailStr, root_validator
from .validators import validate_region


class EmployeeBase(BaseModel):
    name: str
    position: str
    email: EmailStr
    region_name: str
    is_active: bool = True

    class Config:
        orm_mode = True


class EmployeeCreate(EmployeeBase):
    _region_validator = root_validator(allow_reuse=True)(validate_region)


class EmployeeResponse(EmployeeBase):
    employee_id: int
    date_created: date
    is_active: bool
    assignments_count: dict | None = None

    class Config:
        orm_mode = True


class Employee(BaseModel):
    name: str

    class Config:
        orm_mode = True
