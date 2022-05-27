from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from ..database_strategies import CommitData
from ..models import User
from ..schemas.users import UserCreate, UserResponse
from ..oauth2 import get_current_user
from ..utils import hash_password

router = APIRouter(prefix="/users", tags=["User"])


@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    # current_user: int = Depends(get_current_user),
):
    return db.query(User).all()


@router.get("/{user_id}", response_model=list[UserResponse])
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with id of "{id}" does not exist',
        )
    return user


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(
    user: UserCreate,
    # current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user.password = hash_password(user.password)
    new_user = User(**user.dict())
    with CommitData(db, new_user):
        return new_user
