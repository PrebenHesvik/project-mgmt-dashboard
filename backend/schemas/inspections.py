from datetime import date
from pydantic import BaseModel, root_validator
from .validators import validate_inspection_status
from .comments import CommentResponse
from .assignments import AssignmentResponse
from .customers import CustomerBase
from .employees import EmployeeResponse


class InspectionBase(BaseModel):
    customer_id: int
    description: str
    status: str
    inspection_year: int
    inspection_month: str

    class Config:
        orm_mode = True


class InspectionCreate(InspectionBase):
    status_validator = root_validator(allow_reuse=True)(validate_inspection_status)


class InspectionResponseBase(BaseModel):
    inspection_id: int
    customer_id: int
    description: str
    status: str
    date_created: date
    created_by_employee_id: int
    inspection_year: int
    inspection_month: str
    assigned_employees: list[AssignmentResponse] | None = None
    comments: list[CommentResponse] | None = None
    customer: CustomerBase
    employee: EmployeeResponse

    class Config:
        orm_mode = True


class InspectionResponse(BaseModel):
    inspection: InspectionResponseBase

    class Config:
        orm_mode = True
