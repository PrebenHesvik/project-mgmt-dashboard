from pydantic import BaseModel


class Employee(BaseModel):
    employee_id: int
    name: str


class ConstraintResponse(BaseModel):
    regions: list
    positions: list
    wo_status: list
    employees: list[Employee]
    customers: list

    class Config:
        orm_mode = True
