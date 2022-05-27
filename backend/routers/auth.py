from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from .. import database, oauth2
from ..oauth2 import get_current_user

from ..models import User, Employee
from ..schemas.users import Token, CurrentUserResponse
from ..utils import verify

router = APIRouter(prefix="/login", tags=["Authentication"])

# Link to site with information on OAuthPasswordRequestForm
# https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/


@router.post("", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if user and verify(form_data.password, user.password):
        current_employee = (
            db.query(Employee.employee_id, Employee.name, Employee.region_name)
            .filter(form_data.username == Employee.email)
            .first()
        )
        access_token = oauth2.create_access_token(data={"user_id": user.user_id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "employee": current_employee,
        }
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid Credentials",
    )


@router.get("/user", response_model=CurrentUserResponse)
def get_current_employee_data(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(
            Employee.employee_id, Employee.name, Employee.region_name, Employee.position
        )
        .filter(current_user == Employee.employee_id)
        .first()
    )
