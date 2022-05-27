from datetime import date
from pydantic import BaseModel
from .employees import EmployeeResponse


class AssignmentBase(BaseModel):
    employee_id: int
    inspection_id: int


class AssignmentResponse(BaseModel):
    inspection_id: int
    assignment_id: int
    date_created: date
    employee: EmployeeResponse

    class Config:
        orm_mode = True
