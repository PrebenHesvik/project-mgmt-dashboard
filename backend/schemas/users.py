from pydantic import BaseModel, EmailStr
from typing import Optional


class UserResponse(BaseModel):
    user_id: int
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_active: bool = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class CurrentUserResponse(BaseModel):
    employee_id: int
    name: str
    region_name: str
    position: str

    class Config:
        orm_mode = True


class Employee(BaseModel):
    employee_id: int
    name: str
    region_name: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
    employee: Employee


class TokenData(BaseModel):
    user_id: str
