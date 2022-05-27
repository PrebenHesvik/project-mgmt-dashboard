from datetime import date
from pydantic import BaseModel
from .employees import EmployeeResponse


class CommentBase(BaseModel):
    comment_text: str
    inspection_id: int


class CommentResponse(BaseModel):
    comment_text: str
    inspection_id: int
    date_created: date
    comment_id: int
    employee: EmployeeResponse

    class Config:
        orm_mode = True
